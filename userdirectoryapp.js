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
  const newuser = {
    username: req.body.username,
    address: req.body.address,
    job: req.body.job,
    company: req.body.company,
    email: req.body.email,
    university: req.body.university
  }

  db
    .one(
      `INSERT INTO "robots" ("username", "address", "job", "company", "email", "university") VALUES($(username), $(address), $(job), $(company), $(email), $(university))
      RETURNING id`,
      newuser
    )
    .then(newuser => {
      res.redirect('/')
    })
})

app.delete('/robots/:id', (req, res) => {
  const robotId = parseInt(req.params.id)
  db.result('DELETE FROM "robots" WHERE id = $(id)', { id: robotId }).then(data => {
    console.log('GOT EM: ' + data)
  })
  res.redirect('/')
})

app.listen(3000, function() {
  console.log('Listening ft. Andre 3000')
})
