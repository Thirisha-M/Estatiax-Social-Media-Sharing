import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0', // Allow external devices
    port: 4200, // Your port
    strictPort: true, // Lock port 4200 only
    cors: true, // Enable CORS
    allowedHosts: ['.ngrok-free.app', 'localhost'], // Allow Ngrok Dynamic URLs
    proxy: {
      '/twitter-api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
