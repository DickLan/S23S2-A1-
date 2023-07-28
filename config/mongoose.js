const mongoose = require('mongoose')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// 設定連線到mongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
// 取得連線狀態
const db = mongoose.connection
db.on('error', () => {
  console.log('mongoDB error from db.on!')
})
db.once('open', () => {
  // console.log('mongoDB connected!')
  console.log('mongoDB connected678!')
})

module.exports = db