<template>
  <div class="categories-page">
    <h2>Quản lý danh mục</h2>

    <!-- Form thêm/sửa danh mục -->
    <form @submit.prevent="isEditing ? updateCategory() : addCategory()" class="category-form">
      <input v-model="formCategory.code" placeholder="Mã danh mục" required />
      <input v-model="formCategory.name" placeholder="Tên danh mục" required />

      <button type="submit">
        {{ isEditing ? "Cập nhật" : "Thêm danh mục" }}
      </button>
      <button v-if="isEditing" type="button" @click="cancelEdit">Hủy</button>
    </form>

    <!-- Danh sách danh mục -->
    <table class="categories-table">
      <thead>
        <tr>
          <th>Mã</th>
          <th>Tên</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in categories" :key="category.id">
          <td>{{ category.code }}</td>
          <td>{{ category.name }}</td>
          <td>
            <button @click="editCategory(category)">Sửa</button>
            <button @click="deleteCategory(category.id)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import axios from "axios"

interface Category {
  id: number
  code: string
  name: string
}

const categories = ref<Category[]>([])
const formCategory = ref({ id: 0, code: "", name: "" })
const isEditing = ref(false)
const error = ref<string | null>(null)

const API_URL = "http://localhost:4000/categories"

// 📌 Lấy danh sách
const fetchCategories = async () => {
  try {
    const res = await axios.get(API_URL)
    categories.value = res.data
  } catch {
    error.value = "Không thể tải danh mục"
  }
}

// 📌 Thêm
const addCategory = async () => {
  try {
    await axios.post(API_URL, formCategory.value)
    resetForm()
    fetchCategories()
  } catch {
    error.value = "Không thể thêm danh mục"
  }
}

// 📌 Xóa
const deleteCategory = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/${id}`)
    fetchCategories()
  } catch {
    error.value = "Không thể xóa danh mục"
  }
}

// 📌 Sửa
const editCategory = (category: Category) => {
  formCategory.value = { ...category }
  isEditing.value = true
}

// 📌 Cập nhật
const updateCategory = async () => {
  try {
    await axios.put(`${API_URL}/${formCategory.value.id}`, formCategory.value)
    resetForm()
    fetchCategories()
  } catch {
    error.value = "Không thể cập nhật danh mục"
  }
}

// 📌 Reset form
const resetForm = () => {
  formCategory.value = { id: 0, code: "", name: "" }
  isEditing.value = false
}

// 📌 Hủy sửa
const cancelEdit = () => resetForm()

onMounted(() => fetchCategories())
</script>

<style scoped>
.categories-page {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.category-form {
  display: flex;
  gap: 8px;
  margin-bottom: 1.5rem;
}

.category-form input {
  flex: 1;
  padding: 8px;
}

.category-form button {
  background: #4cafef;
  border: none;
  padding: 8px 16px;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}

.category-form button:hover {
  background: #3296db;
}

.categories-table {
  width: 100%;
  border-collapse: collapse;
}

.categories-table th,
.categories-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.categories-table th {
  background: #f0f0f0;
}

button {
  margin: 2px;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:nth-child(1) {
  background: #ff9800; /* sửa */
  color: white;
}
button:nth-child(1):hover {
  background: #e68900;
}
button:nth-child(2) {
  background: #f44336; /* xóa */
  color: white;
}
button:nth-child(2):hover {
  background: #d32f2f;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>
