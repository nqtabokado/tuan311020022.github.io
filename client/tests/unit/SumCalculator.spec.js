import { shallowMount } from "@vue/test-utils";
import SumCalculator from "@/components/SumCalculator.vue";
import api from "@/api/client";

jest.mock("@/api/client");

const flush = () => new Promise((resolve) => setTimeout(resolve));

describe("SumCalculator.vue", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("gửi đúng 2 số lên API và hiện kết quả trả về", async () => {
    api.sum.mockResolvedValue({ a: 2, b: 3, result: 5 });

    const wrapper = shallowMount(SumCalculator);
    await wrapper.find("form").trigger("submit");
    await flush();

    expect(api.sum).toHaveBeenCalledWith(2, 3);
    expect(wrapper.text()).toContain("Kết quả:");
    expect(wrapper.text()).toContain("5");
  });

  it("chặn số không nguyên, không gọi API", async () => {
    const wrapper = shallowMount(SumCalculator);
    await wrapper.setData({ a: 1.5 });

    await wrapper.find("form").trigger("submit");
    await flush();

    expect(api.sum).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain("Chỉ nhập số nguyên.");
  });

  it("hiện thông báo khi API lỗi", async () => {
    api.sum.mockRejectedValue(new Error("Network Error"));

    const wrapper = shallowMount(SumCalculator);
    await wrapper.find("form").trigger("submit");
    await flush();

    expect(wrapper.text()).toContain("Lỗi gọi API");
  });
});
