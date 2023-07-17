const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')



// add
// note:add必須放在get:id之前 避免走入錯誤路由
router.get('/add', (req, res) => {
  return res.render('add')
})
router.post('/add', (req, res) => {
  const name = req.body.name
  return Restaurant.create({ name })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 點擊餐廳 跳出詳細說明 detail
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant => res.render('detail', { restaurant })))
    .catch(error => console.log(error))
})
// edit get
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant => res.render('edit', { restaurant })))
    .catch(error => console.log(error))
})
// edit put
router.put('/:id', (req, res) => {
  const id = req.params.id
  const name = req.body.name
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = name
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurant/${id}`))
    .catch(error => console.log(error))
})
// delete
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})




// search
router.get('/search', (req, res) => {
  const restaurants = restaList.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(req.query.keyword.toLowerCase()) || restaurant.category.includes(req.query.keyword)
    // return a||b
    // 若沒a則return b
    // 寫法需注意 
  })

  console.log(restaurants)
  console.log(req.query.keyword)
  res.render('index', ({ restaurants: restaurants }))
})



module.exports = router