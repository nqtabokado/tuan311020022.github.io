<template>
  <div id="app">
    <header class="top">
      <div class="top__inner">
        <h1 class="top__title">Học CI/CD &amp; Docker</h1>
        <p class="top__sub">
          Lý thuyết đi kèm pipeline thật của repo này — Vue 2 ở client, Flask ở server.
        </p>
      </div>
    </header>

    <div class="layout">
      <aside class="layout__side">
        <TheSidebar :lessons="navItems" :active-id="activeId" />
      </aside>

      <main class="layout__main">
        <LessonSection
          v-for="(lesson, i) in lessons"
          :key="lesson.id"
          :lesson="lesson"
          :index="i + 1"
        />

        <ApiDemo :index="lessons.length + 1" />

        <QuizBox :index="lessons.length + 2" />

        <footer class="foot">
          Nội dung dạng văn bản đầy đủ nằm ở <code>README_CI_CD.md</code> trong repo.
        </footer>
      </main>
    </div>
  </div>
</template>

<script>
import lessons from "./content/lessons";
import TheSidebar from "./components/TheSidebar.vue";
import LessonSection from "./components/LessonSection.vue";
import ApiDemo from "./components/ApiDemo.vue";
import QuizBox from "./components/QuizBox.vue";

// Hai mục cuối không phải bài lý thuyết nhưng vẫn cần có mặt ở mục lục.
const EXTRA_NAV = [
  { id: "demo-api", part: "Thử nghiệm", title: "Gọi API Flask thật" },
  { id: "quiz", part: "Tự kiểm tra", title: "Làm thử vài câu" },
];

export default {
  name: "App",

  components: { TheSidebar, LessonSection, ApiDemo, QuizBox },

  data() {
    return {
      lessons,
      activeId: lessons.length ? lessons[0].id : "",
    };
  },

  computed: {
    navItems() {
      return [...this.lessons, ...EXTRA_NAV];
    },
  },

  mounted() {
    window.addEventListener("scroll", this.onScroll, { passive: true });
    this.onScroll();
  },

  // Gỡ listener khi component bị huỷ, nếu không sẽ rò rỉ bộ nhớ
  // và hàm vẫn chạy dù trang đã chuyển đi.
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll);
  },

  methods: {
    // Tô sáng mục đang đọc ở sidebar: tìm section cuối cùng mà mép trên
    // của nó đã trôi lên quá vạch 120px tính từ đỉnh màn hình.
    onScroll() {
      if (this.ticking) return;
      this.ticking = true;

      window.requestAnimationFrame(() => {
        this.ticking = false;

        let current = this.navItems.length ? this.navItems[0].id : "";

        this.navItems.forEach((item) => {
          const el = document.getElementById(item.id);
          if (el && el.getBoundingClientRect().top <= 120) {
            current = item.id;
          }
        });

        this.activeId = current;
      });
    },
  },
};
</script>

<style>
/* ---------------------------------------------------------------------------
   Style KHÔNG scoped: đặt biến màu dùng chung cho toàn bộ component con.
   Các file .vue khác tham chiếu qua var(--accent), var(--line)...
--------------------------------------------------------------------------- */
:root {
  --accent: #2563eb;
  --ink: #1f2733;
  --line: #e3e7ed;
  --bg: #f7f8fa;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  color: var(--ink);
  font-size: 14.5px;
}

/* ----- thanh tiêu đề ----- */
.top {
  background: #fff;
  border-bottom: 1px solid var(--line);
}

.top__inner {
  max-width: 1080px;
  margin: 0 auto;
  padding: 22px 24px;
}

.top__title {
  margin: 0;
  font-size: 22px;
  letter-spacing: -0.01em;
}

.top__sub {
  margin: 5px 0 0;
  color: #6b7480;
  font-size: 13.5px;
}

/* ----- bố cục 2 cột ----- */
.layout {
  max-width: 1080px;
  margin: 0 auto;
  padding: 32px 24px 80px;
  display: grid;
  grid-template-columns: 232px minmax(0, 1fr);
  gap: 44px;
  align-items: start;
}

.layout__side {
  position: sticky;
  top: 24px;
  max-height: calc(100vh - 48px);
  overflow-y: auto;
}

.layout__main {
  min-width: 0; /* cho phép bảng/code bên trong cuộn ngang thay vì phình cột */
}

.foot {
  border-top: 1px solid var(--line);
  padding-top: 18px;
  color: #8a939f;
  font-size: 13px;
}

.foot code {
  background: #eef1f5;
  padding: 1px 5px;
  border-radius: 4px;
}

/* ----- màn hình hẹp: xếp dọc, mục lục lên trên ----- */
@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 22px 18px 60px;
  }

  .layout__side {
    position: static;
    max-height: none;
    border-bottom: 1px solid var(--line);
    padding-bottom: 12px;
  }
}
</style>
