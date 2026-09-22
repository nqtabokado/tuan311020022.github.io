<template>
  <section id="demo-api" class="lesson">
    <p class="lesson__part">Thử nghiệm</p>
    <h2 class="lesson__title">
      <span class="lesson__index">{{ index }}</span>
      Gọi API Flask thật
    </h2>

    <p class="para">
      Phần này không phải nội dung tĩnh: trang Vue đang gọi thật sang server Flask ở
      <code>{{ apiBaseUrl }}</code> — chính là app mà job <code>build-and-push</code>
      đóng thành Docker image. Nếu server chưa chạy, bạn sẽ thấy lỗi ngay bên dưới,
      và đó cũng là một bài học: client với server là hai thứ được deploy riêng.
    </p>

    <!-- ---------- Trạng thái server ---------- -->
    <div class="panel">
      <div class="panel__head">
        <h3>GET /health</h3>
        <button :disabled="loading" @click="check">
          {{ loading ? "Đang gọi..." : "Gọi lại" }}
        </button>
      </div>

      <p v-if="loading" class="muted">Đang kiểm tra...</p>

      <p v-else-if="error" class="status status--bad">
        <span class="dot dot--bad"></span>
        Không gọi được API: {{ error }}
      </p>

      <template v-else>
        <p class="status status--ok">
          <span class="dot dot--ok"></span>
          status = <strong>{{ status }}</strong>
        </p>
        <p v-if="greeting" class="muted">GET / → {{ greeting }}</p>
      </template>
    </div>

    <!-- ---------- Máy tính cộng ---------- -->
    <div class="panel">
      <div class="panel__head">
        <h3>GET /sum/&lt;a&gt;/&lt;b&gt;</h3>
      </div>

      <form class="calc" @submit.prevent="calculate">
        <input v-model.number="a" type="number" aria-label="Số a" />
        <span>+</span>
        <input v-model.number="b" type="number" aria-label="Số b" />
        <button type="submit" :disabled="summing">
          {{ summing ? "Đang tính..." : "Tính" }}
        </button>
      </form>

      <p v-if="sumError" class="status status--bad">{{ sumError }}</p>

      <p v-else-if="result !== null" class="status status--ok">
        Kết quả: <strong>{{ result }}</strong>
      </p>
    </div>
  </section>
</template>

<script>
import api from "../api/client";

export default {
  name: "ApiDemo",

  props: {
    index: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      status: null,
      greeting: "",
      loading: false,
      error: "",

      a: 2,
      b: 3,
      result: null,
      summing: false,
      sumError: "",
    };
  },

  computed: {
    apiBaseUrl() {
      return process.env.VUE_APP_API_BASE_URL || "http://localhost:5000";
    },
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

    async calculate() {
      // Route Flask khai báo <int:a> nên chỉ nhận số nguyên;
      // gửi số lẻ sẽ bị 404, chặn sớm ở client cho rõ lỗi.
      if (!Number.isInteger(this.a) || !Number.isInteger(this.b)) {
        this.sumError = "Chỉ nhập số nguyên.";
        this.result = null;
        return;
      }

      this.summing = true;
      this.sumError = "";
      try {
        const data = await api.sum(this.a, this.b);
        this.result = data.result;
      } catch (e) {
        this.sumError = `Lỗi gọi API: ${e.message}`;
        this.result = null;
      } finally {
        this.summing = false;
      }
    },
  },
};
</script>

<style scoped>
.lesson {
  margin-bottom: 52px;
  scroll-margin-top: 76px;
}

.lesson__part {
  margin: 0 0 4px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
}

.lesson__title {
  margin: 0 0 18px;
  font-size: 21px;
  line-height: 1.35;
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.lesson__index {
  flex: none;
  font-size: 13px;
  font-weight: 600;
  color: #97a1ad;
  font-variant-numeric: tabular-nums;
}

.para {
  margin: 0 0 18px;
  line-height: 1.75;
}

.para code {
  background: #eef1f5;
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 12.5px;
}

.panel {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 14px 16px;
  margin-bottom: 14px;
  background: #fff;
}

.panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.panel__head h3 {
  margin: 0;
  font-size: 13px;
  font-family: "SFMono-Regular", Consolas, Menlo, monospace;
  color: #4a5563;
}

button {
  padding: 5px 12px;
  font-size: 13px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: #f6f8fa;
  cursor: pointer;
}

button:hover:not(:disabled) {
  background: #eef1f5;
}

button:disabled {
  opacity: 0.55;
  cursor: default;
}

.calc {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.calc input {
  width: 78px;
  padding: 5px 8px;
  font-size: 13px;
  border: 1px solid var(--line);
  border-radius: 6px;
}

.status {
  margin: 0;
  font-size: 13.5px;
}

.status--ok {
  color: #1d7a42;
}

.status--bad {
  color: #c0392b;
}

.muted {
  margin: 6px 0 0;
  color: #6b7480;
  font-size: 13px;
}

.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}

.dot--ok {
  background: #1d7a42;
}

.dot--bad {
  background: #c0392b;
}
</style>
