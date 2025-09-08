// backend/src/routes/login.ts
import { Router } from "express";
import { pool } from "../db";

const loginRouter = Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Đăng nhập user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Sai thông tin đăng nhập
 */
loginRouter.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rowCount === 0) {
      return res.status(401).json({ message: "Sai thông tin đăng nhập" });
    }

    const user = result.rows[0];

    // Check password (plain text, đổi thành bcrypt nếu muốn)
    if (user.password !== password) {
      return res.status(401).json({ message: "Sai thông tin đăng nhập" });
    }

    // Tạo token fake (hoặc JWT thật nếu muốn)
    const token = "fake-jwt-token";

    res.json({ message: "Đăng nhập thành công", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});
loginRouter.get("/login", (req, res) => {
  res.send("Đây là route login, hãy POST dữ liệu để đăng nhập");
});

export default loginRouter;
