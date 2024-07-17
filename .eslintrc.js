module.exports = {
  extends: [
    "react-app",
    "react-app/jest",
  ],
  settings: {
    react: {
      version: "detect"
    }
  },
  env: {
    browser: true,
    jest: true,
  },
  rules: {
    "semi": [2, "always"],
    "comma-dangle": [
      "error",
      {
        "arrays": "always-multiline",
        "objects": "always-multiline",
        "imports": "always-multiline",
        "exports": "always-multiline",
        "functions": "never",
      },
    ],
    "no-unused-expressions": "off",
    "no-unused-vars": "off",
    "dot-notation": "off",
    "camelcase": "off",
    "@typescript-eslint/no-unused-expressions": [
      "error",
      {
        "allowShortCircuit": true,
        "allowTernary": true,
        "allowTaggedTemplates": true
      }
    ],
    "@typescript-eslint/no-unused-vars": ["warn", {
      "ignoreRestSiblings": true,
      "argsIgnorePattern": "^_",
    }],
    "react/prop-types": "off",
    "react/display-name": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "import/order": ["error", {
      "newlines-between": "always-and-inside-groups",
      "groups": ["builtin", "external", ["parent", "sibling"], "index"],
      "alphabetize": {
        "order": "asc",
        "caseInsensitive": true,
      },
    }],
    "import/no-default-export": "error",
  },
};
