import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// GitHub Pages는 https://seula0529.github.io/chillingMode.ON/ 아래에서 서비스되므로
// GitHub Actions에서 빌드할 때만 경로 앞에 저장소 이름을 붙입니다. (Vercel·로컬은 / 그대로)
export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/chillingMode.ON/' : '/',
  plugins: [vue()],
})
