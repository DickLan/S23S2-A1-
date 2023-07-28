const express = require('express')
const session = require('express-session')
const expressHandlebars = require('express-handlebars')
const port = 3000
const restaList = require('./restaurant.json').results
const app = express()
const methodOverride = require('method-override')
require('./config/mongoose')
// ==================mongoose==========================
// mongoose

const Restaurant = require('./models/restaurant')
const bodyParser = require('body-parser')
const restaurant = require('./models/restaurant')

// 引用routes
const routes = require('./routes')


// ！！！這裡的順序需注意 要先methodOverride 才use routes 這樣才能正確使用restAPI！！
// 限制只有在非正式環境 使用dotenv
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
// 將requset導入 當路徑設定為/routes 就會自動去尋找該目錄下 名為index的檔案
app.use(routes)




// ===============mongoose End==========================

// set template engine 設定樣版引擎
// 告訴app(exprees) 使用handlebars作為模板引擎 並設預設佈局為main
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }))
// 設定視圖引擎為 handlebars
app.set('view engine', 'handlebars')
// secret 是 session 用來驗證 session id 的字串 該字串由伺服器設定 不會洩漏給用戶端
app.use(session({
  secret: 'ThisIsResttaurantSecret',
  resave: false,
  saveUninitialized: true
}))

// 設定靜態檔案 express才知道靜態檔案(html css js)放在哪
// 才能在handlebars裡面呼叫link&scripts
app.use(express.static('public'))




// 
app.listen(port, () => {
  console.log(`it's listening on port ${3000} now!`)
})