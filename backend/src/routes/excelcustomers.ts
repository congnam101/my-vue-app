// backend/src/routes/excelcustomer.ts
import { Router } from "express";
import { pool } from "../db";

const excelCustomersRouter = Router();

// Import customers từ Excel (dạng JSON)
excelCustomersRouter.post("/import", async (req, res) => {
  const customers = req.body; // [{ code, name, address, tax_code }, ...]

  if (!Array.isArray(customers) || customers.length === 0) {
    return res.status(400).json({ message: "Không có dữ liệu để import" });
  }

  try {
    for (const c of customers) {
      await pool.query(
        `INSERT INTO customers (code, name, address, tax_code) 
         VALUES ($1, $2, $3, $4)`,
        [c.code, c.name, c.address, c.tax_code]
      );
    }

    res.json({ message: `✅ Đã import ${customers.length} khách hàng thành công!` });
  } catch (err) {
    console.error("❌ Import customers lỗi:", err);
    res.status(500).json({ message: "Import customers thất bại", error: err });
  }
});

export default excelCustomersRouter;
