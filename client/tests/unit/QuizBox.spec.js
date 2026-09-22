import { mount } from "@vue/test-utils";
import QuizBox from "@/components/QuizBox.vue";
import questions from "@/content/quiz";

// Dùng mount (không phải shallowMount) vì bài kiểm tra ở đây là tương tác
// thật với các thẻ <input type="radio"> bên trong.
const mountQuiz = () => mount(QuizBox, { propsData: { index: 99 } });

// Chọn đáp án cho mọi câu: correct = true thì chọn đúng hết, false thì sai hết.
const answerAll = async (wrapper, correct) => {
  for (let i = 0; i < questions.length; i += 1) {
    const q = questions[i];
    const pick = correct ? q.answer : (q.answer + 1) % q.options.length;
    // eslint-disable-next-line no-await-in-loop
    await wrapper.findAll(`input[name="${q.id}"]`).at(pick).setChecked();
  }
};

describe("QuizBox.vue", () => {
  it("chưa chọn hết thì nút nộp bài bị khoá và báo còn bao nhiêu câu", () => {
    const wrapper = mountQuiz();
    const button = wrapper.find("button");

    expect(button.attributes("disabled")).toBeTruthy();
    expect(button.text()).toContain(`Còn ${questions.length} câu`);
  });

  it("chọn hết thì mở khoá nút nộp bài", async () => {
    const wrapper = mountQuiz();
    await answerAll(wrapper, true);

    const button = wrapper.find("button");
    expect(button.attributes("disabled")).toBeFalsy();
    expect(button.text()).toBe("Nộp bài");
  });

  it("làm đúng hết thì được điểm tuyệt đối", async () => {
    const wrapper = mountQuiz();
    await answerAll(wrapper, true);
    await wrapper.find("button").trigger("click");

    expect(wrapper.text()).toContain(`${questions.length}/${questions.length}`);
    expect(wrapper.findAll(".q--wrong")).toHaveLength(0);
  });

  it("làm sai hết thì được 0 điểm và mọi câu bị đánh dấu sai", async () => {
    const wrapper = mountQuiz();
    await answerAll(wrapper, false);
    await wrapper.find("button").trigger("click");

    expect(wrapper.text()).toContain(`0/${questions.length}`);
    expect(wrapper.findAll(".q--wrong")).toHaveLength(questions.length);
  });

  it("nộp bài xong thì hiện lời giải và khoá không cho đổi đáp án", async () => {
    const wrapper = mountQuiz();
    await answerAll(wrapper, true);
    await wrapper.find("button").trigger("click");

    expect(wrapper.findAll(".q__explain")).toHaveLength(questions.length);
    expect(wrapper.text()).toContain(questions[0].explain);
    expect(wrapper.find("input[type=radio]").attributes("disabled")).toBeTruthy();
  });

  it("bấm Làm lại thì xoá hết lựa chọn cũ", async () => {
    const wrapper = mountQuiz();
    await answerAll(wrapper, true);
    await wrapper.find("button").trigger("click");

    // Sau khi nộp, nút còn lại trong vùng actions là "Làm lại".
    const resetButton = wrapper.findAll("button").at(wrapper.findAll("button").length - 1);
    expect(resetButton.text()).toBe("Làm lại");

    await resetButton.trigger("click");

    expect(wrapper.vm.picked.every((p) => p === null)).toBe(true);
    expect(wrapper.findAll(".q__explain")).toHaveLength(0);
  });
});
