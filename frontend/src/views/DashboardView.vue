<template>
  <div class="dashboard-container">
    <h2>Dashboard</h2>
    <p>Chào mừng bạn đến dashboard!</p>
    <button @click="logout">Đăng xuất</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();

const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};
</script>

<style scoped>
.dashboard-container {
  max-width: 600px;
  margin: 5rem auto;
  padding: 2rem;
  border-radius: 12px;
  background: #f0f0f0;
  text-align: center;
  font-family: 'Segoe UI', sans-serif;
}
button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
