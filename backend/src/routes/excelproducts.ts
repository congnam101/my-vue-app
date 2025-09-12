// backend/src/routes/excelproduct.ts
import { Router } from "express";
import { pool } from "../db";

const excelProductRouter = Router();

excelProductRouter.post("/import", async (req, res) => {
  const products = req.body;

  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ message: "Không có dữ liệu để import" });
  }

  try {
    for (const p of products) {
      await pool.query(
        `INSERT INTO products (code, name, category_id, unit, price, supplier_id) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [p.code, p.name, p.category_id, p.unit, p.price, p.supplier_id]
      );
    }

    res.json({ message: `✅ Đã import ${products.length} sản phẩm thành công!` });
  } catch (err) {
    console.error("❌ Import products lỗi:", err);
    res.status(500).json({ message: "Import products thất bại", error: err });
  }
});

export default excelProductRouter;
