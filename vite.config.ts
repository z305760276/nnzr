import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

let isBuild = false

function fileProtocolPlugin(): Plugin {
  return {
    name: 'file-protocol',
    enforce: 'post',
    config(_userConfig, { command }) {
      if (command === 'build') {
        isBuild = true
        return {
          build: {
            modulePreload: false,
          },
        }
      }
    },
    transformIndexHtml(html: string) {
      if (!isBuild) return html
      return html
        .replace(
          /<script type="module"[^>]*src="([^"]*)"[^>]*><\/script>/g,
          '<script src="$1" defer></script>'
        )
        .replace(
          /<link rel="modulepreload"[^>]*>/g,
          ''
        )
        .replace(
          /<link rel="stylesheet"[^>]*crossorigin[^>]*href="([^"]*)"[^>]*>/g,
          '<link rel="stylesheet" href="$1">'
        )
    },
  }
}

export default defineConfig({
  base: './',
  plugins: [inspectAttr(), react(), fileProtocolPlugin()],
  server: {
    port: 3000,
  },
  build: {
    target: 'es2015',
    cssMinify: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
