<template>
  <div id="app">
    <h1>Vue 2 + Flask</h1>
    <p class="subtitle">Client gọi API tại {{ apiBaseUrl }}</p>

    <HealthCard />
    <SumCalculator />
  </div>
</template>

<script>
import HealthCard from "./components/HealthCard.vue";
import SumCalculator from "./components/SumCalculator.vue";

export default {
  name: "App",

  components: {
    HealthCard,
    SumCalculator,
  },

  computed: {
    apiBaseUrl() {
      return process.env.VUE_APP_API_BASE_URL || "http://localhost:5000";
    },
  },
};
</script>

<style>
body {
  margin: 0;
  background: #fafafa;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #2c3e50;
  max-width: 520px;
  margin: 0 auto;
  padding: 40px 20px;
}

h1 {
  margin-bottom: 4px;
}

.subtitle {
  color: #666;
  font-size: 13px;
  margin-top: 0;
  margin-bottom: 24px;
}
</style>
