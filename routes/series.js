const express = require('express')
const router = express.Router()

const series = [
  { name: 'Friends' },
  { name: 'Deixados para trás'},
  { name: 'Os Dez Mandamentos'}
]

router.get('/', (req, res) => {
  res.send(series)
})
router.get('/:id', (req, res) => {
  res.send(req.params.id)
})

module.exports = router