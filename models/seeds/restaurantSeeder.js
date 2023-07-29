const Restaurant = require('../restaurant')
// 從上級目錄 被Restaurant.js匯出的Restaurant 載入 Restaurant model
// 取得資料庫連線狀態
const db = require('../../config/mongoose')

// 連線成功 另外 執行callback後就會解除監聽器
db.once('open', () => {
  console.log('mongodb connected!')
  for (let i = 0; i < 8; i++) {
    Restaurant.create({ name: `name-${i}` })
  }
  console.log('done.')
})
