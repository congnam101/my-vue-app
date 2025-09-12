<template>
  <div class="report-page">
    <h2>Báo cáo tổng quan</h2>

    <!-- Tóm tắt -->
    <div class="summary">
      <div class="summary-item">
        <strong>Tổng đơn hàng:</strong> {{ orders.length }}
      </div>
      <div class="summary-item">
        <strong>Tổng doanh thu:</strong> {{ formatCurrency(totalRevenue) }}
      </div>
      <div class="summary-item">
        <strong>Doanh thu TB/đơn:</strong> {{ formatCurrency(avgRevenue) }}
      </div>
      <div class="summary-item">
        <strong>Khách hàng khác nhau:</strong> {{ uniqueCustomers }}
      </div>
    </div>

    <!-- Bảng chi tiết -->
    <table class="report-table">
      <thead>
        <tr>
          <th>Mã đơn</th>
          <th>Khách hàng</th>
          <th>Ngày</th>
          <th>Sản phẩm</th>
          <th>Tổng tiền</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="o in sortedOrders" :key="o.id">
          <td>{{ o.code }}</td>
          <td>{{ o.customer_name || "-" }}</td>
          <td>{{ new Date(o.date).toLocaleDateString("vi-VN") }}</td>
          <td>
            <ul class="product-list">
              <li v-for="(it, idx) in o.items" :key="idx">
                {{ it.product_name }} × {{ it.quantity }}
              </li>
            </ul>
          </td>
          <td>{{ formatCurrency(Number(o.total)) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import axios from "axios";

interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
}
interface Order {
  id: number;
  code: string;
  customer_name: string;
  date: string;
  total: number;
  items: OrderItem[];
}

const orders = ref<Order[]>([]);
const totalRevenue = ref(0);
const API_URL = "http://localhost:4000/orders";

const formatCurrency = (num: number) =>
  num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const fetchOrders = async () => {
  try {
    const res = await axios.get<Order[]>(API_URL);
    orders.value = res.data.map(o => ({
      ...o,
      total: Number(o.total)
    }));
    totalRevenue.value = orders.value.reduce((s, o) => s + o.total, 0);
  } catch (err) {
    console.error("❌ Lỗi khi tải báo cáo:", err);
  }
};

// Tính toán động
const avgRevenue = computed(() =>
  orders.value.length ? totalRevenue.value / orders.value.length : 0
);
const uniqueCustomers = computed(() =>
  new Set(orders.value.map(o => o.customer_name)).size
);
const sortedOrders = computed(() =>
  [...orders.value].sort((a, b) => b.total - a.total)
);

onMounted(fetchOrders);
</script>

<style scoped>
.report-page {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  font-family: 'Segoe UI', sans-serif;
}
.summary {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 1.5rem;
}
.summary-item {
  font-size: 1.1rem;
  background: #f9f9ff;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  box-shadow: 0 0 4px rgba(0,0,0,0.05);
}
.report-table {
  width: 100%;
  border-collapse: collapse;
}
.report-table th,
.report-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}
.report-table th {
  background-color: #f0f0f0;
}
.report-table tbody tr:nth-child(even) {
  background-color: #fafafa;
}
.report-table tbody tr:hover {
  background-color: #f5f5ff;
}
.product-list {
  list-style: none;
  padding-left: 0;
  margin: 0;
  text-align: left;
}
</style>
