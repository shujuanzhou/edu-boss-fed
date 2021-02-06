const express = require('express')
const path = require('path')
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express()

// 托管了dist目录，当访问/的时候，默认会返回托管目录中的index.html文件
app.use(express.static(path.join(__dirname, '../dist')))

app.use('/front', createProxyMiddleware({ target: 'http://edufront.lagou.com', changeOrigin: true }));
app.use('/boss', createProxyMiddleware({ target: 'http://eduboss.lagou.com', changeOrigin: true }));

app.listen(3000, () => {
  console.log('running...')
})