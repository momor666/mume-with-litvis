import * as visit from "unist-util-visit";
import { LitvisDocument } from ".";
import { parseBlockInfo } from "../../block-info/index";
import { extractAttributeDerivatives } from "../attribute-derivatives";

function visitCodeBlock(ast, vFile) {
  return visit(ast, "code", (codeBlockNode) => {
    if (!codeBlockNode.data) {
      codeBlockNode.data = {};
    }
    const parsedInfo = parseBlockInfo(codeBlockNode.lang || "");
    const normalizedLanguage = (parsedInfo.language || "").trim().toLowerCase();
    if (normalizedLanguage === "elm") {
      const attributeDerivatives = extractAttributeDerivatives(
        parsedInfo.attributes,
      );
      if (attributeDerivatives) {
        codeBlockNode.data.litvisAttributeDerivatives = attributeDerivatives;
        return;
      }
      // if ((codeBlockNode.lang || "").trim().length !== 3) {
      //   vFile.message(
      //     `Could not extract attribute derivatives from ${codeBlockNode.lang}`,
      //     codeBlockNode,
      //     "litvis:code-block-syntax",
      //   );
      // }
      return;
    }
  });
}

function visitTripleHatReference(ast, vFile: LitvisDocument) {
  return visit(ast, "tripleHatReference", (tripleHatReferenceNode) => {
    const parsedInfo = parseBlockInfo(tripleHatReferenceNode.data.info);
    if ((parsedInfo.language || "").toLowerCase() === "elm") {
      const attributeDerivatives = extractAttributeDerivatives(
        parsedInfo.attributes,
      );
      if (attributeDerivatives) {
        tripleHatReferenceNode.data.litvisAttributeDerivatives = attributeDerivatives;
        return;
      }
      vFile.message(
        `Could not extract attribute derivatives from ${
          tripleHatReferenceNode.data.info
        }`,
        tripleHatReferenceNode,
        "litvis:triple-hat-reference-syntax",
      );
      return;
    }
    vFile.message(
      `^^^ must be followed by elm (^^^elm)`,
      tripleHatReferenceNode,
      "litvis:triple-hat-reference-syntax",
    );
  });
}

export default function() {
  return function transformer(ast, vFile, next) {
    visitCodeBlock(ast, vFile);
    visitTripleHatReference(ast, vFile);

    if (typeof next === "function") {
      return next(null, ast, vFile);
    }

    return ast;
  };
}
