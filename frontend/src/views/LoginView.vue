<template>
  <div class="login-page">
    <div class="login-form">
      <h2>Đăng nhập</h2>

      <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Mật khẩu" required />
        <button type="submit">Đăng nhập</button>
      </form>

      <p>Chưa có tài khoản? 
        <button class="link-btn" @click="goRegister">Đăng ký</button>
      </p>

      <p v-if="successMessage" class="success">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const email = ref("");
const password = ref("");
const successMessage = ref("");
const errorMessage = ref("");

// Đăng nhập và điều hướng dashboard
const login = async () => {
  successMessage.value = "";
  errorMessage.value = "";

  try {
    // Thay url thành backend login của bạn
    const res = await axios.post("http://localhost:4000/login", {
      email: email.value,
      password: password.value,
    });

    successMessage.value = res.data.message || "Đăng nhập thành công!";
    localStorage.setItem("token", res.data.token); // lưu token nếu có

    // Chuyển trang dashboard
    router.push("/dashboard");
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      errorMessage.value = err.response.data?.message || "Có lỗi xảy ra";
    } else {
      errorMessage.value = "Có lỗi xảy ra";
    }
  }
};

// Chuyển sang trang /register
const goRegister = () => {
  router.push("/register");
};
</script>

<style>
.login-page {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #b08eea, #9333ea);
  font-family: 'Segoe UI', sans-serif;
  padding: 1rem;
  box-sizing: border-box;
}

.login-form {
  background: #fff;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

input {
  width: 100%;
  padding: 12px;
  margin-bottom: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  outline: none;
  font-size: 16px;
}

input:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 8px rgba(124, 58, 237, 0.4);
}

button {
  padding: 12px;
  width: 100%;
  border-radius: 8px;
  border: none;
  background: linear-gradient(135deg, #7c3aed, #9333ea);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-bottom: 1rem;
}

button:hover {
  transform: scale(1.03);
  box-shadow: 0 8px 20px rgba(0,0,0,0.25);
}

.link-btn {
  background: none;
  border: none;
  color: #7c3aed;
  cursor: pointer;
  font-weight: 600;
  text-decoration: underline;
  padding: 0;
  margin-left: 5px;
}

.success { color: green; margin-top: 1rem; font-weight: 500; }
.error { color: red; margin-top: 1rem; font-weight: 500; }
</style>
