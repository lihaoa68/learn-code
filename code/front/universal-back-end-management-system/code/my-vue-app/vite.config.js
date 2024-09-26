import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  //resolve的alias给@取别名替代为/src 
  resolve:{
    alias:[{
      find:"@",
      replacement:"/src",
    }]
  }
})
