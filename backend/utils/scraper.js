// utils/scraper.js
const scrapeDummyResults = async (query) => {
    return [
      {
        name: `${query} Product A`,
        part_number: null,
        supplier: 'DummySupplier1',
        price: 100.0,
        delivery_time: 3,
        currency: 'USD',
        url: 'https://example.com/product-a',
      },
      {
        name: `${query} Product B`,
        part_number: null,
        supplier: 'DummySupplier2',
        price: 120.5,
        delivery_time: 5,
        currency: 'USD',
        url: 'https://example.com/product-b',
      }
    ];
  };
  
  module.exports = { scrapeDummyResults };
  