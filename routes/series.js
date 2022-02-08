/*
Se fizer GET em /series ==> retorna todas as séries
Se fizer POST em /series ==> crio uma nova série
Se fizer GET em /series/id ==> retorna uma série por id
Se fizer DELETE em /series/id ==> removo uma série por id
Se fizer PUT em /series/id ==> altero uma série por id

USANDO EXTENSÃO DO GOOGLE (POSTMAN)
*/

const express = require('express')
const router = express.Router()

const Serie = require('../models/serie')

router.get('/', async (req, res) => {
  const series = await Serie.find({})
  res.send(series)
})
router.post('/', async (req, res) => {
 const serie = new Serie (req.body)
  try{
    await serie.save()
    res.send(serie)
  }catch(e){
 
  res.send({
      success: false,
      errors: Object.keys(e.errors)
  })
}})

router.delete('/:id', async (req, res) => {
  await Serie.remove({ _id: req.params.id})
  res.send({
    success: true
  })
})
router.get('/:id', async (req, res) => {
  const serie = await Serie.findOne({ _id: req.params.id })
  res.send(serie)
})
router.put('/:id', async (req, res) => {
  const serie = await Serie.findOne({ _id: req.params.id})
  serie.name = req.body.name
  serie.status = req.body.status
  try{
    await serie.save()
    res.send(serie)
  }catch(e){
   res.send({
        success: false,
        errors: Object.keys(e.errors)
    })
  }
})
module.exports = router