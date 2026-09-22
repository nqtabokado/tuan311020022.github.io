import { mount } from "@vue/test-utils";
import App from "@/App.vue";
import lessons from "@/content/lessons";
import api from "@/api/client";

// mount (không phải shallowMount) render THẬT toàn bộ cây component.
// Mục đích: bắt lỗi template của component con — thứ mà shallowMount
// bỏ qua vì đã thay chúng bằng thẻ stub.
jest.mock("@/api/client");

const flush = () => new Promise((resolve) => setTimeout(resolve));

describe("Smoke test — render cả trang", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    api.getHealth.mockResolvedValue({ status: "ok" });
    api.getGreeting.mockResolvedValue({ message: "Xin chào!" });
  });

  it("render hết mọi bài, không văng lỗi", async () => {
    const wrapper = mount(App);
    await flush();

    lessons.forEach((lesson) => {
      // Mỗi bài phải có đúng một phần tử mang id để sidebar nhảy tới được.
      expect(wrapper.findAll(`#${lesson.id}`)).toHaveLength(1);
      expect(wrapper.text()).toContain(lesson.title);
    });
  });

  it("render cả mục demo API và mục quiz", async () => {
    const wrapper = mount(App);
    await flush();

    expect(wrapper.find("#demo-api").exists()).toBe(true);
    expect(wrapper.find("#quiz").exists()).toBe(true);
  });

  it("không còn block nào hiển thị lỗi 'không hiểu type'", async () => {
    const wrapper = mount(App);
    await flush();

    expect(wrapper.text()).not.toContain("Không hiểu block type");
  });

  it("nội dung code mẫu giữ nguyên xuống dòng khi render ra HTML", async () => {
    const wrapper = mount(App);
    await flush();

    const firstCode = wrapper.findAll("pre code").at(0).text();
    expect(firstCode).toContain("\n");
  });
});
