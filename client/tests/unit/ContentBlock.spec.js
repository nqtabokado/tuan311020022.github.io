import { shallowMount } from "@vue/test-utils";
import ContentBlock from "@/components/ContentBlock.vue";

const mountBlock = (block) => shallowMount(ContentBlock, { propsData: { block } });

describe("ContentBlock.vue", () => {
  it("render đoạn văn", () => {
    const wrapper = mountBlock({ type: "p", text: "Xin chào" });

    expect(wrapper.find("p.para").text()).toBe("Xin chào");
  });

  it("render danh sách gạch đầu dòng", () => {
    const wrapper = mountBlock({ type: "list", items: ["một", "hai", "ba"] });

    expect(wrapper.findAll("ul.bullets li")).toHaveLength(3);
    expect(wrapper.text()).toContain("hai");
  });

  it("render khối code kèm nhãn ngôn ngữ", () => {
    const wrapper = mountBlock({
      type: "code",
      lang: "yaml",
      text: "on:\n  push:",
    });

    expect(wrapper.find("figcaption").text()).toBe("yaml");
    // Giữ nguyên xuống dòng trong <pre> là điều kiện để code mẫu đọc được.
    expect(wrapper.find("pre code").text()).toContain("\n  push:");
  });

  it("render bảng đúng số ô", () => {
    const wrapper = mountBlock({
      type: "table",
      head: ["Cột A", "Cột B"],
      rows: [
        ["a1", "b1"],
        ["a2", "b2"],
      ],
    });

    expect(wrapper.findAll("thead th")).toHaveLength(2);
    expect(wrapper.findAll("tbody tr")).toHaveLength(2);
    expect(wrapper.findAll("tbody td")).toHaveLength(4);
  });

  it("ghi chú kiểu warn có nhãn và class riêng", () => {
    const wrapper = mountBlock({ type: "note", tone: "warn", text: "Cẩn thận" });

    expect(wrapper.classes()).toContain("note--warn");
    expect(wrapper.text()).toContain("Lưu ý");
    expect(wrapper.text()).toContain("Cẩn thận");
  });

  it("ghi chú không ghi tone thì mặc định là info", () => {
    const wrapper = mountBlock({ type: "note", text: "Thông tin thêm" });

    expect(wrapper.classes()).toContain("note--info");
    expect(wrapper.text()).toContain("Ghi chú");
  });

  it("gặp type lạ thì báo ra màn hình chứ không im lặng bỏ qua", () => {
    const wrapper = mountBlock({ type: "khong-ton-tai" });

    expect(wrapper.text()).toContain("Không hiểu block type");
  });
});
