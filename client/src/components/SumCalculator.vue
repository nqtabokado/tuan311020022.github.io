<template>
  <section class="card">
    <h2>Gọi API /sum/&lt;a&gt;/&lt;b&gt;</h2>

    <form @submit.prevent="calculate">
      <input v-model.number="a" type="number" aria-label="Số a" />
      <span>+</span>
      <input v-model.number="b" type="number" aria-label="Số b" />
      <button type="submit" :disabled="loading">
        {{ loading ? "Đang tính..." : "Tính" }}
      </button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>

    <p v-else-if="result !== null" class="result">
      Kết quả: <strong>{{ result }}</strong>
    </p>
  </section>
</template>

<script>
import api from "../api/client";

export default {
  name: "SumCalculator",

  data() {
    return {
      a: 2,
      b: 3,
      result: null,
      loading: false,
      error: "",
    };
  },

  methods: {
    async calculate() {
      // Route Flask dùng <int:a> nên chỉ nhận số nguyên; gửi số lẻ sẽ bị 404.
      if (!Number.isInteger(this.a) || !Number.isInteger(this.b)) {
        this.error = "Chỉ nhập số nguyên.";
        this.result = null;
        return;
      }

      this.loading = true;
      this.error = "";
      try {
        const data = await api.sum(this.a, this.b);
        this.result = data.result;
      } catch (e) {
        this.error = `Lỗi gọi API: ${e.message}`;
        this.result = null;
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
  text-align: left;
}

h2 {
  margin-top: 0;
  font-size: 16px;
}

form {
  display: flex;
  align-items: center;
  gap: 8px;
}

input {
  width: 80px;
  padding: 6px;
}

button {
  padding: 6px 12px;
  cursor: pointer;
}

.error {
  color: #c0392b;
}

.result {
  font-size: 18px;
}
</style>
