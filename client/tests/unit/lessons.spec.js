import lessons from "@/content/lessons";
import quiz from "@/content/quiz";

// Nội dung là dữ liệu, mà dữ liệu gõ tay thì sai lúc nào không biết.
// Bộ test này canh những lỗi im lặng: trùng id, thiếu trường, gõ sai type.
describe("content/lessons.js", () => {
  const KNOWN_TYPES = ["p", "list", "steps", "code", "table", "note"];

  it("mỗi bài đều có đủ id, part, title và blocks", () => {
    lessons.forEach((lesson) => {
      expect(typeof lesson.id).toBe("string");
      expect(lesson.id).not.toBe("");
      expect(typeof lesson.part).toBe("string");
      expect(typeof lesson.title).toBe("string");
      expect(Array.isArray(lesson.blocks)).toBe(true);
      expect(lesson.blocks.length).toBeGreaterThan(0);
    });
  });

  it("id không được trùng nhau (vì dùng làm anchor #id)", () => {
    const ids = lessons.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("không có block nào gõ sai type", () => {
    lessons.forEach((lesson) => {
      lesson.blocks.forEach((block) => {
        expect(KNOWN_TYPES).toContain(block.type);
      });
    });
  });

  it("mọi hàng trong bảng đều đúng số cột với phần đầu bảng", () => {
    lessons.forEach((lesson) => {
      lesson.blocks
        .filter((b) => b.type === "table")
        .forEach((table) => {
          table.rows.forEach((row) => {
            expect(row.length).toBe(table.head.length);
          });
        });
    });
  });

  it("giữ nguyên được cú pháp ${{ }} của GitHub Actions trong code mẫu", () => {
    // Nếu ai đó đổi code mẫu sang template literal mà quên escape,
    // đoạn ${{ ... }} sẽ bị JavaScript nuốt mất. Test này canh đúng chuyện đó.
    const allCode = lessons
      .flatMap((l) => l.blocks)
      .filter((b) => b.type === "code")
      .map((b) => b.text)
      .join("\n");

    expect(allCode).toContain("${{ matrix.context }}");
    expect(allCode).toContain("${{ github.repository }}");
  });
});

describe("content/quiz.js", () => {
  it("mỗi câu có đáp án đúng trỏ vào một lựa chọn có thật", () => {
    quiz.forEach((q) => {
      expect(q.options.length).toBeGreaterThan(1);
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(q.options.length);
      expect(typeof q.explain).toBe("string");
      expect(q.explain).not.toBe("");
    });
  });

  it("id câu hỏi không trùng nhau (dùng làm name của radio)", () => {
    const ids = quiz.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
