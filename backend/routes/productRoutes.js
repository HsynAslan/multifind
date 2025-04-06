// productRoutes.js
const express = require("express");
const router = express.Router();
const { scrapeGoogleResults, suggestFromDB } = require("../controllers/scraperController");
const auth = require("../middlewares/authMiddleware");

// Arama önerileri
router.get("/suggestions", auth, suggestFromDB); // Burada doğru endpoint'i sağlıyoruz

// Arama sonuçları
// Örnek GET route
router.get("/search", scrapeGoogleResults); // Burada işleyici fonksiyon eksik olabilir

module.exports = router;
