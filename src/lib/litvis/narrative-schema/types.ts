import { VFile, VFileBase, VFileMessage } from "vfile";
import { LitvisDocument } from "../document";

export { VFile } from "vfile";

export enum LabelType {
  SINGLE = "single",
  PAIRED_OPENING = "paired_opening",
  PAIRED_CLOSING = "paired_closing",
  INVALID = "invalid",
}

export interface LabelKind {
  htmlTemplate: string;
}

export interface Label {
  name: string;
  single?: LabelKind;
  paired?: LabelKind;
}

export interface LabelWithOrigin extends Label {
  origin: NarrativeSchema;
}

export interface Rule {
  description: string;
  selector: {
    label: string;
  };
  minimumOccurrences?: number;
  maximumOccurrences?: number;
}
export interface RuleWithOrigin extends Rule {
  origin: NarrativeSchema;
}

export interface CssWithOrigin {
  content: string;
  origin: NarrativeSchema;
}

export interface NarrativeSchemaData {
  dependencies: string[];
  labels: Label[];
  rules: Rule[];
  css: string;
}

export type NarrativeSchema = VFile<{
  data: NarrativeSchemaData;
  dependencyOf?: NarrativeSchema | LitvisDocument;
}>;

export interface ComposedNarrativeSchema {
  components: NarrativeSchema[];
  labels: LabelWithOrigin[];
  rules: RuleWithOrigin[];
  css: CssWithOrigin[];
}
