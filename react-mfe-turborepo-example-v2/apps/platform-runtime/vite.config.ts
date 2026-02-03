import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "es2022",
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      input: {
        react: "src/runtime/react.ts",
        reactDom: "src/runtime/react-dom.ts",
        reactDomClient: "src/runtime/react-dom-client.ts",
        jsxRuntime: "src/runtime/react-jsx-runtime.ts",
        importmap: "src/importmaps/react.importmap.json"
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === "importmap") return "importmaps/react.importmap.json";
          const map: Record<string,string> = {
            react: "runtime/react.js",
            reactDom: "runtime/react-dom.js",
            reactDomClient: "runtime/react-dom-client.js",
            jsxRuntime: "runtime/react-jsx-runtime.js"
          };
          return map[chunk.name] ?? "runtime/[name].js";
        },
        chunkFileNames: "runtime/chunks/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]"
      }
    }
  }
});
