const express = require('express')
const router = express.Router()

const Serie = require('../models/serie')

router.get('/', async (req, res) => {
  const series = await Serie.find({})
  res.send(series)
})
router.get('/:id', (req, res) => {
  res.send(req.params.id)
})

module.exports = router