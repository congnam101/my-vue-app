import { Router } from "express";
import { pool } from "../db";

const customersRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Quản lý khách hàng
 */

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Lấy danh sách khách hàng
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: Danh sách khách hàng
 */
customersRouter.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM customers ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Lỗi khi lấy khách hàng:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/**
 * @swagger
 * /customers:
 *   post:
 *     summary: Thêm khách hàng mới
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - name
 *             properties:
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               tax_code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Khách hàng đã được thêm
 */
customersRouter.post("/", async (req, res) => {
  const { code, name, address, tax_code } = req.body;
  if (!code || !name) {
    return res.status(400).json({ message: "Mã và tên khách hàng là bắt buộc" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO customers (code, name, address, tax_code) VALUES ($1, $2, $3, $4) RETURNING *",
      [code, name, address, tax_code]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Lỗi khi thêm khách hàng:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/**
 * @swagger
 * /customers/{id}:
 *   put:
 *     summary: Cập nhật thông tin khách hàng
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               tax_code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Khách hàng đã được cập nhật
 *       404:
 *         description: Không tìm thấy khách hàng
 */
customersRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { code, name, address, tax_code } = req.body;

  try {
    const result = await pool.query(
      "UPDATE customers SET code=$1, name=$2, address=$3, tax_code=$4 WHERE id=$5 RETURNING *",
      [code, name, address, tax_code, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy khách hàng" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật khách hàng:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/**
 * @swagger
 * /customers/{id}:
 *   delete:
 *     summary: Xóa khách hàng
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Khách hàng đã được xóa
 *       404:
 *         description: Không tìm thấy khách hàng
 */
customersRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM customers WHERE id=$1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy khách hàng" });
    }
    res.json({ message: "Đã xóa khách hàng", customer: result.rows[0] });
  } catch (err) {
    console.error("❌ Lỗi khi xóa khách hàng:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

export default customersRouter;
