<template>
  <div class="customers-page">
    <h2>Quản lý khách hàng</h2>

    <!-- Form thêm/sửa khách hàng -->
    <form @submit.prevent="isEditing ? updateCustomer() : addCustomer()" class="customer-form">
      <input v-model="formCustomer.code" placeholder="Mã KH" required />
      <input v-model="formCustomer.name" placeholder="Tên KH" required />
      <input v-model="formCustomer.address" placeholder="Địa chỉ" />
      <input v-model="formCustomer.tax_code" placeholder="Mã số thuế" />

      <button type="submit">
        {{ isEditing ? "Cập nhật" : "Thêm khách hàng" }}
      </button>
      <button v-if="isEditing" type="button" @click="cancelEdit">Hủy</button>
    </form>

    <!-- Danh sách khách hàng -->
    <table class="customers-table">
      <thead>
        <tr>
          <th>Mã</th>
          <th>Tên</th>
          <th>Địa chỉ</th>
          <th>MST</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="customer in customers" :key="customer.id">
          <td>{{ customer.code }}</td>
          <td>{{ customer.name }}</td>
          <td>{{ customer.address }}</td>
          <td>{{ customer.tax_code }}</td>
          <td>
            <button @click="editCustomer(customer)">Sửa</button>
            <button @click="deleteCustomer(customer.id)">Xóa</button>
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

interface Customer {
  id: number
  code: string
  name: string
  address?: string
  tax_code?: string
}

const customers = ref<Customer[]>([])
const formCustomer = ref({ id: 0, code: "", name: "", address: "", tax_code: "" })
const isEditing = ref(false)
const error = ref<string | null>(null)

const API_URL = "http://localhost:4000/customers"

// 📌 Lấy danh sách
const fetchCustomers = async () => {
  try {
    const res = await axios.get(API_URL)
    customers.value = res.data
  } catch {
    error.value = "Không thể tải khách hàng"
  }
}

// 📌 Thêm khách hàng
const addCustomer = async () => {
  try {
    await axios.post(API_URL, formCustomer.value)
    resetForm()
    fetchCustomers()
  } catch {
    error.value = "Không thể thêm khách hàng"
  }
}

// 📌 Xóa khách hàng
const deleteCustomer = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/${id}`)
    fetchCustomers()
  } catch {
    error.value = "Không thể xóa khách hàng"
  }
}

// 📌 Chọn khách hàng để sửa
const editCustomer = (customer: Customer) => {
  formCustomer.value = {
    id: customer.id,
    code: customer.code,
    name: customer.name,
    address: customer.address ?? "",
    tax_code: customer.tax_code ?? ""
  }
  isEditing.value = true
}

// 📌 Cập nhật khách hàng
const updateCustomer = async () => {
  try {
    await axios.put(`${API_URL}/${formCustomer.value.id}`, formCustomer.value)
    resetForm()
    fetchCustomers()
  } catch {
    error.value = "Không thể cập nhật khách hàng"
  }
}

// 📌 Reset form về trạng thái thêm
const resetForm = () => {
  formCustomer.value = { id: 0, code: "", name: "", address: "", tax_code: "" }
  isEditing.value = false
}

// 📌 Hủy chế độ sửa
const cancelEdit = () => {
  resetForm()
}

onMounted(() => {
  fetchCustomers()
})
</script>

<style scoped>
.customers-page {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.customer-form {
  display: flex;
  gap: 8px;
  margin-bottom: 1.5rem;
}

.customer-form input {
  flex: 1;
  padding: 8px;
}

.customer-form button {
  background: #4cafef;
  border: none;
  padding: 8px 16px;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}

.customer-form button:hover {
  background: #3296db;
}

.customers-table {
  width: 100%;
  border-collapse: collapse;
}

.customers-table th,
.customers-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.customers-table th {
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
  background: #ff9800; /* nút sửa */
  color: white;
}

button:nth-child(1):hover {
  background: #e68900;
}

button:nth-child(2) {
  background: #f44336; /* nút xóa */
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
