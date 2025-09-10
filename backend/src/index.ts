import express from "express";
import cors from "cors";

// 🧭 Import các router xử lý từng chức năng
import loginRouter from "./routes/login";         // Đăng nhập
import registerRouter from "./routes/register";   // Đăng ký
import customersRouter from "./routes/customers"; // Khách hàng
import categoriesRouter from "./routes/categories"; // Danh mục
import suppliersRouter from "./routes/suppliers"; // Nhà cung cấp
import productsRouter from "./routes/products";   // Sản phẩm
import ordersRouter from "./routes/orders";       // Đơn hàng
// import reportsRouter from "./routes/reports";  // Báo cáo (chưa dùng)

import { setupSwagger } from "./swagger";         // Tài liệu API

const app = express();

// 🛡️ Middleware
app.use(cors());             // Cho phép truy cập từ các domain khác
app.use(express.json());     // Parse JSON từ request body

// 🚦 Định tuyến API
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/customers", customersRouter);
app.use("/categories", categoriesRouter);
app.use("/suppliers", suppliersRouter);
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);
// app.use("/reports", reportsRouter); // Có thể thêm sau

// 🧪 Route kiểm tra server
app.get("/", (req, res) => {
  res.send("✅ Backend đang chạy OK!");
});

// 📖 Swagger UI
setupSwagger(app);

// 🚀 Khởi động server
const PORT = process.env.BACKEND_PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
  console.log(`📖 Swagger UI at http://localhost:${PORT}/api-docs`);
});
