import { shallowMount } from "@vue/test-utils";
import ApiDemo from "@/components/ApiDemo.vue";
import api from "@/api/client";

// Thay module gọi API thật bằng bản giả: unit test không được phụ thuộc
// vào việc server Flask có đang chạy hay không.
jest.mock("@/api/client");

// Đợi mọi promise đang chờ chạy xong rồi Vue cập nhật lại DOM.
const flush = () => new Promise((resolve) => setTimeout(resolve));

const mountDemo = () => shallowMount(ApiDemo, { propsData: { index: 12 } });

describe("ApiDemo.vue", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("hiển thị status lấy từ API khi gọi thành công", async () => {
    api.getHealth.mockResolvedValue({ status: "ok" });
    api.getGreeting.mockResolvedValue({ message: "Xin chào!" });

    const wrapper = mountDemo();
    await flush();

    expect(api.getHealth).toHaveBeenCalledTimes(1);
    expect(wrapper.text()).toContain("ok");
    expect(wrapper.text()).toContain("Xin chào!");
  });

  it("hiển thị lỗi khi API chết", async () => {
    api.getHealth.mockRejectedValue(new Error("Network Error"));
    api.getGreeting.mockRejectedValue(new Error("Network Error"));

    const wrapper = mountDemo();
    await flush();

    expect(wrapper.text()).toContain("Không gọi được API");
    expect(wrapper.text()).toContain("Network Error");
  });

  it("bấm Gọi lại thì gọi API thêm một lần nữa", async () => {
    api.getHealth.mockResolvedValue({ status: "ok" });
    api.getGreeting.mockResolvedValue({ message: "Xin chào!" });

    const wrapper = mountDemo();
    await flush();

    await wrapper.find(".panel button").trigger("click");
    await flush();

    expect(api.getHealth).toHaveBeenCalledTimes(2);
  });

  it("gửi đúng 2 số lên API và hiện kết quả trả về", async () => {
    api.getHealth.mockResolvedValue({ status: "ok" });
    api.getGreeting.mockResolvedValue({ message: "Xin chào!" });
    api.sum.mockResolvedValue({ a: 2, b: 3, result: 5 });

    const wrapper = mountDemo();
    await flush();

    await wrapper.find("form").trigger("submit");
    await flush();

    expect(api.sum).toHaveBeenCalledWith(2, 3);
    expect(wrapper.text()).toContain("Kết quả:");
    expect(wrapper.text()).toContain("5");
  });

  it("chặn số không nguyên, không gọi API", async () => {
    api.getHealth.mockResolvedValue({ status: "ok" });
    api.getGreeting.mockResolvedValue({ message: "Xin chào!" });

    const wrapper = mountDemo();
    await flush();

    await wrapper.setData({ a: 1.5 });
    await wrapper.find("form").trigger("submit");
    await flush();

    expect(api.sum).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain("Chỉ nhập số nguyên.");
  });
});
