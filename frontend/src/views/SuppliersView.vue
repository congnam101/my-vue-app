<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
  <div class="suppliers-page">
    <h2>Quản lý Nhà cung cấp</h2>

    <!-- Form thêm NCC -->
    <form @submit.prevent="handleSubmit" class="supplier-form">
      <input v-model="newSupplier.code" placeholder="Mã NCC" required />
      <input v-model="newSupplier.name" placeholder="Tên NCC" required />
      <input v-model="newSupplier.address" placeholder="Địa chỉ" />
      <input v-model="newSupplier.phone" placeholder="Số điện thoại" />
      <button type="submit">{{ editingId ? "Cập nhật" : "Thêm" }}</button>
    </form>

    <!-- Danh sách NCC -->
    <table class="suppliers-table">
      <thead>
        <tr>
          <th>Mã</th>
          <th>Tên</th>
          <th>Địa chỉ</th>
          <th>Điện thoại</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="supplier in suppliers" :key="supplier.id">
          <td>{{ supplier.code }}</td>
          <td>{{ supplier.name }}</td>
          <td>{{ supplier.address }}</td>
          <td>{{ supplier.phone }}</td>
          <td>
            <button @click="editSupplier(supplier)">Sửa</button>
            <button @click="deleteSupplier(supplier.id)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

interface Supplier {
  id: number;
  code: string;
  name: string;
  address?: string;
  phone?: string;
}

const API_URL = "http://localhost:4000/suppliers";

const suppliers = ref<Supplier[]>([]);
const newSupplier = ref({ code: "", name: "", address: "", phone: "" });
const error = ref<string | null>(null);
const editingId = ref<number | null>(null);

// Lấy danh sách NCC
const fetchSuppliers = async () => {
  try {
    const res = await axios.get(API_URL);
    suppliers.value = res.data;
  } catch  {
    error.value = "Không thể tải NCC";
  }
};

// Thêm / Cập nhật NCC
const handleSubmit = async () => {
  try {
    if (editingId.value) {
      await axios.put(`${API_URL}/${editingId.value}`, newSupplier.value);
    } else {
      await axios.post(API_URL, newSupplier.value);
    }
    newSupplier.value = { code: "", name: "", address: "", phone: "" };
    editingId.value = null;
    fetchSuppliers();
  } catch (err: unknown) {
    console.error("❌ Lỗi khi lưu:", err);
    error.value = "Không thể lưu NCC";
  }
};

// Sửa NCC
const editSupplier = (supplier: Supplier) => {
  newSupplier.value = {
    code: supplier.code ?? "",
    name: supplier.name ?? "",
    address: supplier.address ?? "",
    phone: supplier.phone ?? ""
  };
  editingId.value = supplier.id;
};

// Xóa NCC
const deleteSupplier = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    fetchSuppliers();
  } catch {
    error.value = "Không thể xóa NCC";
  }
};

onMounted(() => fetchSuppliers());
</script>

<style scoped>
.suppliers-page {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  font-family: 'Segoe UI', sans-serif;
}

.supplier-form {
  display: flex;
  gap: 8px;
  margin-bottom: 1.5rem;
}

.supplier-form input {
  flex: 1;
  padding: 8px;
}

.supplier-form button {
  background: #4cafef;
  border: none;
  padding: 8px 16px;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}

.supplier-form button:hover {
  background: #3296db;
}

.suppliers-table {
  width: 100%;
  border-collapse: collapse;
}

.suppliers-table th,
.suppliers-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.suppliers-table th {
  background: #f0f0f0;
}

button {
  background: #f44336;
  border: none;
  padding: 6px 12px;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #d32f2f;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>
