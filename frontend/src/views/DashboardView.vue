<template>
  <div class="dashboard">
    <h2>Chào mừng bạn đến với hệ thống quản lý Công ty ENA</h2>
    <p class="intro">
      Quản lý sản phẩm, nhà cung cấp, đơn hàng và báo cáo hiệu quả, nhanh chóng.
    </p>

    <div class="cards-grid">
      <!-- Tổng sản phẩm -->
      <div class="card card-blue">
        <div class="card-icon">📦</div>
        <div class="card-content">
          <h3>Tổng sản phẩm</h3>
          <p class="value">{{ stats.products }}</p>
        </div>
      </div>

      <!-- Đơn hàng hôm nay -->
      <div class="card card-purple">
        <div class="card-icon">🛒</div>
        <div class="card-content">
          <h3>Đơn hàng hôm nay</h3>
          <p class="value">{{ stats.todayOrders }}</p>
        </div>
      </div>

      <!-- Tổng doanh thu -->
      <div class="card card-pink">
        <div class="card-icon">💰</div>
        <div class="card-content">
          <h3>Doanh thu</h3>
          <p class="value">{{ formatCurrency(stats.totalRevenue) }}</p>
        </div>
      </div>

      <!-- Nhà cung cấp -->
      <div class="card card-green">
        <div class="card-icon">🏭</div>
        <div class="card-content">
          <h3>Nhà cung cấp</h3>
          <p class="value">{{ stats.suppliers }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

const API_PRODUCTS  = "http://localhost:4000/products";
const API_ORDERS    = "http://localhost:4000/orders";
const API_SUPPLIERS = "http://localhost:4000/suppliers";

interface Order {
  id: number;
  date: string;    // có thể là YYYY-MM-DD hoặc MM/DD/YYYY
  total: number;
}

const stats = ref({
  products: 0,
  todayOrders: 0,
  totalRevenue: 0,
  suppliers: 0
});

// format tiền VND
const formatCurrency = (num: number) =>
  num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

function isToday(dateInput: string | Date) {
  const d = new Date(dateInput);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

async function fetchDashboard() {
  try {
    const [prodRes, orderRes, supplierRes] = await Promise.all([
      axios.get(API_PRODUCTS),
      axios.get(API_ORDERS),
      axios.get(API_SUPPLIERS)
    ]);

    const orders: Order[] = orderRes.data;

    stats.value.products      = prodRes.data.length;
    stats.value.todayOrders   = orders.filter(o => isToday(o.date)).length;
    stats.value.totalRevenue  = orders.reduce((s, o) => s + Number(o.total), 0);
    stats.value.suppliers     = supplierRes.data.length;

  } catch (err) {
    console.error("❌ Lỗi khi tải dashboard:", err);
  }
}

onMounted(fetchDashboard);
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.dashboard h2 {
  font-size: 24px;
  font-weight: 600;
}
.intro {
  color: #555;
  margin-bottom: 1.5rem;
}
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
}
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  background: white;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 14px rgba(0,0,0,0.15);
}
.card-icon {
  font-size: 40px;
  margin-bottom: 10px;
}
.card-content h3 {
  font-size: 16px;
  margin: 0 0 6px;
  font-weight: 600;
}
.card-content .value {
  font-size: 24px;
  font-weight: bold;
}
.card-blue   { border-top: 4px solid #4a90e2; }
.card-purple { border-top: 4px solid #7b61ff; }
.card-pink   { border-top: 4px solid #ff6f91; }
.card-green  { border-top: 4px solid #27ae60; }
</style>
