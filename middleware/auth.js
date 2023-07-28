module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) {
      console.log('Y')
      return next()
    }
    console.log('N')
    res.redirect('/users/login')
  }
}