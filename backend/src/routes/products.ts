// backend/src/routes/products.ts
import { Router } from "express";
import { pool } from "../db";

const productsRouter = Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lấy danh sách sản phẩm kèm tên danh mục và nhà cung cấp
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm
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
 *                   category_id:
 *                     type: integer
 *                   category_name:
 *                     type: string
 *                   unit:
 *                     type: string
 *                   price:
 *                     type: number
 *                   supplier_id:
 *                     type: integer
 *                   supplier_name:
 *                     type: string
 *       500:
 *         description: Lỗi server
 */
productsRouter.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.name AS category_name, s.name AS supplier_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      ORDER BY p.id ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Lỗi khi lấy sản phẩm:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Thêm sản phẩm mới
 *     tags:
 *       - Products
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
 *               categoryId:
 *                 type: integer
 *               unit:
 *                 type: string
 *               price:
 *                 type: number
 *               supplierId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Sản phẩm đã được thêm
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
 *                 category_id:
 *                   type: integer
 *                 unit:
 *                   type: string
 *                 price:
 *                   type: number
 *                 supplier_id:
 *                   type: integer
 *       400:
 *         description: Thiếu thông tin bắt buộc (code hoặc name)
 *       500:
 *         description: Lỗi server
 */
productsRouter.post("/", async (req, res) => {
  const { code, name, categoryId, unit, price, supplierId } = req.body;
  if (!code || !name) {
    return res.status(400).json({ message: "Mã và tên sản phẩm là bắt buộc" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO products (code, name, category_id, unit, price, supplier_id)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [code, name, categoryId || null, unit || null, price || 0, supplierId || null]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Lỗi khi thêm sản phẩm:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Cập nhật sản phẩm theo ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID sản phẩm
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
 *               categoryId:
 *                 type: integer
 *               unit:
 *                 type: string
 *               price:
 *                 type: number
 *               supplierId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Sản phẩm đã được cập nhật
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
 *                 category_id:
 *                   type: integer
 *                 unit:
 *                   type: string
 *                 price:
 *                   type: number
 *                 supplier_id:
 *                   type: integer
 *       404:
 *         description: Không tìm thấy sản phẩm
 *       500:
 *         description: Lỗi server
 */
productsRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { code, name, categoryId, unit, price, supplierId } = req.body;

  try {
    const result = await pool.query(
      `UPDATE products SET code=$1, name=$2, category_id=$3, unit=$4, price=$5, supplier_id=$6
       WHERE id=$7 RETURNING *`,
      [code, name, categoryId || null, unit || null, price || 0, supplierId || null, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật sản phẩm:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Xóa sản phẩm theo ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID sản phẩm
 *     responses:
 *       200:
 *         description: Sản phẩm đã được xóa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     code:
 *                       type: string
 *                     name:
 *                       type: string
 *                     category_id:
 *                       type: integer
 *                     unit:
 *                       type: string
 *                     price:
 *                       type: number
 *                     supplier_id:
 *                       type: integer
 *       404:
 *         description: Không tìm thấy sản phẩm
 *       500:
 *         description: Lỗi server
 */
productsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM products WHERE id=$1 RETURNING *", [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json({ message: "Đã xóa sản phẩm", product: result.rows[0] });
  } catch (err) {
    console.error("❌ Lỗi khi xóa sản phẩm:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

export default productsRouter;
