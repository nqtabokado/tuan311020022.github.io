<template>
  <nav class="nav" aria-label="Mục lục">
    <!-- Nhóm các bài theo "part" (CI/CD, Docker, Repo này) -->
    <div v-for="group in groups" :key="group.part" class="nav__group">
      <p class="nav__part">{{ group.part }}</p>

      <a
        v-for="item in group.items"
        :key="item.id"
        :href="'#' + item.id"
        class="nav__link"
        :class="{ 'nav__link--active': item.id === activeId }"
      >
        <span class="nav__num">{{ item.index }}</span>
        {{ item.title }}
      </a>
    </div>
  </nav>
</template>

<script>
export default {
  name: "TheSidebar",

  props: {
    lessons: {
      type: Array,
      required: true,
    },
    // id của bài đang hiển thị trên màn hình, do App tính rồi truyền xuống.
    activeId: {
      type: String,
      default: "",
    },
  },

  computed: {
    // Biến mảng bài học phẳng thành danh sách đã gom nhóm theo part,
    // giữ nguyên thứ tự xuất hiện lần đầu của từng nhóm.
    groups() {
      const result = [];

      this.lessons.forEach((lesson, i) => {
        let group = result.find((g) => g.part === lesson.part);

        if (!group) {
          group = { part: lesson.part, items: [] };
          result.push(group);
        }

        group.items.push({
          id: lesson.id,
          title: lesson.title,
          index: i + 1,
        });
      });

      return result;
    },
  },
};
</script>

<style scoped>
.nav {
  font-size: 13px;
}

.nav__group {
  margin-bottom: 20px;
}

.nav__part {
  margin: 0 0 6px;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: #97a1ad;
}

.nav__link {
  display: flex;
  gap: 8px;
  padding: 5px 9px;
  margin-left: -9px;
  border-radius: 6px;
  color: #4a5563;
  text-decoration: none;
  line-height: 1.45;
}

.nav__link:hover {
  background: #eef1f5;
  color: var(--ink);
}

.nav__link--active {
  background: #eef4ff;
  color: var(--accent);
  font-weight: 600;
}

.nav__num {
  flex: none;
  color: #a8b1bd;
  font-variant-numeric: tabular-nums;
}

.nav__link--active .nav__num {
  color: var(--accent);
}

/* Màn hình hẹp: mục lục nằm ngang phía trên, cuộn ngang được,
   thay vì chiếm hết chiều cao màn hình. */
@media (max-width: 900px) {
  .nav {
    display: flex;
    gap: 14px;
    overflow-x: auto;
    padding-bottom: 8px;
  }

  .nav__group {
    margin-bottom: 0;
  }

  .nav__link {
    white-space: nowrap;
  }
}
</style>
