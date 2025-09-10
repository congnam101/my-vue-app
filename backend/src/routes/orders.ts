// backend/src/routes/orders.ts
import { Router } from "express";
import { pool } from "../db";

const ordersRouter = Router();

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Lấy tất cả đơn hàng kèm chi tiết sản phẩm
 *     tags:
 *       - Orders
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng
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
 *                   customer_id:
 *                     type: integer
 *                   customer_name:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   total:
 *                     type: number
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         item_id:
 *                           type: integer
 *                         product_id:
 *                           type: integer
 *                         product_name:
 *                           type: string
 *                         quantity:
 *                           type: number
 *                         price:
 *                           type: number
 *       500:
 *         description: Lỗi server
 */
ordersRouter.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.id AS order_id, o.code AS order_code, o.customer_id, c.name AS customer_name, o.date, o.total,
        oi.id AS item_id, p.id AS product_id, p.name AS product_name, oi.quantity, oi.price
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN products p ON oi.product_id = p.id
      ORDER BY o.id DESC, oi.id ASC
    `);

    const ordersMap: Record<number, any> = {};
    result.rows.forEach(row => {
      if (!ordersMap[row.order_id]) {
        ordersMap[row.order_id] = {
          id: row.order_id,
          code: row.order_code,
          customer_id: row.customer_id,
          customer_name: row.customer_name,
          date: row.date,
          total: row.total,
          items: []
        };
      }
      if (row.item_id) {
        ordersMap[row.order_id].items.push({
          item_id: row.item_id,
          product_id: row.product_id,
          product_name: row.product_name,
          quantity: row.quantity,
          price: row.price
        });
      }
    });

    res.json(Object.values(ordersMap));
  } catch (err) {
    console.error("❌ Lỗi khi lấy đơn hàng:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Thêm đơn hàng mới kèm chi tiết sản phẩm
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - customer_id
 *               - items
 *             properties:
 *               code:
 *                 type: string
 *               customer_id:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date-time
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - product_id
 *                     - quantity
 *                     - price
 *                   properties:
 *                     product_id:
 *                       type: integer
 *                     quantity:
 *                       type: number
 *                     price:
 *                       type: number
 *     responses:
 *       200:
 *         description: Đơn hàng đã được thêm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 order:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     code:
 *                       type: string
 *                     customer_id:
 *                       type: integer
 *                     date:
 *                       type: string
 *                     total:
 *                       type: number
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product_id:
 *                         type: integer
 *                       quantity:
 *                         type: number
 *                       price:
 *                         type: number
 *       400:
 *         description: Thiếu thông tin đơn hàng hoặc sản phẩm
 *       500:
 *         description: Lỗi server
 */
ordersRouter.post("/", async (req, res) => {
  const { code, customer_id, date, items } = req.body;
  if (!code || !customer_id || !items?.length) {
    return res.status(400).json({ message: "Thiếu thông tin đơn hàng hoặc sản phẩm" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const total = items.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0);

    const resultOrder = await client.query(
      "INSERT INTO orders (code, customer_id, date, total) VALUES ($1,$2,$3,$4) RETURNING *",
      [code, customer_id, date, total]
    );
    const orderId = resultOrder.rows[0].id;

    for (const item of items) {
      await client.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1,$2,$3,$4)",
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    await client.query("COMMIT");
    res.json({ message: "Đã thêm đơn hàng", order: resultOrder.rows[0], items });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Lỗi khi thêm đơn hàng:", err);
    res.status(500).json({ message: "Lỗi server" });
  } finally {
    client.release();
  }
});

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Xóa đơn hàng và các sản phẩm trong đơn
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID đơn hàng
 *     responses:
 *       200:
 *         description: Đơn hàng đã được xóa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 order:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     code:
 *                       type: string
 *                     customer_id:
 *                       type: integer
 *                     date:
 *                       type: string
 *                     total:
 *                       type: number
 *       404:
 *         description: Không tìm thấy đơn hàng
 *       500:
 *         description: Lỗi server
 */
ordersRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM order_items WHERE order_id=$1", [id]);
    const result = await client.query("DELETE FROM orders WHERE id=$1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    await client.query("COMMIT");
    res.json({ message: "Đã xóa đơn hàng", order: result.rows[0] });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Lỗi khi xóa đơn hàng:", err);
    res.status(500).json({ message: "Lỗi server" });
  } finally {
    client.release();
  }
});

export default ordersRouter;
