const express = require('express')
const app = express()
const expressValidator = require('express-validator')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const pgPromise = require('pg-promise')()
const db = pgPromise({ database: 'robots' })

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(expressValidator())
app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')

/* Database Creation/Structure
CREATE TABLE robots (“username” VARCHAR(100) NOT NULL);

ALTER TABLE robots ADD COLUMN ‘id’ SERIAL PRIMARY KEY;
ALTER TABLE robots ADD COLUMN “imagerurl” VARCHAR(100) NULL
ALTER TABLE robots ADD COLUMN “email” VARCHAR(100) NULL
ALTER TABLE robots ADD COLUMN “university” VARCHAR(100) NULL
ALTER TABLE robots ADD COLUMN “street_number” INTEGER(100) NULL
ALTER TABLE robots ADD COLUMN “address” VARCHAR(100) NULL
ALTER TABLE robots ADD COLUMN “city” VARCHAR(100) NULL
ALTER TABLE robots ADD COLUMN “state” VARCHAR(100) NULL
ALTER TABLE robots ADD COLUMN “job” VARCHAR(100) NULL
ALTER TABLE robots ADD COLUMN “company” VARCHAR(100) NULL
ALTER TABLE robots ADD COLUMN “postal_code” VARCHAR(15) NULL
ALTER TABLE robots ADD COLUMN “year_built” INTEGER(4) NULL
ALTER TABLE robots ADD COLUMN “next_service_date” INTEGER(100) NULL
ALTER TABLE robots ADD COLUMN “is_active” VARCHAR(100) NULL

*/

app.get('/', (req, res) => {
  db.any('SELECT * FROM "robots"').then(data => {
    res.render('index', { robots: data })
  })
})

app.get('/robots/:id', (req, res) => {
  const idFromParamsFromURL = parseInt(req.params.id)
  db
    .one('SELECT * FROM "robots" WHERE id = $(id)', { id: idFromParamsFromURL })
    .then(data => {
      res.render('user', data)
    })
    .catch(error => {
      res.render('newbot')
    })
})

app.post('/adduser/:id', (req, res) => {
  req.checkBody('username', 'Username cannot be blank').notEmpty()
  req.checkBody('email', 'Email cannot be blank').notEmpty().isEmail()
  req.checkBody('street_number', 'Street number cannot be blank and must be numeric').notEmpty().isNumeric()
  req.checkBody('address', 'Address cannot be blank').notEmpty()
  req.checkBody('city', 'City cannot be blank').notEmpty()
  req.checkBody('state', 'State cannot be blank').notEmpty()
  req.checkBody('postal_code', 'Postal code cannot be blank and must be numeric').notEmpty().isNumeric()
  req.checkBody('year_built', 'Year built cannot be blank and must be numeric').notEmpty().isNumeric()
  req.checkBody('next_service_date', 'Next service date cannot be blank').notEmpty()
  req.checkBody('is_active', 'Is active cannot be blank')

  var errors = req.validationErrors()
  if (errors) {
    res.render('newbot', { errors })
  } else {
    const newUser = {
      userName: req.body.username,
      imageUrl: req.body.imageurl || null,
      email: req.body.email,
      university: req.body.university || null,
      streetNumber: req.body.street_number,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      job: req.body.job || null,
      company: req.body.company || null,
      postalCode: req.body.postal_code,
      yearBuilt: req.body.year_built,
      nextServiceDate: req.body.next_service_date,
      isActive: req.body.is_active
    }

    db
      .one(
        `INSERT INTO "robots" ("username", "imageurl", "email", "university", "street_number", "address", "city", "state", "job", "company", "postal_code", "year_built", "next_service_date", "is_active") VALUES ($(userName), $(imageUrl), $(email), $(university), $(streetNumber), $(address), $(city), $(state), $(job), $(company), $(postalCode), $(yearBuilt), $(nextServiceDate), $(isActive)) RETURNING id`,
        newUser
      )
      .then(newUser => {
        res.redirect('/')
      })
      .catch(error => {
        console.log('Something went wrong.')
      })
  }
})

app.delete('/robots/:id', (req, res) => {
  const robotId = parseInt(req.params.id)
  db.result('DELETE FROM "robots" WHERE id = $(id)', { id: robotId }).then(data => {
    console.log('GOT EM: ' + data)
  })
})

app.listen(3000, function() {
  console.log('Listening ft. Andre 3000')
})
