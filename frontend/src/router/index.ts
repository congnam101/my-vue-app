// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"

// Layout + Views
import MainLayout from "../layouts/MainLayout.vue"
import LoginView from "../views/LoginView.vue"
import RegisterView from "../views/RegisterView.vue"
import DashboardView from "../views/DashboardView.vue"
import CustomersView from "../views/CustomersView.vue"
import ProductsView from "../views/ProductsView.vue"
import SuppliersView from "../views/SuppliersView.vue"
import CategoriesView from "../views/CategoriesView.vue"
import OrdersView from "../views/OrdersView.vue"
import ReportsView from "../views/ReportsView.vue"

const routes: RouteRecordRaw[] = [
  {
    path: "/", // đường dẫn gốc
    redirect: "/login", // tự động chuyển sang login
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterView,
  },
  {
    path: "/",
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "dashboard", name: "Dashboard", component: DashboardView },
      { path: "customers", name: "Customers", component: CustomersView }, // Khách hàng
      { path: "products", name: "Products", component: ProductsView },
      { path: "suppliers", name: "Suppliers", component: SuppliersView },
      { path: "categories", name: "Categories", component: CategoriesView },
      { path: "orders", name: "Orders", component: OrdersView },
      { path: "reports", name: "Reports", component: ReportsView },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Middleware: kiểm tra xác thực
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("token")
  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login")
  } else {
    next()
  }
})

export default router
