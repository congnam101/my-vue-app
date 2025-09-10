<template>
  <div class="main-layout">
    <!-- Header -->
    <header class="header">
      <div class="header-left">
        <img src="/logo.png" alt="Viva Lavi" class="logo" />
        <h1>ERP Viva Lavi</h1>
      </div>
      <button class="logout-btn" @click="logout">Đăng xuất</button>
    </header>

    <div class="content">
      <!-- Sidebar -->
      <aside class="sidebar">
        <ul>
          <li><router-link to="/dashboard">🏠 Dashboard</router-link></li>
          <li><router-link to="/products">📦 Mặt hàng</router-link></li>
          <li><router-link to="/categories">🗂️ Danh mục</router-link></li>
          <li><router-link to="/suppliers">🏢 Nhà cung cấp</router-link></li>
          <li><router-link to="/customers">👥 Khách hàng</router-link></li>
          <li><router-link to="/orders">📝 Đơn hàng</router-link></li>
          <!-- <li><router-link to="/inventory">🏭 Kho</router-link></li> -->
          <li><router-link to="/reports">📊 Báo cáo</router-link></li>
        </ul>
      </aside>

      <!-- Main Content -->
      <main class="main-view">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
const router = useRouter()

const logout = () => {
  localStorage.removeItem("token")
  router.push("/login")
}
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: "Segoe UI", sans-serif;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #4a90e2;
  color: white;
  padding: 10px 20px;
}
.header-left {
  display: flex;
  align-items: center;
}
.logo {
  height: 40px;
  margin-right: 10px;
}
.logout-btn {
  background: #f44336;
  border: none;
  padding: 8px 16px;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}
.logout-btn:hover {
  background: #d32f2f;
}

/* Content */
.content {
  display: flex;
  flex: 1;
}
.sidebar {
  width: 220px;
  background: #f8f9fa;
  padding: 20px;
  border-right: 1px solid #ddd;
}
.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.sidebar li {
  margin-bottom: 12px;
}
.sidebar a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  display: block;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background 0.2s;
}
.sidebar a.router-link-exact-active {
  background: #4a90e2;
  color: white;
}
.sidebar a:hover {
  background: #e0e0e0;
}
.main-view {
  flex: 1;
  padding: 20px;
  background: #fff;
  overflow-y: auto;
}
</style>
