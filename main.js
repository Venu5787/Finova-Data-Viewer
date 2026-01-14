// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const errorMessage = document.getElementById('errorMessage');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Stock Elements
const stockSymbol = document.getElementById('stockSymbol');
const stockPrice = document.getElementById('stockPrice');
const stockChange = document.getElementById('stockChange');
const stockOpen = document.getElementById('stockOpen');
const stockHigh = document.getElementById('stockHigh');
const stockLow = document.getElementById('stockLow');
const stockVolume = document.getElementById('stockVolume');
const stockChartCtx = document.getElementById('stockChart').getContext('2d');

// Crypto Elements
const cryptoSymbol = document.getElementById('cryptoSymbol');
const cryptoPrice = document.getElementById('cryptoPrice');
const cryptoChange = document.getElementById('cryptoChange');
const cryptoHigh = document.getElementById('cryptoHigh');
const cryptoLow = document.getElementById('cryptoLow');
const cryptoVolume = document.getElementById('cryptoVolume');
const cryptoMarketCap = document.getElementById('cryptoMarketCap');
const cryptoChartCtx = document.getElementById('cryptoChart').getContext('2d');

// Chart instances
let stockChart = null;
let cryptoChart = null;

// API Configuration
const TWELVE_DATA_API_KEY = import.meta.env.VITE_TWELVE_DATA_API_KEY;
const COINGECKO_API_URL = '/coingecko';
const TWELVE_DATA_URL = '/twelvedata';

// Cache for storing API responses
const cache = {
    stocks: {},
    crypto: {}
};

// Cache expiration time (5 minutes)
const CACHE_EXPIRY = 5 * 60 * 1000;

// Tab switching
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// Check if data is still valid in cache
const isCacheValid = (type, key) => {
    if (!cache[type][key]) return false;
    return (Date.now() - cache[type][key].timestamp) < CACHE_EXPIRY;
};

// Format number with commas
const formatNumber = (num) => {
    if (num === null || num === undefined) return '--';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Format currency
const formatCurrency = (value, currency = 'USD') => {
    if (value === null || value === undefined) return '--';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
};

// Format percentage
const formatPercentage = (value) => {
    if (value === null || value === undefined) return '--';
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
};

// Show error message
const showError = (message) => {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 5000);
};

// Update UI with stock data
const updateStockUI = (data) => {
    if (!data) {
        showError('No stock data found. Please try another symbol.');
        return;
    }

    const { symbol, price, change, changePercent, open, high, low, volume, lastUpdated } = data;

    // Update DOM
    stockSymbol.textContent = symbol;
    stockPrice.textContent = formatCurrency(price);
    stockOpen.textContent = formatCurrency(open);
    stockHigh.textContent = formatCurrency(high);
    stockLow.textContent = formatCurrency(low);
    stockVolume.textContent = formatNumber(volume);
    
    // Update change with color coding
    stockChange.textContent = `${formatCurrency(change)} (${formatPercentage(changePercent)})`;
    stockChange.className = 'change';
    stockChange.classList.add(change >= 0 ? 'positive' : 'negative');

    // Update last updated time if available
    if (lastUpdated) {
        const lastUpdatedEl = document.getElementById('stockLastUpdated');
        if (lastUpdatedEl) {
            lastUpdatedEl.textContent = `Last updated: ${lastUpdated}`;
        }
    }
};

// Update UI with crypto data
const updateCryptoUI = (data) => {
    if (!data) {
        showError('No cryptocurrency data found. Please try another symbol.');
        return;
    }

    const { name, symbol, price, change24h, high24h, low24h, volume24h, marketCap, lastUpdated } = data;

    // Update DOM
    cryptoSymbol.textContent = `${name} (${symbol})`;
    cryptoPrice.textContent = formatCurrency(price);
    cryptoHigh.textContent = formatCurrency(high24h);
    cryptoLow.textContent = formatCurrency(low24h);
    cryptoVolume.textContent = formatCurrency(volume24h);
    cryptoMarketCap.textContent = formatCurrency(marketCap);
    
    // Update change with color coding
    cryptoChange.textContent = formatPercentage(change24h);
    cryptoChange.className = 'change';
    cryptoChange.classList.add(change24h >= 0 ? 'positive' : 'negative');

    // Update last updated time if available
    if (lastUpdated) {
        const lastUpdatedEl = document.getElementById('cryptoLastUpdated');
        if (lastUpdatedEl) {
            lastUpdatedEl.textContent = `Last updated: ${lastUpdated}`;
        }
    }
};

// Update stock chart with real data from Twelve Data API
const updateStockChart = async (symbol) => {
    try {
        // Show loading state
        stockChartCtx.textAlign = 'center';
        stockChartCtx.fillText('Loading chart data...', stockChartCtx.canvas.width / 2, stockChartCtx.canvas.height / 2);

        // Fetch historical data
        const today = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        const response = await fetch(
            `${TWELVE_DATA_URL}/time_series?symbol=${symbol}&interval=1day&start_date=${formatDate(oneMonthAgo)}&end_date=${formatDate(today)}&apikey=${TWELVE_DATA_API_KEY}`
        );
        
        const data = await response.json();
        
        if (data.status === 'error') {
            throw new Error(data.message || 'Failed to fetch historical data');
        }
        
        const timeSeries = data.values || [];
        const labels = [];
        const prices = [];
        
        // Process the data in reverse chronological order
        for (let i = Math.min(30, timeSeries.length - 1); i >= 0; i--) {
            const item = timeSeries[i];
            const date = new Date(item.datetime);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            prices.push(parseFloat(item.close));
        }
        
        // Calculate price change
        const priceChange = prices.length > 1 ? ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100 : 0;
        const isPositive = priceChange >= 0;
        
        // Destroy existing chart if it exists
        if (stockChart) {
            stockChart.destroy();
        }
        
        // Create chart
        stockChart = new Chart(stockChartCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `${symbol} Price (USD)`,
                    data: prices,
                    borderColor: isPositive ? 'rgba(34, 197, 94, 1)' : 'rgba(239, 68, 68, 1)',
                    backgroundColor: isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `$${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toFixed(2);
                            }
                        }
                    },
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                },
                animation: {
                    duration: 1000
                }
            }
        });
    } catch (error) {
        console.error('Error updating stock chart:', error);
        // Fallback to a simple line chart if API fails
        if (stockChart) {
            stockChart.destroy();
        }
        stockChartCtx.textAlign = 'center';
        stockChartCtx.fillText('Chart data unavailable', stockChartCtx.canvas.width / 2, stockChartCtx.canvas.height / 2);
    }
};

// Helper function to format date as YYYY-MM-DD
const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};

// Update crypto chart with real data from CoinGecko API
const updateCryptoChart = async (cryptoId) => {
    try {
        // Show loading state
        cryptoChartCtx.textAlign = 'center';
        cryptoChartCtx.fillText('Loading chart data...', cryptoChartCtx.canvas.width / 2, cryptoChartCtx.canvas.height / 2);

        // Calculate date range (last 30 days)
        const today = Math.floor(Date.now() / 1000);
        const oneMonthAgo = today - (30 * 24 * 60 * 60);
        
        // Fetch historical data
        const response = await fetch(
            `${COINGECKO_API_URL}/coins/${cryptoId}/market_chart/range?vs_currency=usd&from=${oneMonthAgo}&to=${today}`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch historical data');
        }
        
        const data = await response.json();
        
        if (!data.prices || data.prices.length === 0) {
            throw new Error('No price data available');
        }
        
        const prices = data.prices;
        const labels = [];
        const priceData = [];
        
        // Process the data to get daily closing prices
        let currentDate = '';
        prices.forEach(([timestamp, price]) => {
            const date = new Date(timestamp);
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            // Only take one price per day (the last one)
            if (dateStr !== currentDate) {
                labels.push(dateStr);
                priceData.push(price);
                currentDate = dateStr;
            }
        });
        
        // Calculate price change
        const priceChange = priceData.length > 1 ? 
            ((priceData[priceData.length - 1] - priceData[0]) / priceData[0]) * 100 : 0;
        const isPositive = priceChange >= 0;
        
        // Destroy existing chart if it exists
        if (cryptoChart) {
            cryptoChart.destroy();
        }
        
        // Create chart
        cryptoChart = new Chart(cryptoChartCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `${cryptoId.toUpperCase()} Price (USD)`,
                    data: priceData,
                    borderColor: isPositive ? 'rgba(34, 197, 94, 1)' : 'rgba(239, 68, 68, 1)',
                    backgroundColor: isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `$${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toFixed(2);
                            }
                        }
                    },
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                },
                animation: {
                    duration: 1000
                }
            }
        });
    } catch (error) {
        console.error('Error updating crypto chart:', error);
        // Fallback to a simple line chart if API fails
        if (cryptoChart) {
            cryptoChart.destroy();
        }
        cryptoChartCtx.textAlign = 'center';
        cryptoChartCtx.fillText('Chart data unavailable', cryptoChartCtx.canvas.width / 2, cryptoChartCtx.canvas.height / 2);
    }
};

// ---------------- STOCK FETCH (Twelve Data) ----------------
const fetchStock = async (symbol) => {
    const cacheKey = symbol.toUpperCase();
    
    // Check cache first
    if (isCacheValid('stocks', cacheKey)) {
        return cache.stocks[cacheKey].data;
    }

    try {
        // Fetch quote data
        const quoteResponse = await fetch(
            `${TWELVE_DATA_URL}/quote?symbol=${cacheKey}&apikey=${TWELVE_DATA_API_KEY}`
        );
        
        const quoteData = await quoteResponse.json();
        
        if (quoteData.status === 'error') {
            throw new Error(quoteData.message || 'Failed to fetch stock data');
        }

        // Fetch additional data
        const statsResponse = await fetch(
            `${TWELVE_DATA_URL}/stats?symbol=${cacheKey}&apikey=${TWELVE_DATA_API_KEY}`
        );
        const statsData = await statsResponse.json();

        const stockData = {
            symbol: quoteData.symbol,
            price: parseFloat(quoteData.close || '0'),
            change: parseFloat(quoteData.change || '0'),
            changePercent: parseFloat(quoteData.percent_change || '0'),
            open: parseFloat(quoteData.open || '0'),
            high: parseFloat(quoteData.high || '0'),
            low: parseFloat(quoteData.low || '0'),
            volume: parseInt(quoteData.volume || '0'),
            lastUpdated: new Date().toLocaleString()
        };

        // Update cache
        cache.stocks[cacheKey] = {
            data: stockData,
            timestamp: Date.now()
        };

        return stockData;
    } catch (error) {
        console.error('Error fetching stock data:', error);
        throw new Error(`Failed to fetch stock data: ${error.message}`);
    }
};

// ---------------- CRYPTO FETCH (CoinGecko) ----------------
const fetchCrypto = async (name) => {
    const cacheKey = name.toLowerCase();
    
    // Check cache first
    if (isCacheValid('crypto', cacheKey)) {
        return cache.crypto[cacheKey].data;
    }

    try {
        // First, try to get the coin data directly
        const response = await fetch(`${COINGECKO_API_URL}/coins/${cacheKey}`);
        
        if (!response.ok) {
            // If direct fetch fails, try searching for the coin
            const searchResponse = await fetch(`${COINGECKO_API_URL}/search?query=${encodeURIComponent(cacheKey)}`);
            const searchData = await searchResponse.json();
            
            if (!searchData.coins || searchData.coins.length === 0) {
                throw new Error('Cryptocurrency not found');
            }
            
            // Use the first search result
            const coinId = searchData.coins[0].id;
            const coinResponse = await fetch(`${COINGECKO_API_URL}/coins/${coinId}`);
            
            if (!coinResponse.ok) {
                throw new Error('Failed to fetch cryptocurrency data');
            }
            
            const coinData = await coinResponse.json();
            return processCryptoData(coinData);
        }
        
        const coinData = await response.json();
        return processCryptoData(coinData);
        
    } catch (error) {
        console.error('Error fetching crypto data:', error);
        throw new Error(`Failed to fetch cryptocurrency data: ${error.message}`);
    }
};

// Helper function to process crypto data
const processCryptoData = (coinData) => {
    const marketData = coinData.market_data;
    const cryptoData = {
        id: coinData.id,
        symbol: coinData.symbol.toUpperCase(),
        name: coinData.name,
        price: marketData.current_price.usd,
        change24h: marketData.price_change_percentage_24h,
        high24h: marketData.high_24h.usd,
        low24h: marketData.low_24h.usd,
        marketCap: marketData.market_cap.usd,
        volume24h: marketData.total_volume.usd,
        lastUpdated: new Date(marketData.last_updated).toLocaleString()
    };
    
    // Update cache
    cache.crypto[cryptoData.id] = {
        data: cryptoData,
        timestamp: Date.now()
    };
    
    return cryptoData;
};

// Handle search
const handleSearch = async () => {
    const query = searchInput.value.trim();
    
    if (!query) {
        showError('Please enter a stock symbol or cryptocurrency name');
        return;
    }
    
    // Show loading state
    searchBtn.disabled = true;
    searchBtn.textContent = 'Loading...';
    
    // Clear previous error
    errorMessage.textContent = '';
    
    try {
        // Check if the active tab is stocks or crypto
        const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
        
        if (activeTab === 'stocks') {
            try {
                // Try to fetch stock data
                const stockData = await fetchStock(query);
                updateStockUI(stockData);
                await updateStockChart(stockData.symbol);
            } catch (stockError) {
                console.error('Stock search error:', stockError);
                throw new Error('Stock not found. Please check the symbol and try again.');
            }
        } else {
            try {
                // Try to fetch crypto data
                const cryptoData = await fetchCrypto(query);
                updateCryptoUI(cryptoData);
                await updateCryptoChart(cryptoData.id);
            } catch (cryptoError) {
                console.error('Crypto search error:', cryptoError);
                throw new Error('Cryptocurrency not found. Please check the name and try again.');
            }
        }
    } catch (error) {
        console.error('Search error:', error);
        showError('An error occurred. Please try again.');
    } finally {
        // Reset button state
        searchBtn.disabled = false;
        searchBtn.textContent = 'Search';
    }
};

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Initialize with Bitcoin data on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Show crypto tab by default
    document.querySelector('[data-tab="crypto"]').click();
    
    // Load Bitcoin data
    searchInput.value = 'bitcoin';
    await handleSearch();
});
