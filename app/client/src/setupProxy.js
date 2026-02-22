const { createProxyMiddleware } = require('http-proxy-middleware')
const fs = require('fs')
const path = require('path')

function getBackendPort() {
  // Check for .ports.env in project root (3 levels up from src/)
  const portsEnvPath = path.resolve(__dirname, '..', '..', '..', '.ports.env')
  if (fs.existsSync(portsEnvPath)) {
    const content = fs.readFileSync(portsEnvPath, 'utf-8')
    const match = content.match(/BACKEND_PORT=(\d+)/)
    if (match) return match[1]
  }
  return '8000'
}

module.exports = function (app) {
  const backendPort = getBackendPort()
  app.use(
    '/api',
    createProxyMiddleware({
      target: `http://localhost:${backendPort}`,
      changeOrigin: true,
    })
  )
}
