<template>
  <div class="report-page">
    <h2>Báo cáo tổng quan</h2>

    <div class="summary">
      <div class="summary-item">
        <strong>Tổng đơn hàng:</strong> {{ orders.length }}
      </div>
      <div class="summary-item">
        <strong>Doanh thu tổng:</strong> {{ formatCurrency(totalRevenue) }}
      </div>
    </div>

    <table class="report-table">
      <thead>
        <tr>
          <th>Mã đơn</th>
          <th>Khách hàng</th>
          <th>Tổng tiền</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="o in orders" :key="o.id">
          <td>{{ o.code }}</td>
          <td>{{ o.customer_name || "-" }}</td>
          <td>{{ formatCurrency(Number(o.total)) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

interface Order {
  id: number;
  code: string;
  customer_name: string;
  total: number | string;
}

const orders = ref<Order[]>([]);
const totalRevenue = ref(0);
const API_URL = "http://localhost:4000/orders";

// Format tiền VNĐ
const formatCurrency = (num: number) =>
  num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

// Lấy danh sách đơn hàng và tính tổng doanh thu
const fetchOrders = async () => {
  try {
    const res = await axios.get<Order[]>(API_URL);
    orders.value = res.data.map(o => ({
      ...o,
      total: Number(o.total) // convert string sang number
    }));
    totalRevenue.value = orders.value.reduce((sum, o) => sum + Number(o.total), 0);
  } catch (err) {
    console.error("❌ Lỗi khi tải báo cáo:", err);
  }
};

onMounted(fetchOrders);
</script>

<style scoped>
.report-page {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  font-family: 'Segoe UI', sans-serif;
}

.summary {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.summary-item {
  font-size: 1.2rem;
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
</style>
