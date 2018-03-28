import { statSync } from "fs";
import * as _ from "lodash";
import { resolve } from "path";
import * as vfile from "vfile";
import { LitvisNarrative } from ".";
import { LitvisDocument } from "../document";
import { loadComposedNarrativeSchema } from "../narrative-schema";
import {
  ComposedNarrativeSchema,
  LabelWithOrigin,
  NarrativeSchema,
  RuleWithOrigin,
} from "../narrative-schema";

export default async (
  narrative: LitvisNarrative,
  filesInMemory: Array<vfile.VFile<{}>> = [],
): Promise<void> => {
  const dependencies = {};
  const sourceDirectories: string[] = [];
  const checkDirectoryPromises = [];
  _.forEach(narrative.files, (file: LitvisDocument, fileIndex) => {
    const narrativeSchemas = file.data.litvisNarrativeSchemas;
    if (fileIndex !== 0 && _.isArray(narrativeSchemas)) {
      file.message(
        `‘narrative-schemas’ key in frontmatter is only allowed in a root document (the one that does not have ‘follows’). Value ignored.`,
        null,
        "litvis:narrative-schemas",
      );
      return;
    }
  });
  narrative.composedNarrativeSchema = await loadComposedNarrativeSchema(
    narrative.files[0].data.litvisNarrativeSchemas,
    [narrative.files[0]],
    [],
    filesInMemory,
  );
};
