// src/routes/register.ts
import { Router } from "express";
import { pool } from "../db";

const registerRouter = Router();

registerRouter.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email và mật khẩu là bắt buộc" });
  }

  try {
    const existing = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const newUser = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, password]
    );

    res.json({ message: "Đăng ký thành công", user: newUser.rows[0] });
  } catch (err) {
    console.error(err); // ✅ log lỗi backend
    res.status(500).json({ message: "Lỗi server" });
  }
});

export default registerRouter;
