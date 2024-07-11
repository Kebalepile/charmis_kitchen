import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})


// export default {
//   build: {
//     rollupOptions: {
//       output: {
//         manualChunks(id) {
//           // Specify manual chunks based on your code structure
//           if (id.includes('node_modules')) {
//             return 'vendor';
//           }
//         },
//       },
//     },
//   },
// };