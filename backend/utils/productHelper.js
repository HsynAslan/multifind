// utils/productHelper.js
const db = require("../config/db");

// Arama kelimesini kaydetme
const saveSearchTerm = async (query) => {
  // Önce arama kelimesinin daha önce kaydedilip edilmediğini kontrol et
  const [existing] = await db.query(
    "SELECT id FROM search_terms WHERE term = ? LIMIT 1",
    [query]
  );

  if (existing.length === 0) {
    await db.query(
      "INSERT INTO search_terms (term) VALUES (?)",
      [query]
    );
  }
};

// Ürünü kaydetme ve loglama
const saveProductAndLog = async (product) => {
  const [existing] = await db.query(
    "SELECT id FROM products WHERE url = ? LIMIT 1",
    [product.url]
  );

  let productId;
  if (existing.length === 0) {
    const [inserted] = await db.query(
      `INSERT INTO products (name, part_number, supplier, price, delivery_time, currency, url) 
       VALUES (?, NULL, ?, ?, ?, ?, ?)`,
      [product.name, product.supplier, product.price, product.delivery_time, product.currency, product.url]
    );
    productId = inserted.insertId;
  } else {
    productId = existing[0].id;
  }

  await db.query(
    `INSERT INTO product_logs (product_id, price, delivery_time, currency) VALUES (?, ?, ?, ?)`,
    [productId, product.price, product.delivery_time, product.currency]
  );

  return productId;
};

// Veritabanındaki benzer ürünleri bulma
const findSimilarProductsFromDB = async (query) => {
    const [rows] = await db.query(
      "SELECT DISTINCT name, created_at FROM products WHERE name LIKE ? ORDER BY created_at DESC LIMIT 20",
      [`%${query}%`]
    );
    return rows.map((r) => r.name);
  };
  
  

module.exports = {
  saveProductAndLog,
  findSimilarProductsFromDB,
  saveSearchTerm,
};
