<template>
  <div class="login-container">
    <h2>Đăng nhập</h2>

    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Mật khẩu" required />
      <button type="submit">Đăng nhập</button>
    </form>

    <p v-if="successMessage" class="success">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const successMessage = ref("");
const errorMessage = ref("");
const router = useRouter();

const login = async () => {
  successMessage.value = "";
  errorMessage.value = "";

  try {
    const res = await axios.post("http://localhost:4000/login", {
      email: email.value,
      password: password.value,
    });

    successMessage.value = res.data.message;
    localStorage.setItem("token", res.data.token); // lưu token
    router.push("/dashboard");
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      errorMessage.value = err.response.data?.message || "Có lỗi xảy ra";
    } else {
      errorMessage.value = "Có lỗi xảy ra";
    }
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 5rem auto;
  padding: 2rem;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  text-align: center;
  font-family: 'Segoe UI', sans-serif;
}
input {
  display: block;
  width: 100%;
  margin-bottom: 1rem;
  padding: 10px;
  font-size: 16px;
}
button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
.success { color: green; margin-top: 1rem; }
.error { color: red; margin-top: 1rem; }
</style>
