import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        register: resolve(__dirname, 'register.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        create_request: resolve(__dirname, 'create-request.html'),
        request: resolve(__dirname, 'request.html'),
        admin: resolve(__dirname, 'admin.html')
      }
    }
  }
});
