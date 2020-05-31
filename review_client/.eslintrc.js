module.exports = {
  "parser": "babel-eslint",
  "extends": [
    "airbnb",
    "plugin:cypress/recommended",
    "plugin:react/recommended",
  ],
  "plugins": [
    "jest",
  ],
  "env": {
    "browser": true,
    "node": true,
    "jest/globals": true,
  },
  "ignorePatterns": ["cypress/plugins/*"],
  "rules": {
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "react/state-in-constructor": [0]
  }
}
