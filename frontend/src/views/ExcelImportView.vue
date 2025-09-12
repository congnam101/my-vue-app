<template>
  <div class="excel-import">
    <h2>📥 Import Excel</h2>

    <div class="import-box">
      <label>
        <span>Chọn file Excel:</span>
        <input type="file" accept=".xlsx, .xls" @change="handleFileUpload" />
      </label>

      <label>
        <span>Chọn loại dữ liệu:</span>
        <select v-model="importType">
          <option value="products">📦 Sản phẩm</option>
          <option value="customers">👥 Khách hàng</option>
        </select>
      </label>

      <button @click="uploadData" :disabled="!rows.length">
        🚀 Import vào hệ thống
      </button>
    </div>

    <div v-if="rows.length" class="preview">
      <h3>Xem trước dữ liệu ({{ rows.length }} dòng)</h3>
      <table>
        <thead>
          <tr>
            <th v-for="(v, key) in rows[0]" :key="key">{{ key }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in rows.slice(0, 5)" :key="i">
            <td v-for="(v, key) in row" :key="key">{{ v }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as XLSX from "xlsx";
import { ref } from "vue";
import axios from "axios";

const rows = ref<any[]>([]);
const importType = ref<"products" | "customers">("products");

const handleFileUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    const data = new Uint8Array(evt.target?.result as ArrayBuffer);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    rows.value = XLSX.utils.sheet_to_json(worksheet);
  };
  reader.readAsArrayBuffer(file);
};

const uploadData = async () => {
  if (!rows.value.length) return;

  try {
    const url =
      importType.value === "products"
        ? "http://localhost:4000/excel-products/import"
        : "http://localhost:4000/excel-customers/import";

    const res = await axios.post(url, rows.value);
    alert(res.data.message);
    rows.value = [];
  } catch (err) {
    console.error("❌ Import lỗi:", err);
    alert("Import thất bại!");
  }
};
</script>

<style scoped>
.excel-import {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.import-box {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 20px;
}

button {
  padding: 8px 16px;
  background: #4a90e2;
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}
button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.preview table {
  width: 100%;
  border-collapse: collapse;
}
.preview th,
.preview td {
  border: 1px solid #ddd;
  padding: 6px;
  text-align: left;
}
.preview th {
  background: #f0f0f0;
}
</style>
