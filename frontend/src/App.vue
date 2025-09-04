<template>
  <div :class="['app', isDark ? 'dark' : 'light']">
    <h1>Chào {{ username || 'bạn' }} 👋</h1>

    <input v-model="username" placeholder="Nhập tên của bạn" />

    <p>Bạn đã bấm {{ count }} lần.</p>
    <div class="buttons">
      <button @click="decrement">Giảm</button>
      <button @click="increment">Tăng</button>
    </div>

    <button @click="toggleTheme">
      Chuyển sang chế độ {{ isDark ? 'sáng' : 'tối' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)
const username = ref('')
const isDark = ref(false)

const increment = () => count.value++
const decrement = () => count.value--
const toggleTheme = () => isDark.value = !isDark.value
</script>

<style scoped>
.app {
  text-align: center;
  padding: 2rem;
  transition: background 0.3s, color 0.3s;
  font-family: 'Segoe UI', sans-serif;
}

input {
  padding: 8px;
  margin-bottom: 1rem;
  font-size: 16px;
}

button {
  margin: 0.5rem;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.light {
  background: #f9f9f9;
  color: #333;
}

.dark {
  background: #1e1e1e;
  color: #f9f9f9;
}
</style>
