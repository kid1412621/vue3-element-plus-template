module.exports = {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-sass-guidelines",
    "stylelint-config-prettier",
  ],
  rules: {
    "selector-max-id": 3,
    "max-nesting-depth": 5,
    "selector-max-compound-selectors": 5,
  },
  ignoreFiles: ["dist/**", "node_modules/"],
};
