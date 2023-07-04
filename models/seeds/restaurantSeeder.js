// 用來載入初始種子用的

const mongoose = require('mongoose')
const Restaurant = require('../restaurant') // 從上級目錄 被Restaurant.js匯出的Restaurant 載入 Restaurant model
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常檢測
db.on('error', () => {
  console.log('mongodb error666!')
})
// 連線成功 另外 執行callback後就會解除監聽器
db.once('open', () => {
  console.log('mongodb connected!')
  for (let i = 0; i < 8; i++) {
    Restaurant.create({ name: `name-${i}` })
  }
  console.log('done.')
})