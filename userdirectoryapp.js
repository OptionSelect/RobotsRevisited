const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
// const data = require('./data.js')
const pgPromise = require('pg-promise')()
const db = pgPromise({ database: 'robots' })

app.use(express.static('public'))
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
ALTER TABLE robots ADD COLUMN “is_active” VARCHAR(100) NOT NULL

*/

app.get('/', (req, res) => {
  db.any('SELECT * FROM "robots"').then(data => {
    console.log(data)
    res.render('index', { robots: data })
  })
})

app.get('/robots/:id', (req, res) => {
  const idFromParamsFromURL = parseInt(req.params.id)
  db.one('SELECT * FROM "robots" WHERE id = $(id)', { id: idFromParamsFromURL }).then(data => {
    res.render('user', data)
  })
})

app.listen(3000, function() {
  console.log('Listening ft. Andre 3000')
})
