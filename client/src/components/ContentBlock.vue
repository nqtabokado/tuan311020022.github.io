<template>
  <!--
    Một "bộ định tuyến hiển thị": nhận vào 1 block bất kỳ rồi dựa vào
    block.type để chọn đúng cách render. Nhờ vậy thêm kiểu nội dung mới
    chỉ cần thêm 1 nhánh v-else-if ở đây, không phải sửa chỗ nào khác.
  -->
  <p v-if="block.type === 'p'" class="para">{{ block.text }}</p>

  <ul v-else-if="block.type === 'list'" class="bullets">
    <li v-for="(item, i) in block.items" :key="i">{{ item }}</li>
  </ul>

  <ol v-else-if="block.type === 'steps'" class="steps">
    <li v-for="(item, i) in block.items" :key="i">{{ item }}</li>
  </ol>

  <figure v-else-if="block.type === 'code'" class="code">
    <figcaption v-if="block.lang">{{ block.lang }}</figcaption>
    <pre><code>{{ block.text }}</code></pre>
  </figure>

  <div v-else-if="block.type === 'table'" class="table-wrap">
    <table>
      <thead>
        <tr>
          <th v-for="(h, i) in block.head" :key="i">{{ h }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, r) in block.rows" :key="r">
          <td v-for="(cell, c) in row" :key="c">{{ cell }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <aside
    v-else-if="block.type === 'note'"
    class="note"
    :class="block.tone === 'warn' ? 'note--warn' : 'note--info'"
  >
    <span class="note__label">{{ block.tone === "warn" ? "Lưu ý" : "Ghi chú" }}</span>
    <span>{{ block.text }}</span>
  </aside>

  <!-- Gặp type lạ thì báo ra màn hình thay vì im lặng bỏ qua,
       để lỗi gõ sai type bị phát hiện ngay lúc xem trang. -->
  <p v-else class="unknown">[Không hiểu block type: {{ block.type }}]</p>
</template>

<script>
export default {
  name: "ContentBlock",

  props: {
    block: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.para {
  margin: 0 0 14px;
  line-height: 1.75;
}

.bullets,
.steps {
  margin: 0 0 14px;
  padding-left: 22px;
  line-height: 1.75;
}

.bullets li,
.steps li {
  margin-bottom: 6px;
}

/* ----- code ----- */
.code {
  margin: 0 0 18px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--line);
}

.code figcaption {
  background: #eef1f5;
  color: #55606e;
  font-size: 11px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 5px 12px;
  border-bottom: 1px solid var(--line);
}

.code pre {
  margin: 0;
  padding: 14px;
  background: #1f2733;
  color: #e6edf3;
  overflow-x: auto;
  font-size: 12.5px;
  line-height: 1.6;
}

.code code {
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  white-space: pre;
}

/* ----- bảng ----- */
.table-wrap {
  margin: 0 0 18px;
  overflow-x: auto; /* màn hình hẹp thì bảng tự cuộn ngang */
  border: 1px solid var(--line);
  border-radius: 8px;
}

table {
  border-collapse: collapse;
  width: 100%;
  font-size: 13.5px;
  min-width: 420px;
}

th,
td {
  text-align: left;
  padding: 9px 12px;
  border-bottom: 1px solid var(--line);
  vertical-align: top;
  line-height: 1.55;
}

th {
  background: #f3f5f8;
  font-weight: 600;
  white-space: nowrap;
}

tbody tr:last-child td {
  border-bottom: none;
}

/* ----- ghi chú ----- */
.note {
  margin: 0 0 18px;
  padding: 11px 14px;
  border-radius: 6px;
  border-left: 3px solid;
  font-size: 13.5px;
  line-height: 1.7;
}

.note__label {
  font-weight: 600;
  margin-right: 6px;
}

.note--info {
  background: #eef4ff;
  border-color: var(--accent);
}

.note--info .note__label {
  color: var(--accent);
}

.note--warn {
  background: #fff6e8;
  border-color: #c77700;
}

.note--warn .note__label {
  color: #a35f00;
}

.unknown {
  color: #c0392b;
  font-family: monospace;
}
</style>
