module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended"],
  parserOptions: {
    parser: "@babel/eslint-parser",
  },
  rules: {
    // Trong CI, console.log / debugger còn sót lại sẽ bị báo lỗi.
    "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn",
  },
  overrides: [
    {
      files: ["**/tests/unit/**/*.spec.js"],
      env: { jest: true },
    },
  ],
};
