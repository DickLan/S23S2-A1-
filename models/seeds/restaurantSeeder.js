const Restaurant = require('../restaurant')
// 從上級目錄 被Restaurant.js匯出的Restaurant 載入 Restaurant model
// 取得資料庫連線狀態
const db = require('../../config/mongoose')
const bcrypt = require('bcryptjs')
const resJson = require('../../restaurant.json')
const restaurantsFromJson = resJson.results

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const User = require('../user')
const SEED_USER = {
  name: 'root',
  email: '1@1',
  password: '1'
}

// 連線成功 另外 執行callback後就會解除監聽器
db.once('open', () => {
  // console.log(restaurantsFromJson)
  User.findOne({ email: SEED_USER.email })
    .then(user => {
      if (user) {
        console.log('seed existed.')
        process.exit()
      }
      bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(SEED_USER.password, salt))
        .then(hash => User.create({
          name: SEED_USER.name,
          email: SEED_USER.email,
          password: hash
        }))
        .then(user => {
          const userId = user._id
          // promise.all 在發出10筆'請求'後，會確保'完成'回收10筆回應後，才進入下一個then
          return Promise.all(Array.from(
            { length: 8 },
            // 第一個參數是可迭代物件 這裡用不到所以用＿
            (_, i) => Restaurant.create({
              name: `${restaurantsFromJson[i].name}`,
              name_en: `${restaurantsFromJson[i].name_en}`,
              category: `${restaurantsFromJson[i].category}`,
              image: `${restaurantsFromJson[i].image}`,
              location: `${restaurantsFromJson[i].location}`,
              rating: `${restaurantsFromJson[i].rating}`,
              description: `${restaurantsFromJson[i].description}`,
              phone: `${restaurantsFromJson[i].phone}`,

              userId
            })
          ))
        })
        .then(() => {
          console.log('created!')
          process.exit()
        })
    })


})
