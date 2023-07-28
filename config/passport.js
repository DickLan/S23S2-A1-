const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

module.exports = app => {
  // 初始化 passport 模組
  app.use(passport.initialize())
  app.use(passport.session())
  // 設定本地登入策略
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    // 這裡是檢查是否符合db內的使用者資訊 若符合 就用done將user資料交給req 以供後續使用
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'The email is not registered.' })
        }
        if (user.password !== password) {
          return done(null, false, { message: 'Email or Pw incorrect.' })
        }
        return done(null, user)
      })
      .catch(err => done(err, false))
  }))
  // 設定序列化與反序列化 以節省 session 空間
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean
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