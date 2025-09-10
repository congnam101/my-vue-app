<template>
  <div class="login-page">
    <div class="login-form">
      <h2>Đăng ký</h2>

      <form @submit.prevent="register">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Mật khẩu" required />
        <button type="submit">Đăng ký</button>
      </form>

      <p class="register-link">
        Đã có tài khoản?
        <button @click="goLogin">Đăng nhập</button>
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

const register = async () => {
  successMessage.value = "";
  errorMessage.value = "";

  try {
    const res = await axios.post("http://localhost:4000/register", {
      email: email.value,
      password: password.value,
    });

    successMessage.value = res.data.message || "Đăng ký thành công!";
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      errorMessage.value = err.response.data?.message || "Có lỗi xảy ra";
    } else {
      errorMessage.value = "Có lỗi xảy ra";
    }
  }
};

const goLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f3f3f3;
  font-family: 'Segoe UI', sans-serif;
}

.login-form {
  background-color: #fff;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.login-form h2 {
  font-size: 24px;
  margin-bottom: 24px;
}

.login-form input {
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
}

.login-form button {
  width: 100%;
  padding: 12px;
  background-color: #e0e0e0;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-form button:hover {
  background-color: #d5d5d5;
}

.register-link {
  margin-top: 16px;
  font-size: 14px;
  color: #ffffff;
}

.register-link button {
  background: none;
  border: none;
  color: #3a4ced;
  cursor: pointer;
  text-decoration: underline;
  font-size: 14px;
}

.success {
  color: green;
  margin-top: 12px;
}

.error {
  color: red;
  margin-top: 12px;
}
</style>
