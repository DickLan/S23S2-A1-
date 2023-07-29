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

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '您已成功登出')
  res.redirect('/users/login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  // console.log('123')
  // 取得註冊表單參數
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '所有欄位都是必填' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不符' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }

  // 檢查是否已經註冊
  User.findOne({ email }).then(user => {
    if (user) {
      errors.push({ message: 'User already existed.' })
      res.render('register', {
        errors, name, email, password, confirmPassword
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
