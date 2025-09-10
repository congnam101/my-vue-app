<template>
  <div class="orders-page">
    <h2>Quản lý Đơn hàng</h2>

    <!-- Form thêm đơn hàng -->
    <form @submit.prevent="addOrder" class="order-form">
      <input v-model="newOrder.code" placeholder="Mã đơn" required />

      <select v-model.number="newOrder.customer_id" required>
        <option value="">Chọn khách hàng</option>
        <option v-for="c in customers" :key="c.id" :value="c.id">
          {{ c.name }}
        </option>
      </select>

      <input type="date" v-model="newOrder.date" required />

      <!-- Chọn sản phẩm -->
      <div
        v-for="(item, index) in newOrder.items"
        :key="index"
        class="order-item"
      >
        <select
          v-model.number="item.product_id"
          @change="updateItemPrice(index)"
          required
        >
          <option value="">Chọn sản phẩm</option>
          <option v-for="p in products" :key="p.id" :value="p.id">
            {{ p.name }} ({{ formatCurrency(p.price) }})
          </option>
        </select>

        <input
          type="number"
          v-model.number="item.quantity"
          min="1"
          @input="updateTotal"
        />

        <!-- Hiển thị đơn giá và thành tiền -->
        <span>
          Đơn giá: {{ formatCurrency(item.price) }} —
          Thành tiền: {{ formatCurrency(item.price * item.quantity) }}
        </span>

        <button type="button" @click="removeItem(index)">Xóa</button>
      </div>

      <button type="button" @click="addItem">Thêm sản phẩm</button>

      <div class="total-display">
        <strong>Tổng tiền: {{ formatCurrency(newOrder.total) }}</strong>
      </div>

      <button type="submit">Thêm đơn</button>
    </form>

    <!-- Danh sách đơn hàng -->
    <table class="orders-table">
      <thead>
        <tr>
          <th>Mã đơn</th>
          <th>Khách hàng</th>
          <th>Ngày</th>
          <th>Tổng tiền</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.code }}</td>
          <td>{{ order.customer_name }}</td>
          <td>{{ new Date(order.date).toLocaleDateString("vi-VN") }}</td>
          <td>{{ formatCurrency(order.total) }}</td>
          <td>
            <button @click="deleteOrder(order.id)">Xóa</button>
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

// Interfaces
interface Customer { id: number; name: string; }
interface Product { id: number; name: string; price: number; }
interface OrderItem { product_id: number; quantity: number; price: number; }
interface Order {
  id: number;
  code: string;
  customer_id: number;
  customer_name: string;
  date: string;
  total: number;
  items: OrderItem[];
}

// API endpoints
const API_ORDERS = "http://localhost:4000/orders";
const API_CUSTOMERS = "http://localhost:4000/customers";
const API_PRODUCTS = "http://localhost:4000/products";

// State
const orders = ref<Order[]>([]);
const customers = ref<Customer[]>([]);
const products = ref<Product[]>([]);
const error = ref<string | null>(null);

const newOrder = ref({
  code: "",
  customer_id: 0,
  date: "",
  items: [] as OrderItem[],
  total: 0
});

// Fetch data with proper typing
const fetchOrders = async () => {
  try {
    const res = await axios.get<Order[]>(API_ORDERS);
    orders.value = res.data.map(o => ({
      ...o,
      total: Number(o.total),
      items: o.items.map(i => ({ ...i, price: Number(i.price) }))
    }));
  } catch {
    error.value = "Không thể tải đơn hàng";
  }
};

const fetchCustomers = async () => {
  try {
    const res = await axios.get<Customer[]>(API_CUSTOMERS);
    customers.value = res.data;
  } catch {
    error.value = "Không thể tải khách hàng";
  }
};

const fetchProducts = async () => {
  try {
    const res = await axios.get<Product[]>(API_PRODUCTS);
    products.value = res.data.map(p => ({ ...p, price: Number(p.price) }));
  } catch {
    error.value = "Không thể tải sản phẩm";
  }
};

// Form xử lý
const addItem = () => newOrder.value.items.push({ product_id: 0, quantity: 1, price: 0 });

const removeItem = (index: number) => {
  newOrder.value.items.splice(index, 1);
  updateTotal();
};

const updateItemPrice = (index: number) => {
  const prodId = newOrder.value.items[index].product_id;
  const prod = products.value.find(p => p.id === prodId);
  newOrder.value.items[index].price = prod?.price ?? 0;
  updateTotal();
};

const updateTotal = () => {
  newOrder.value.total = newOrder.value.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
};

const addOrder = async () => {
  if (!newOrder.value.code || !newOrder.value.customer_id || newOrder.value.items.length === 0) return;

  try {
    // Ensure all numbers are numbers
    const payload = {
      ...newOrder.value,
      items: newOrder.value.items.map(i => ({
        product_id: i.product_id,
        quantity: Number(i.quantity),
        price: Number(i.price)
      })),
      total: Number(newOrder.value.total)
    };

    await axios.post(API_ORDERS, payload);
    newOrder.value = { code: "", customer_id: 0, date: "", items: [], total: 0 };
    fetchOrders();
  } catch {
    error.value = "❌ Lỗi khi thêm đơn hàng";
  }
};

const deleteOrder = async (id: number) => {
  try {
    await axios.delete(`${API_ORDERS}/${id}`);
    fetchOrders();
  } catch {
    error.value = "❌ Không thể xóa đơn hàng";
  }
};

const formatCurrency = (num: number) =>
  num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

onMounted(() => {
  fetchCustomers();
  fetchProducts();
  fetchOrders();
});
</script>

<style scoped>
.orders-page { max-width: 900px; margin: 2rem auto; padding: 2rem; background: #fff; border-radius: 12px; }
.order-form { display: flex; flex-direction: column; gap: 10px; margin-bottom: 1.5rem; }
.order-form input, .order-form select { padding: 8px; }
.order-item { display: flex; gap: 5px; align-items: center; }
.orders-table { width: 100%; border-collapse: collapse; }
.orders-table th, .orders-table td { border: 1px solid #ddd; padding: 8px; text-align: center; }
.orders-table th { background: #f0f0f0; }
button { cursor: pointer; }
.error { color: red; margin-top: 1rem; }
.total-display { margin-top: 10px; font-weight: bold; }
</style>
