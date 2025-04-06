// controllers/productController.js
const db = require('../config/db'); // DB bağlantısı
const { scrapeDummyResults } = require('../utils/scraper');

const searchProducts = async (req, res) => {
  const query = req.query.query;
  const userId = req.userId;

  if (!query) return res.status(400).json({ message: 'Query is required' });

  try {
    // Veritabanında ara
    const [existingProducts] = await db.execute(
      "SELECT * FROM products WHERE name LIKE ?",
      [`%${query}%`]
    );

    // Sonuç bulunduysa direkt döndür
    if (existingProducts.length > 0) {
      // Arama logunu kaydet
      await db.execute(
        "INSERT INTO search_logs (user_id, query, result_count) VALUES (?, ?, ?)",
        [userId, query, existingProducts.length]
      );

      return res.json({ from: 'db', results: existingProducts });
    }

    // Sahte scraping verisi al (gerçek scraping sonra eklenecek)
    const scrapedResults = await scrapeDummyResults(query);

    // Veritabanına ekle
    for (const result of scrapedResults) {
      await db.execute(
        "INSERT INTO products (name, part_number, supplier, price, delivery_time, currency, url) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [result.name, result.part_number, result.supplier, result.price, result.delivery_time, result.currency, result.url]
      );
    }

    // Arama logunu kaydet
    await db.execute(
      "INSERT INTO search_logs (user_id, query, result_count) VALUES (?, ?, ?)",
      [userId, query, scrapedResults.length]
    );

    res.json({ from: 'web', results: scrapedResults });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { searchProducts };
