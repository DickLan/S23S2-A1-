// 在index總路由中 控制要導向到modules裡的哪個js
// 由路由器分離到不同路由模組

const exprees = require('express')
const router = exprees.Router()
const home = require('./modules/home')
const restaurant = require('./modules/restaurant')
const users = require('./modules/users')

router.use('/restaurant', restaurant)
router.use('/users', users)
router.use('/', home)

module.exports = router