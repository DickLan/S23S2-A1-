const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const { use } = require('../routes')

module.exports = app => {
  // 初始化 passport 模組
  app.use(passport.initialize())
  app.use(passport.session())
  // 設定本地登入策略
  // nameField的值是'字串'
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    // 這裡是檢查是否符合db內的使用者資訊 若符合 就用done將user資料交給req 以供後續使用
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'The email is not registered.' })
        }
        return bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch) {
            return done(null, false, { message: 'Email or Password incorrect.' })
          }
          return done(null, user)
        })
      })
      .catch(err => done(err, false))
  }))

  // 設定 Google 驗證
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK,
    // profileField: ['displayName'] //這個設定是和 google 要求開放的資料 但不寫也沒差 不知道為啥
  },
    function (accessToken, refreshToken, profile, done) {
      // auth.js scope內寫了email displayName 所以這裡的profile就會輸出這些項目
      // console.log(profile._json);
      const { name, email } = profile._json
      User.findOne({ email })
        .then(user => {
          if (user) return done(null, user)
          const randomPassrod = Math.random().toString(36).slice(-8)
          bcrypt
            .genSalt(10)
            .then(salt => bcrypt.hash(randomPassrod, salt))
            .then(hash => User.create({
              name,
              email,
              password: hash
            }))
            .then(user => done(null, user))
            .catch(err => done(err, false))
        })
    }
  ));



  // 設定序列化與反序列化 以節省 session 空間
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}

// done 是 passport.js 自行設計的一個溝通介面
// 用來控制成功和失敗的流程
// 流程：
// 查詢 DB → 程式運作正常 → 回傳查找的結果 user → done(null, user)
// 查詢 DB → 程式運作錯誤 → 回傳錯誤 → done(err, null)
// done(錯誤訊息,用戶物件,額外客製化訊息)
// 程式運作錯誤done(err) 驗證失敗done(null,false) 驗證成功done(null,user)
