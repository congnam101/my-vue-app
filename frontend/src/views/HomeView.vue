<template>
  <div class="login-container">
    <h2>Đăng nhập ứng dụng</h2>

    <form @submit.prevent="login">
      <div class="form-group">
        <label for="email">Email</label>
        <input v-model="email" type="email" id="email" required />
      </div>

      <div class="form-group">
        <label for="password">Mật khẩu</label>
        <input v-model="password" type="password" id="password" required />
      </div>

      <button type="submit">Đăng nhập</button>
    </form>

    <p v-if="successMessage" class="success">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios, { AxiosError } from "axios";
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
    localStorage.setItem("token", res.data.token); // ✅ lưu token
    router.push("/dashboard");
  } catch (err) {
    const e = err as AxiosError<{ message?: string }>;
    errorMessage.value = e.response?.data?.message || "Có lỗi xảy ra";
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 5rem auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: "Segoe UI", sans-serif;
}
h2 {
  text-align: center;
  margin-bottom: 1.5rem;
}
.form-group {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: bold;
}
input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 15px;
}
button {
  width: 100%;
  padding: 12px;
  background: #0078d7;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
}
button:hover {
  background: #005ea3;
}
.success {
  margin-top: 1rem;
  color: green;
  text-align: center;
}
.error {
  margin-top: 1rem;
  color: red;
  text-align: center;
}
</style>
