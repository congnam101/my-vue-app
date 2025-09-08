import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";
import RegisterView from "../views/RegisterView.vue";

// Định nghĩa tất cả routes trước
const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: LoginView },
  { path: "/register", component: RegisterView },
  {
    path: "/dashboard",
    component: DashboardView,
    meta: { requiresAuth: true },
  },
];

// Tạo router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware: kiểm tra token trước khi vào dashboard
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("token");

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});

export default router;
