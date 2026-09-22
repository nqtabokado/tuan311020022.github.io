module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  // Chỉ coi file *.spec.js trong tests/unit là test, tránh quét nhầm node_modules.
  testMatch: ["**/tests/unit/**/*.spec.js"],
};
