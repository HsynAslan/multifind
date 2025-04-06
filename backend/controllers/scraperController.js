// controllers/scraperController.js
const axios = require("axios");
const { saveProductAndLog, findSimilarProductsFromDB, saveSearchTerm } = require("../utils/productHelper");

const googleApiKey = process.env.GOOGLE_API_KEY;
const googleCx = process.env.GOOGLE_CX; // Custom Search Engine ID

// Google Custom Search API'yi çağıran fonksiyon
const searchGoogle = async (query) => {
    try {
      // Arama sorgusunun sonuna "satın al" ekliyoruz
      const queryWithPurchase = `${query} satın al`;
  
      const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: {
          key: googleApiKey,     // API Key
          cx: googleCx,          // Custom Search Engine ID
          q: queryWithPurchase,  // Arama sorgusunu ekliyoruz
          num: 2                 // Kaç sonuç döndürüleceği
        }
      });
      return response.data.items;  // Arama sonuçları
    } catch (error) {
      console.error("Google Search API hatası:", error);
      throw new Error("Google arama işlemi başarısız.");
    }
  };
  

// Google'dan gelen sonuçları işleyen ve frontend'e döndüren fonksiyon
// controllers/scraperController.js
const scrapeGoogleResults = async (req, res) => {
    const query = req.query.q;  // 'q' parametresi GET isteğiyle gelmeli
    if (!query) {
        return res.status(400).json({ message: "Query is required" });  // Eğer query parametresi yoksa hata mesajı döndürülür
    }

    try {
        const searchResults = await searchGoogle(query);
        
        // Google'dan gelen verileri işleyin
        const results = searchResults.map(result => ({
            name: result.title,
            url: result.link,
            snippet: result.snippet,
            supplier: new URL(result.link).hostname,
            price: Math.floor(Math.random() * 500) + 100, // Sahte fiyat
            delivery_time: Math.floor(Math.random() * 7) + 1, // Sahte teslimat süresi
            currency: "TRY", // Sahte para birimi
        }));

        res.json({ webResults: results });
    } catch (error) {
        console.error("Scraping failed:", error);
        res.status(500).json({ message: "Scraping failed" });
    }
};


// DB'den önerileri arayan fonksiyon
const suggestFromDB = async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ message: "Query is required" });

  try {
    const results = await findSimilarProductsFromDB(query);
    res.json({ dbResults: results });  // 'results' değişkenini doğru şekilde JSON olarak döndürüyoruz
  } catch (err) {
    console.error("Suggestion error:", err);
    res.status(500).json({ message: "Suggestion error", error: err.message });
  }
};

module.exports = {
  scrapeGoogleResults,
  suggestFromDB,
};
