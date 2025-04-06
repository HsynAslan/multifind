// controllers/scraperController.js
const puppeteer = require("puppeteer");
const { saveProductAndLog, findSimilarProductsFromDB, saveSearchTerm  } = require("../utils/productHelper");


const axios = require("axios");

// Google API Key ve Custom Search Engine (CSE) ID'nizi .env dosyasından alacağız
const googleApiKey = process.env.GOOGLE_API_KEY;
const googleCx = process.env.GOOGLE_CX; // Custom Search Engine ID

const searchGoogle = async (query) => {
  try {
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: googleApiKey,     // API Key
        cx: googleCx,          // Custom Search Engine ID
        q: query,              // Arama sorgusu
        num: 5                // Kaç sonuç döndürüleceği
      }
    });
    return response.data.items;  // Arama sonuçları
  } catch (error) {
    console.error("Google Search API hatası:", error);
    throw new Error("Google arama işlemi başarısız.");
  }
};

const scrapeGoogleResults = async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: "Query is required" });
  
    try {
      const searchResults = await searchGoogle(query);
      
      // Google'dan gelen verileri işleyin
      const results = searchResults.map(result => ({
        name: result.title,
        url: result.link,
        snippet: result.snippet,
        supplier: new URL(result.link).hostname,
        price: Math.floor(Math.random() * 500) + 100,  // Sahte fiyat
        delivery_time: Math.floor(Math.random() * 7) + 1, // Sahte teslimat süresi
        currency: "TRY", // Sahte para birimi
      }));
  
      res.json({ webResults: results });
    } catch (error) {
      console.error("Scraping failed:", error);
      res.status(500).json({ message: "Scraping failed" });
    }
  };
  
  
const suggestFromDB = async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: "Query is required" });
  
    try {
      const results = await findSimilarProductsFromDB(query);
      res.json({ dbResults: results }); // 'results' değişkenini doğru şekilde JSON olarak döndürdük
    } catch (err) {
      console.error("Suggestion error:", err);
      res.status(500).json({ message: "Suggestion error" });
    }
  };
  
  
  module.exports = {
    scrapeGoogleResults,
    suggestFromDB,
  };
  