// 定義restaurant的Schema

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const restaurantSchema = new Schema({
  id: {
    type: Number
  },
  userId: {
    // type&ref 是 mongoose提供的populate功能 方便建立不同collections 之間的聯繫
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    require: true
  },
  name: {
    type: String,
    require: true
  },
  name_en: {
    type: String
  },
  category: {
    type: String
  },
  image: {
    type: String
  },
  rating: {
    type: String
  },
  description: {
    type: String
  },
  phone: {
    type: String
  },
  location: {
    type: String
  },
  done: {
    type: Boolean
  }
})

// 匯出Restaurant模型 在別的文件就能用
// const Restaurant = require('./restaurant.js')來引入模型
module.exports = mongoose.model('Restaurant', restaurantSchema)
