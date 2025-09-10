// backend/src/routes/categories.ts
import { Router } from "express";
import { pool } from "../db";

const categoriesRouter = Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Lấy tất cả danh mục
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: Danh sách danh mục
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
 *       500:
 *         description: Lỗi server
 */
categoriesRouter.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh mục:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Thêm danh mục mới
 *     tags:
 *       - Categories
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
 *     responses:
 *       200:
 *         description: Danh mục đã được thêm
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
 *       400:
 *         description: Thiếu thông tin bắt buộc
 *       500:
 *         description: Lỗi server
 */
categoriesRouter.post("/", async (req, res) => {
  const { code, name } = req.body;
  if (!code || !name) {
    return res.status(400).json({ message: "Mã và tên danh mục là bắt buộc" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO categories (code, name) VALUES ($1, $2) RETURNING *",
      [code, name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Lỗi khi thêm danh mục:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Cập nhật danh mục theo ID
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID danh mục
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
 *     responses:
 *       200:
 *         description: Danh mục đã được cập nhật
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
 *       404:
 *         description: Không tìm thấy danh mục
 *       500:
 *         description: Lỗi server
 */
categoriesRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { code, name } = req.body;

  try {
    const result = await pool.query(
      "UPDATE categories SET code=$1, name=$2 WHERE id=$3 RETURNING *",
      [code, name, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật danh mục:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Xóa danh mục theo ID
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID danh mục
 *     responses:
 *       200:
 *         description: Danh mục đã được xóa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 category:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     code:
 *                       type: string
 *                     name:
 *                       type: string
 *       404:
 *         description: Không tìm thấy danh mục
 *       500:
 *         description: Lỗi server
 */
categoriesRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM categories WHERE id=$1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }
    res.json({ message: "Đã xóa danh mục", category: result.rows[0] });
  } catch (err) {
    console.error("❌ Lỗi khi xóa danh mục:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

export default categoriesRouter;
