import { shallowMount } from "@vue/test-utils";
import TheSidebar from "@/components/TheSidebar.vue";

const LESSONS = [
  { id: "a", part: "CI/CD", title: "Bài A" },
  { id: "b", part: "CI/CD", title: "Bài B" },
  { id: "c", part: "Docker", title: "Bài C" },
  // Cố tình quay lại nhóm cũ để kiểm tra việc gom nhóm không tạo nhóm trùng.
  { id: "d", part: "CI/CD", title: "Bài D" },
];

const mountSidebar = (activeId = "") =>
  shallowMount(TheSidebar, { propsData: { lessons: LESSONS, activeId } });

describe("TheSidebar.vue", () => {
  it("gom bài theo part, mỗi part chỉ một nhóm", () => {
    const wrapper = mountSidebar();

    expect(wrapper.vm.groups.map((g) => g.part)).toEqual(["CI/CD", "Docker"]);
    expect(wrapper.findAll(".nav__group")).toHaveLength(2);
  });

  it("giữ nguyên thứ tự xuất hiện của các nhóm", () => {
    const wrapper = mountSidebar();

    // "CI/CD" xuất hiện trước "Docker" trong mảng gốc nên phải đứng trước.
    expect(wrapper.vm.groups[0].items.map((i) => i.id)).toEqual(["a", "b", "d"]);
    expect(wrapper.vm.groups[1].items.map((i) => i.id)).toEqual(["c"]);
  });

  it("đánh số theo vị trí trong mảng gốc, không đánh số lại trong từng nhóm", () => {
    const wrapper = mountSidebar();

    // Bài D nằm thứ 4 trong mảng gốc nên phải mang số 4, dù là bài thứ 3 của nhóm.
    const lastItem = wrapper.vm.groups[0].items[2];
    expect(lastItem).toMatchObject({ id: "d", index: 4 });
  });

  it("link trỏ đúng anchor #id", () => {
    const wrapper = mountSidebar();

    expect(wrapper.findAll("a.nav__link").at(0).attributes("href")).toBe("#a");
    expect(wrapper.findAll("a.nav__link").at(3).attributes("href")).toBe("#c");
  });

  it("tô sáng đúng mục đang đọc", () => {
    const wrapper = mountSidebar("b");

    const active = wrapper.findAll(".nav__link--active");
    expect(active).toHaveLength(1);
    expect(active.at(0).attributes("href")).toBe("#b");
  });

  it("không có activeId thì không mục nào được tô sáng", () => {
    const wrapper = mountSidebar();

    expect(wrapper.findAll(".nav__link--active")).toHaveLength(0);
  });
});
