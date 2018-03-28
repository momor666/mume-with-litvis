import { flow } from "lodash";
import {
  normalizeAttributes,
  parseAttributes,
} from "../../../src/lib/attributes";
import { extractAttributeDerivatives } from "../../../src/lib/litvis/attribute-derivatives";
const testCasesForExtractAttributeDerivatives = [
  {
    rawAttributes: ["l", "literate", "literate=true"],
    expectedDerivatives: {
      contextName: "default",
      outputFormats: ["l"],
      outputExpressionsByFormat: {},
    },
  },
  {
    rawAttributes: ["l v", "literate visualize", "l=true visualize=true"],
    expectedDerivatives: {
      contextName: "default",
      outputFormats: ["l", "v"],
      outputExpressionsByFormat: {},
    },
  },
  {
    rawAttributes: ["v l", "visualize literate ", "visualize=true l=true"],
    expectedDerivatives: {
      contextName: "default",
      outputFormats: ["v", "l"],
      outputExpressionsByFormat: {},
    },
  },
  {
    rawAttributes: [
      "v l=hidden",
      "l=hidden v",
      "l v hide",
      "visualize=true hide l",
    ],
    expectedDerivatives: {
      contextName: "default",
      outputFormats: ["v"],
      outputExpressionsByFormat: {},
    },
  },
  {
    rawAttributes: ["v"],
    expectedDerivatives: {
      contextName: "default",
      outputFormats: ["v"],
      outputExpressionsByFormat: {},
    },
  },
  {
    rawAttributes: ["j l r v"],
    expectedDerivatives: {
      contextName: "default",
      outputFormats: ["j", "l", "r", "v"],
      outputExpressionsByFormat: {},
    },
  },
  {
    rawAttributes: ["v r context=42 l j"],
    expectedDerivatives: {
      contextName: "42",
      outputFormats: ["v", "r", "l", "j"],
      outputExpressionsByFormat: {},
    },
  },
  {
    rawAttributes: ["v r context=x l j"],
    expectedDerivatives: {
      contextName: "x",
      outputFormats: ["v", "r", "l", "j"],
      outputExpressionsByFormat: {},
    },
  },
  {
    rawAttributes: ["l context=hello"],
    expectedDerivatives: {
      contextName: "hello",
      outputFormats: ["l"],
      outputExpressionsByFormat: {},
    },
  },
  {
    rawAttributes: ["l context=hello", 'context=" hello " l=true'],
    expectedDerivatives: {
      contextName: "hello",
      outputFormats: ["l"],
      outputExpressionsByFormat: {},
    },
  },
  {
    rawAttributes: [
      "v=true context=true",
      'v=true literate=hidden context="true"',
      'hide=true v=true literate context="true"',
    ],
    expectedDerivatives: {
      contextName: "true",
      outputFormats: ["v"],
      outputExpressionsByFormat: {},
    },
  },
  {
    rawAttributes: [
      "j=a v=b l=c raw=[true]",
      "j=[a] visualize=[b] l=[c] r=[true]",
      'json=["a"] v=["b"] literate=["c"] r=["true"]',
    ],
    expectedDerivatives: {
      contextName: "default",
      outputFormats: ["j", "v", "l", "r"],
      outputExpressionsByFormat: {
        j: ["a"],
        r: ["true"],
        v: ["b"],
      },
    },
  },
  {
    rawAttributes: [
      "j=(a) l=((false)) raw=(((true)))) v=((((-42))))",
      "j=[(a)] l=[((false))] r=[(((true)))] v=[((((-42))))]",
    ],
    expectedDerivatives: {
      contextName: "default",
      outputFormats: ["j", "l", "r", "v"],
      outputExpressionsByFormat: {
        j: ["(a)"],
        r: ["(((true)))"],
        v: ["((((-42))))"],
      },
    },
  },
  {
    rawAttributes: [
      "j=[a, true, b, -42, (x)] r=[]",
      "j=[a true b -42 (x)] v=[]",
    ],
    expectedDerivatives: {
      contextName: "default",
      outputFormats: ["j"],
      outputExpressionsByFormat: {
        j: ["a", "true", "b", "-42", "(x)"],
      },
    },
  },
  {
    rawAttributes: [
      "v l=false",
      "l=false",
      "",
      "r v l j a b c d l=false",
      "context=x",
    ],
    expectedDerivatives: null,
  },
  {
    rawAttributes: [
      "l v interactive",
      "interactive=1 literate visualize",
      "l=true visualize=true interactive=true",
    ],
    expectedDerivatives: {
      contextName: "default",
      outputFormats: ["l", "v"],
      outputExpressionsByFormat: {},
      interactive: true,
    },
  },
  {
    rawAttributes: [
      "l v interactive=false",
      "interactive=false literate visualize",
    ],
    expectedDerivatives: {
      contextName: "default",
      outputFormats: ["l", "v"],
      outputExpressionsByFormat: {},
      interactive: false,
    },
  },
];

describe("lib/litvis", () => {
  testCasesForExtractAttributeDerivatives.map(
    ({ rawAttributes, expectedDerivatives }) => {
      rawAttributes.map((attributesAsString) => {
        it(`extractAttributeDerivatives() correctly processes ${attributesAsString}`, () => {
          const derivatives = flow([
            parseAttributes,
            normalizeAttributes,
            extractAttributeDerivatives,
          ])(attributesAsString);
          expect(derivatives).toEqual(expectedDerivatives);
        });
      });
    },
  );
});
