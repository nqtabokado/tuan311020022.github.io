import { shallowMount } from "@vue/test-utils";
import App from "@/App.vue";
import lessons from "@/content/lessons";

describe("App.vue", () => {
  it("render tiêu đề trang", () => {
    const wrapper = shallowMount(App);

    expect(wrapper.find("h1").text()).toBe("Học CI/CD & Docker");
  });

  it("render đủ mỗi bài lý thuyết một section", () => {
    const wrapper = shallowMount(App);

    // shallowMount không render sâu, chỉ để lại thẻ stub của component con.
    expect(wrapper.findAllComponents({ name: "LessonSection" })).toHaveLength(
      lessons.length
    );
  });

  it("mục lục gồm các bài lý thuyết cộng thêm 2 mục demo và quiz", () => {
    const wrapper = shallowMount(App);

    expect(wrapper.vm.navItems).toHaveLength(lessons.length + 2);
    expect(wrapper.vm.navItems.map((i) => i.id)).toContain("demo-api");
    expect(wrapper.vm.navItems.map((i) => i.id)).toContain("quiz");
  });

  it("đánh số liên tục: demo và quiz nối tiếp sau bài cuối", () => {
    const wrapper = shallowMount(App);

    expect(wrapper.findComponent({ name: "ApiDemo" }).props("index")).toBe(
      lessons.length + 1
    );
    expect(wrapper.findComponent({ name: "QuizBox" }).props("index")).toBe(
      lessons.length + 2
    );
  });

  it("gỡ listener scroll khi component bị huỷ", () => {
    const remove = jest.spyOn(window, "removeEventListener");
    const wrapper = shallowMount(App);

    wrapper.destroy();

    expect(remove).toHaveBeenCalledWith("scroll", expect.any(Function));
    remove.mockRestore();
  });
});
