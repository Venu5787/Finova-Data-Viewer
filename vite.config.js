import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    server: {
      port: 3000,
      open: true,
      proxy: {
        // Proxy for CoinGecko API
        '/coingecko': {
          target: 'https://api.coingecko.com/api/v3',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/coingecko/, ''),
          secure: false
        },
        // Proxy for Twelve Data API
        '/twelvedata': {
          target: 'https://api.twelvedata.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/twelvedata/, ''),
          secure: false
        }
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true
    }
  };
});
