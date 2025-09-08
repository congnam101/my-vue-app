// backend/src/index.ts
import express from "express";
import cors from "cors";
import loginRouter from "./routes/login"; // Login route
import registerRouter from "./routes/register"; // Register route
import { setupSwagger } from "./swagger";

const app = express();

// Middleware: luôn đặt trước routes
app.use(cors());
app.use(express.json());

// Routes
app.use("/login", loginRouter);
app.use("/register", registerRouter);

// Test route gốc
app.get("/", (req, res) => {
  res.send("Backend đang chạy OK!");
});

// Swagger
setupSwagger(app);

const PORT = process.env.BACKEND_PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
  console.log(`Swagger UI at http://localhost:${PORT}/api-docs`);
});
