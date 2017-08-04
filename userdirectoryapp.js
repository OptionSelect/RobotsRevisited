const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
const data = require('./data.js')

app.use(express.static('public'))
app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')

app.get('/index/', (req, res) => {
  res.render('index', data)
})

app.get('/user/:name', (req, res) => {
  function findPerson(person) {
    return person.name === req.params.name
  }
  var persons = data.users.find(findPerson)
  res.render('user', persons)
})

app.listen(3000, function() {
  console.log('Listening ft. Andre 3000')
})
