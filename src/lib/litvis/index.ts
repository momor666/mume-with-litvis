import * as _ from "lodash";
import { Text } from "unist";
import { NodeWithPosition } from "vfile";
import { AttributeDerivatives, OutputFormat } from "./attribute-derivatives";
import { Cache } from "./cache";
import { LitvisDocument } from "./document";
import {
  ensureEnvironment,
  EnvironmentStatus,
  ProgramResult,
  ProgramResultStatus,
  runProgram,
} from "./elm";
import {
  extractComposedNarrativeSchema,
  extractElmEnvironmentSpec,
  loadLitvisNarrative,
  processElmContexts,
  processNarrativeSchemaLabels,
} from "./narrative";
import { LitvisNarrative } from "./narrative";

export interface CodeBlockWithFile extends Text {
  data: {
    file: LitvisDocument;
    litvisAttributeDerivatives: AttributeDerivatives;
  };
}

export interface OutputExpression extends NodeWithPosition {
  data: {
    text: string;
    outputFormat: OutputFormat;
    stringRepresentation?: string;
    // value?: any;
  };
}

export interface OutputExpressionWithFile extends OutputExpression {
  data: {
    file: LitvisDocument;
    text: string;
    outputFormat: OutputFormat;
    stringRepresentation?: string;
    // value?: any;
  };
}

export import ProcessedLitvisContextStatus = ProgramResultStatus;

export interface ProcessedLitvisContext {
  name: string;
  status: ProcessedLitvisContextStatus;
  evaluatedOutputExpressions: OutputExpression[];
}

export async function loadAndProcessLitvisNarrative(
  filePath,
  filesInMemory: LitvisDocument[] = [],
  cache: Cache,
): Promise<LitvisNarrative> {
  const narrative = await loadLitvisNarrative(filePath, filesInMemory, cache);
  await extractElmEnvironmentSpec(narrative);
  await extractComposedNarrativeSchema(narrative);
  await processElmContexts(narrative, cache);
  await processNarrativeSchemaLabels(narrative);
  return narrative;
}
