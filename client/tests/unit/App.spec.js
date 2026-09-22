import { shallowMount } from "@vue/test-utils";
import App from "@/App.vue";

describe("App.vue", () => {
  it("render tiêu đề và 2 component con", () => {
    const wrapper = shallowMount(App);

    expect(wrapper.find("h1").text()).toBe("Vue 2 + Flask");
    // shallowMount không render sâu, chỉ để lại thẻ stub của component con.
    expect(wrapper.findComponent({ name: "HealthCard" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "SumCalculator" }).exists()).toBe(true);
  });
});
