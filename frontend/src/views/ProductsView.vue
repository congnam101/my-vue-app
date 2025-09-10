<template>
  <div class="products-page">
    <h2>Quản lý Mặt hàng</h2>

    <!-- Form thêm/sửa sản phẩm -->
    <form @submit.prevent="handleSubmit" class="product-form">
      <input v-model="form.code" placeholder="Mã SP" required />
      <input v-model="form.name" placeholder="Tên SP" required />

      <select v-model.number="form.categoryId" required>
        <option value="">Chọn danh mục</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>

      <input v-model="form.unit" placeholder="Đơn vị" />
      <input v-model.number="form.price" type="number" placeholder="Giá" />

      <select v-model.number="form.supplierId">
        <option value="">Chọn nhà cung cấp</option>
        <option v-for="sup in suppliers" :key="sup.id" :value="sup.id">{{ sup.name }}</option>
      </select>

      <button type="submit">{{ form.id ? 'Cập nhật' : 'Thêm' }}</button>
      <button type="button" v-if="form.id" @click="resetForm">Hủy</button>
    </form>

    <!-- Bảng danh sách sản phẩm -->
    <table class="products-table">
      <thead>
        <tr>
          <th>Mã</th>
          <th>Tên</th>
          <th>Danh mục</th>
          <th>Đơn vị</th>
          <th>Giá</th>
          <th>Nhà cung cấp</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="prod in products" :key="prod.id">
          <td>{{ prod.code }}</td>
          <td>{{ prod.name }}</td>
          <td>{{ prod.category_name || '-' }}</td>
          <td>{{ prod.unit || '-' }}</td>
          <td>{{ formatCurrency(prod.price ?? 0) }}</td>
          <td>{{ prod.supplier_name || '-' }}</td>
          <td>
            <button @click="editProduct(prod)">Sửa</button>
            <button @click="deleteProduct(prod.id)">Xóa</button>
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

interface Category { id: number; name: string; }
interface Supplier { id: number; name: string; }
interface Product {
  id: number;
  code: string;
  name: string;
  categoryId?: number;
  category_name?: string;
  unit?: string;
  price?: number;
  supplierId?: number;
  supplier_name?: string;
}

const API_PRODUCTS = "http://localhost:4000/products";
const API_CATEGORIES = "http://localhost:4000/categories";
const API_SUPPLIERS = "http://localhost:4000/suppliers";

const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const suppliers = ref<Supplier[]>([]);
const error = ref<string | null>(null);

const form = ref<Product>({
  id: 0,
  code: "",
  name: "",
  categoryId: undefined,
  unit: "",
  price: 0,
  supplierId: undefined
});

const fetchProducts = async () => {
  try {
    const res = await axios.get(API_PRODUCTS);
    products.value = res.data.map((p: Product) => ({ ...p, price: Number(p.price) }));
  } catch {
    error.value = "Không thể tải sản phẩm";
  }
};

const fetchCategories = async () => {
  try {
    const res = await axios.get(API_CATEGORIES);
    categories.value = res.data;
  } catch {
    error.value = "Không thể tải danh mục";
  }
};

const fetchSuppliers = async () => {
  try {
    const res = await axios.get(API_SUPPLIERS);
    suppliers.value = res.data;
  } catch {
    error.value = "Không thể tải nhà cung cấp";
  }
};

const handleSubmit = async () => {
  try {
    if (form.value.id) {
      await axios.put(`${API_PRODUCTS}/${form.value.id}`, {
        code: form.value.code,
        name: form.value.name,
        categoryId: form.value.categoryId,
        unit: form.value.unit,
        price: form.value.price,
        supplierId: form.value.supplierId
      });
    } else {
      await axios.post(API_PRODUCTS, {
        code: form.value.code,
        name: form.value.name,
        categoryId: form.value.categoryId,
        unit: form.value.unit,
        price: form.value.price,
        supplierId: form.value.supplierId
      });
    }
    resetForm();
    fetchProducts();
  } catch {
    error.value = "❌ Lỗi khi lưu sản phẩm";
  }
};

const editProduct = (prod: Product) => {
  form.value = { ...prod };
};

const resetForm = () => {
  form.value = { id: 0, code: "", name: "", categoryId: undefined, unit: "", price: 0, supplierId: undefined };
};

const deleteProduct = async (id: number) => {
  try {
    await axios.delete(`${API_PRODUCTS}/${id}`);
    fetchProducts();
  } catch {
    error.value = "❌ Lỗi khi xóa sản phẩm";
  }
};

const formatCurrency = (num: number) =>
  num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

onMounted(() => {
  fetchCategories();
  fetchSuppliers();
  fetchProducts();
});
</script>

<style scoped>
.products-page {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  font-family: 'Segoe UI', sans-serif;
}

.product-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 1.5rem;
}

.product-form input,
.product-form select {
  padding: 8px;
  flex: 1;
}

.product-form button {
  background: #4cafef;
  border: none;
  padding: 8px 16px;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}

.product-form button:hover {
  background: #3296db;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
}

.products-table th,
.products-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.products-table th {
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
