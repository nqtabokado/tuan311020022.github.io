<template>
  <section id="quiz" class="lesson">
    <p class="lesson__part">Tự kiểm tra</p>
    <h2 class="lesson__title">
      <span class="lesson__index">{{ index }}</span>
      Làm thử {{ questions.length }} câu
    </h2>

    <div
      v-for="(q, qi) in questions"
      :key="q.id"
      class="q"
      :class="submitted ? (isCorrect(qi) ? 'q--right' : 'q--wrong') : ''"
    >
      <p class="q__text">{{ qi + 1 }}. {{ q.question }}</p>

      <label
        v-for="(opt, oi) in q.options"
        :key="oi"
        class="opt"
        :class="optionClass(qi, oi)"
      >
        <input
          type="radio"
          :name="q.id"
          :value="oi"
          :checked="picked[qi] === oi"
          :disabled="submitted"
          @change="pick(qi, oi)"
        />
        <span>{{ opt }}</span>
      </label>

      <p v-if="submitted" class="q__explain">{{ q.explain }}</p>
    </div>

    <div class="actions">
      <button v-if="!submitted" :disabled="!allAnswered" @click="submit">
        {{ allAnswered ? "Nộp bài" : `Còn ${remaining} câu chưa chọn` }}
      </button>

      <template v-else>
        <p class="score">
          Đúng <strong>{{ score }}/{{ questions.length }}</strong> — {{ comment }}
        </p>
        <button @click="reset">Làm lại</button>
      </template>
    </div>
  </section>
</template>

<script>
import questions from "../content/quiz";

export default {
  name: "QuizBox",

  props: {
    index: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      questions,
      // picked[i] = chỉ số đáp án đã chọn cho câu i, null nếu chưa chọn.
      picked: questions.map(() => null),
      submitted: false,
    };
  },

  computed: {
    remaining() {
      return this.picked.filter((p) => p === null).length;
    },

    allAnswered() {
      return this.remaining === 0;
    },

    score() {
      return this.questions.filter((q, i) => this.picked[i] === q.answer).length;
    },

    comment() {
      const ratio = this.score / this.questions.length;
      if (ratio === 1) return "trọn vẹn.";
      if (ratio >= 0.6) return "khá ổn, đọc lại phần sai là chắc.";
      return "nên đọc lại từ đầu trang.";
    },
  },

  methods: {
    pick(qi, oi) {
      // Vue 2 không phát hiện được phép gán theo chỉ số (this.picked[qi] = oi),
      // nên phải dùng this.$set thì giao diện mới cập nhật.
      this.$set(this.picked, qi, oi);
    },

    isCorrect(qi) {
      return this.picked[qi] === this.questions[qi].answer;
    },

    optionClass(qi, oi) {
      if (!this.submitted) return "";
      if (oi === this.questions[qi].answer) return "opt--right";
      if (this.picked[qi] === oi) return "opt--wrong";
      return "";
    },

    submit() {
      this.submitted = true;
    },

    reset() {
      this.picked = this.questions.map(() => null);
      this.submitted = false;
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

.q {
  border: 1px solid var(--line);
  border-left: 3px solid var(--line);
  border-radius: 8px;
  padding: 14px 16px;
  margin-bottom: 12px;
  background: #fff;
}

.q--right {
  border-left-color: #1d7a42;
}

.q--wrong {
  border-left-color: #c0392b;
}

.q__text {
  margin: 0 0 10px;
  font-weight: 600;
  line-height: 1.6;
}

.opt {
  display: flex;
  gap: 9px;
  align-items: flex-start;
  padding: 6px 9px;
  margin: 0 -9px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13.5px;
  line-height: 1.6;
}

.opt:hover {
  background: #f3f5f8;
}

.opt input {
  margin-top: 3px;
  flex: none;
}

.opt--right {
  background: #e9f6ee;
  color: #1d7a42;
  font-weight: 600;
}

.opt--wrong {
  background: #fdeceb;
  color: #c0392b;
  text-decoration: line-through;
}

.q__explain {
  margin: 10px 0 0;
  padding-top: 10px;
  border-top: 1px dashed var(--line);
  font-size: 13px;
  line-height: 1.7;
  color: #55606e;
}

.actions {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

button {
  padding: 7px 16px;
  font-size: 13.5px;
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

.score {
  margin: 0;
  font-size: 14px;
}
</style>
