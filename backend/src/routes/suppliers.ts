// backend/src/routes/suppliers.ts
import { Router } from "express";
import { pool } from "../db";

const suppliersRouter = Router();

/**
 * @swagger
 * /suppliers:
 *   get:
 *     summary: Lấy danh sách nhà cung cấp
 *     tags:
 *       - Suppliers
 *     responses:
 *       200:
 *         description: Danh sách nhà cung cấp
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   code:
 *                     type: string
 *                   name:
 *                     type: string
 *                   address:
 *                     type: string
 *                   phone:
 *                     type: string
 *       500:
 *         description: Lỗi server
 */
suppliersRouter.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM suppliers ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Lỗi khi lấy NCC:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/**
 * @swagger
 * /suppliers:
 *   post:
 *     summary: Thêm nhà cung cấp mới
 *     tags:
 *       - Suppliers
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
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nhà cung cấp đã được thêm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 code:
 *                   type: string
 *                 name:
 *                   type: string
 *                 address:
 *                   type: string
 *                 phone:
 *                   type: string
 *       400:
 *         description: Thiếu thông tin bắt buộc (code hoặc name)
 *       500:
 *         description: Lỗi server
 */
suppliersRouter.post("/", async (req, res) => {
  const { code, name, address, phone } = req.body;
  if (!code || !name) {
    return res.status(400).json({ message: "Mã và tên nhà cung cấp là bắt buộc" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO suppliers (code, name, address, phone) VALUES ($1, $2, $3, $4) RETURNING *",
      [code, name, address, phone]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Lỗi khi thêm NCC:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/**
 * @swagger
 * /suppliers/{id}:
 *   put:
 *     summary: Cập nhật nhà cung cấp theo ID
 *     tags:
 *       - Suppliers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID nhà cung cấp
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
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nhà cung cấp đã được cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 code:
 *                   type: string
 *                 name:
 *                   type: string
 *                 address:
 *                   type: string
 *                 phone:
 *                   type: string
 *       404:
 *         description: Không tìm thấy nhà cung cấp
 *       500:
 *         description: Lỗi server
 */
suppliersRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { code, name, address, phone } = req.body;

  try {
    const result = await pool.query(
      "UPDATE suppliers SET code=$1, name=$2, address=$3, phone=$4 WHERE id=$5 RETURNING *",
      [code, name, address, phone, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy NCC" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật NCC:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/**
 * @swagger
 * /suppliers/{id}:
 *   delete:
 *     summary: Xóa nhà cung cấp theo ID
 *     tags:
 *       - Suppliers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID nhà cung cấp
 *     responses:
 *       200:
 *         description: Nhà cung cấp đã được xóa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 supplier:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     code:
 *                       type: string
 *                     name:
 *                       type: string
 *                     address:
 *                       type: string
 *                     phone:
 *                       type: string
 *       404:
 *         description: Không tìm thấy nhà cung cấp
 *       500:
 *         description: Lỗi server
 */
suppliersRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM suppliers WHERE id=$1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy NCC" });
    }
    res.json({ message: "Đã xóa NCC", supplier: result.rows[0] });
  } catch (err) {
    console.error("❌ Lỗi khi xóa NCC:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

export default suppliersRouter;
