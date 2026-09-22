const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    port: 8080,
  },

  configureWebpack: {
    // Vue CLI 5 (webpack 5) + Vue 2.7 sinh warning giả "export 'default'
    // (imported as 'style0') was not found" cho mọi SFC có <style scoped>.
    // CSS vẫn được build đúng, nên bỏ qua để log build sạch.
    ignoreWarnings: [/imported as 'style0'/],
  },
});
