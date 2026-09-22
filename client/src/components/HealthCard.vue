<template>
  <section class="card">
    <h2>Trạng thái server</h2>

    <p v-if="loading" class="muted">Đang kiểm tra...</p>

    <p v-else-if="error" class="error">
      Không gọi được API: {{ error }}
    </p>

    <p v-else class="ok">
      <span class="dot"></span>
      status = <strong>{{ status }}</strong>
    </p>

    <p v-if="greeting" class="muted">{{ greeting }}</p>

    <button :disabled="loading" @click="check">Kiểm tra lại</button>
  </section>
</template>

<script>
import api from "../api/client";

export default {
  name: "HealthCard",

  data() {
    return {
      status: null,
      greeting: "",
      loading: false,
      error: "",
    };
  },

  // Gọi API ngay khi component được gắn vào DOM.
  mounted() {
    this.check();
  },

  methods: {
    async check() {
      this.loading = true;
      this.error = "";
      try {
        const [health, hello] = await Promise.all([
          api.getHealth(),
          api.getGreeting(),
        ]);
        this.status = health.status;
        this.greeting = hello.message;
      } catch (e) {
        this.error = e.message;
        this.status = null;
        this.greeting = "";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.card {
  border: 1px solid #e2e2e2;
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 16px;
  text-align: left;
}

h2 {
  margin-top: 0;
  font-size: 16px;
}

.muted {
  color: #666;
}

.error {
  color: #c0392b;
}

.ok {
  color: #2c7a3f;
}

.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2c7a3f;
  margin-right: 6px;
}

button {
  padding: 6px 12px;
  cursor: pointer;
}
</style>
