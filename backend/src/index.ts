// backend/src/index.ts
import express from "express";
import cors from "cors";
import loginRouter from "./routes/login"; // đúng nếu index.ts nằm trong src/
import { setupSwagger } from "./swagger";

const app = express();

// src/index.ts
app.get("/", (req, res) => {
  res.send("Backend đang chạy OK!");
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/login", loginRouter);

// Swagger
setupSwagger(app);

const PORT = process.env.BACKEND_PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
  console.log(`Swagger UI at hhttp://localost:${PORT}/api-docs`);
});
