const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')

router.get('/login', (req, res) => {
  res.render('login')
})


router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'

}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  console.log('123')
  // 取得註冊表單參數
  const { name, email, password, confirmPassword } = req.body
  // 檢查是否已經註冊
  User.findOne({ email }).then(user => {
    if (user) {
      console.log('User already existed.')
      res.render('register', {
        name, email, password, confirmPassword
      })
    } else {
      // 若還未註冊，則寫入資料庫
      // 從 User 產生一個實例instance
      const newUser = new User({
        name, email, password
      })
      newUser.save() // 將實例instance存入資料庫
        .then(() => res.redirect('/users/login'))
        .catch(err => console.log(err))
    }
  })

})


module.exports = router