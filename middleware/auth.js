module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) {
      console.log('Y')
      return next()
    }
    console.log('N')
    req.flash('warning_msg', '請先登入才可使用')
    res.redirect('/users/login')
  }
}
