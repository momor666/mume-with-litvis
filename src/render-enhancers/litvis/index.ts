import * as LRU from "lru-cache";
import * as toVFile from "to-vfile";

import { VFile } from "vfile";
import { loadAndProcessLitvisNarrative } from "../../lib/litvis";
import { initCache as initLitvisCache } from "../../lib/litvis/cache";
import enhanceWithLitvisLiterateElm from "./literate-elm";
import enhanceWithLitvisNarrativeSchemas from "./narrative-schemas";
import { LitvisEnhancerCache } from "./types";

export * from "./types";

export async function initLitvisEnhancerCache(): Promise<LitvisEnhancerCache> {
  return {
    litvisCache: initLitvisCache(),
    successfulRenders: LRU(50),
  };
}

export default async function enhance(
  $: CheerioStatic,
  fileContents: string,
  filePath: string,
  cache: LitvisEnhancerCache,
  updateLintingReport: (vFiles: Array<VFile<{}>>) => void,
) {
  // process current file with litvis
  // TODO: pass all unsaved Atom files as virtual files
  const processedNarrative = await loadAndProcessLitvisNarrative(
    filePath,
    [
      toVFile({
        path: filePath,
        contents: fileContents,
      }),
    ],
    cache.litvisCache,
  );

  const vFilesToReport = [
    ...processedNarrative.files,
    ...processedNarrative.composedNarrativeSchema.components,
  ];
  updateLintingReport(vFilesToReport);

  // output messages to stdout
  // tslint:disable-next-line:no-console
  // console.log(
  //   report(vFilesToReport),
  // );

  await enhanceWithLitvisNarrativeSchemas($, processedNarrative, cache);
  await enhanceWithLitvisLiterateElm($, processedNarrative, cache);
}
