const exprees = require('express')
const router = exprees.Router()
const Restaurant = require('../../models/restaurant')

// index
router.get('/', (req, res) => {
  const userId = req.user._id
  Restaurant.find({ userId })
    .lean()
    .sort({ _id: 'asc' })
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
  // res.render('index', ({ restaurants: restaList }))
  // console.log(restaurants)
})

module.exports = router
