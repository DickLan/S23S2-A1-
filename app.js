const express = require('express')
const expressHandlebars = require('express-handlebars')
const app = express()
const port = 3000
const restaList = require('./restaurant.json').results
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
  res.render('index', ({ restaurants: restaList }))
})
// 點擊餐廳 跳出詳細說明
app.get('/restaurants/:id', (req, res) => {
  const restaurant = restaList.find(restaurant => {
    // id是number 所以要tostring
    return restaurant.id.toString() === req.params.id
  })
  res.render('show', ({ restaurant: restaurant }))
})
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