import { LabelType } from "./types";

export const START = "{(";
export const END = ")}";
export const START_CLOSING = "{|";
export const END_OPENING = "|}";

export const deriveType = (start: string, end: string): LabelType => {
  if (start === START && end === END) {
    return LabelType.SINGLE;
  }
  if (start === START && end === END_OPENING) {
    return LabelType.PAIRED_OPENING;
  }
  if (start === START_CLOSING && end === END) {
    return LabelType.PAIRED_CLOSING;
  }
  return LabelType.INVALID;
};
