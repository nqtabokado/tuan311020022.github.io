import { shallowMount } from "@vue/test-utils";
import HealthCard from "@/components/HealthCard.vue";
import api from "@/api/client";

// Thay module gọi API thật bằng bản giả: unit test không được phụ thuộc
// vào việc server Flask có đang chạy hay không.
jest.mock("@/api/client");

// Đợi mọi promise đang chờ chạy xong rồi Vue cập nhật lại DOM.
const flush = () => new Promise((resolve) => setTimeout(resolve));

describe("HealthCard.vue", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("hiển thị status lấy từ API khi gọi thành công", async () => {
    api.getHealth.mockResolvedValue({ status: "ok" });
    api.getGreeting.mockResolvedValue({ message: "Xin chào!" });

    const wrapper = shallowMount(HealthCard);
    await flush();

    expect(api.getHealth).toHaveBeenCalledTimes(1);
    expect(wrapper.text()).toContain("ok");
    expect(wrapper.text()).toContain("Xin chào!");
  });

  it("hiển thị lỗi khi API chết", async () => {
    api.getHealth.mockRejectedValue(new Error("Network Error"));
    api.getGreeting.mockRejectedValue(new Error("Network Error"));

    const wrapper = shallowMount(HealthCard);
    await flush();

    expect(wrapper.text()).toContain("Không gọi được API");
    expect(wrapper.text()).toContain("Network Error");
  });

  it("gọi lại API khi bấm nút Kiểm tra lại", async () => {
    api.getHealth.mockResolvedValue({ status: "ok" });
    api.getGreeting.mockResolvedValue({ message: "Xin chào!" });

    const wrapper = shallowMount(HealthCard);
    await flush();

    await wrapper.find("button").trigger("click");
    await flush();

    expect(api.getHealth).toHaveBeenCalledTimes(2);
  });
});
