import { readdir, readFile, remove, stat } from "fs-extra";
import produce from "immer";
import { relative, resolve } from "path";
import { execFile, writeFile } from "../../../utility";

export interface ElmSymbol {
  name: string;
  type?: string;
}

export function findIntroducedSymbols(code: string): ElmSymbol[] {
  const result: ElmSymbol[] = [];
  code.split("\n").forEach((line) => {
    const match = line.match(
      /^([_a-zA-Z][_a-zA-Z0-9]{0,})\s*\:\s*([_a-zA-Z][_a-zA-Z0-9]{0,})\s*$/,
    );
    if (match) {
      result.push({
        name: match[1],
        type: match[2],
      });
    }
  });

  return result;
}
