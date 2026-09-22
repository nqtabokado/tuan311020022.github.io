<template>
  <!-- :id để link ở sidebar nhảy tới được (#ci-cd-la-gi, #docker-la-gi, ...) -->
  <section :id="lesson.id" class="lesson">
    <p class="lesson__part">{{ lesson.part }}</p>
    <h2 class="lesson__title">
      <span class="lesson__index">{{ index }}</span>
      {{ lesson.title }}
    </h2>

    <ContentBlock
      v-for="(block, i) in lesson.blocks"
      :key="i"
      :block="block"
    />
  </section>
</template>

<script>
import ContentBlock from "./ContentBlock.vue";

export default {
  name: "LessonSection",

  components: { ContentBlock },

  props: {
    lesson: {
      type: Object,
      required: true,
    },
    // Số thứ tự bài, do component cha truyền xuống. Để cha quản lý số
    // thì thêm/bớt/đổi chỗ bài học không phải đánh số lại bằng tay.
    index: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style scoped>
.lesson {
  margin-bottom: 52px;
  /* Chừa khoảng trống phía trên để khi nhảy tới anchor, tiêu đề
     không bị header dính (sticky) che mất. */
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
</style>
