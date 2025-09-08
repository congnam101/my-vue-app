<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
    <!-- Container fade-in -->
    <div class="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md transform scale-90 opacity-0 animate-fade-in">
      <h2 class="text-3xl font-extrabold mb-6 text-center text-gray-800 animate-slide-down">Đăng Ký</h2>

      <form @submit.prevent="register" class="space-y-5">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          required
          class="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-400 transition shadow-inner duration-300 hover:shadow-lg"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Mật khẩu"
          required
          class="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-400 transition shadow-inner duration-300 hover:shadow-lg"
        />

        <button
          type="submit"
          class="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold shadow-lg hover:from-pink-500 hover:to-purple-500 transform hover:scale-105 transition-all duration-300"
        >
          Đăng Ký
        </button>
      </form>

      <p class="mt-6 text-center text-gray-600 text-sm">
        Đã có tài khoản? 
        <router-link to="/login" class="text-purple-600 font-semibold hover:underline">Đăng Nhập</router-link>
      </p>

      <p v-if="successMessage" class="text-green-500 mt-4 text-center">{{ successMessage }}</p>
      <p v-if="errorMessage" class="text-red-500 mt-4 text-center">{{ errorMessage }}</p>
    </div>
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
</script>

<style scoped>
/* Keyframe cho animation fade-in và slide-down */
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.5s forwards;
}
.animate-slide-down {
  animation: slideDown 0.5s forwards;
}
</style>
