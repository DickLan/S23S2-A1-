const express = require('express')
const expressHandlebars = require('express-handlebars')
const port = 3000
const restaList = require('./restaurant.json').results
const app = express()

// ==================mongoose==========================
// mongoose
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurant')
const bodyParser = require('body-parser')
const restaurant = require('./models/restaurant')
// 限制只有在非正式環境 使用dotenv
app.use(bodyParser.urlencoded({ extended: true }))
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// 設定連線到mongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// 取得連線狀態
const db = mongoose.connection
db.on('error', () => {
  console.log('mongoDB error from db.on!')
})
db.once('open', () => {
  // console.log('mongoDB connected!')
  console.log('mongoDB connected!')
})



// 新建種子資料
// db.once('open', () => {
//   // console.log('mongoDB connected!')
//   for (let i = 0; i < 8; i++) {
//     // console.log(restaList[i].name)
//     Restaurant.create({
//       "id": restaList[i].id,
//       "name": restaList[i].name,
//       "name_en": restaList[i].name_en,
//       "category": restaList[i].category,
//       "image": restaList[i].image,
//       "location": restaList[i].location,
//       "phone": restaList[i].phone,
//       "google_map": restaList[i].google_map,
//       "rating": restaList[i].rating,
//       "description": restaList[i].description
//     })
//     // Restaurant.create({ name: `${restaList[i].name}`, })
//   }
//   console.log('mongoDB connected!')
// })



// ===============mongoose End==========================


// set template engine 設定樣版引擎
// 告訴app(exprees) 使用handlebars作為模板引擎 並設預設佈局為main
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }))
// 設定視圖引擎為 handlebars
app.set('view engine', 'handlebars')
// 設定靜態檔案 express才知道靜態檔案(html css js)放在哪
// 才能在handlebars裡面呼叫link&scripts
app.use(express.static('public'))

// index
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
  // res.render('index', ({ restaurants: restaList }))
  // console.log(restaurants)
})
// 點擊餐廳 跳出詳細說明
app.get('/restaurant/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant => res.render('detail', { restaurant })))
    .catch(error => console.log(error))
})

// app.get('/restaurants/:id', (req, res) => {
//   const restaurant = restaList.find(restaurant => {
//     // id是number 所以要tostring
//     return restaurant.id.toString() === req.params.id
//   })
//   res.render('show', ({ restaurant: restaurant }))
// })
// search
app.get('/search', (req, res) => {
  const restaurants = restaList.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(req.query.keyword.toLowerCase()) || restaurant.category.includes(req.query.keyword)
    // return a||b
    // 若沒a則return b
    // 寫法需注意 
  })

  console.log(restaurants)
  console.log(req.query.keyword)
  res.render('index', ({ restaurants: restaurants }))
})


// 
app.listen(port, () => {
  console.log(`it's listening on port ${3000} now!`)
})