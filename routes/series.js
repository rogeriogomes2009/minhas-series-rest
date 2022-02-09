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

const jwt = require('jsonwebtoken')
const jwtSecret = 'abc123abc123abc123abc123'

router.use(async (req, res, next) => {
  const token = req.headers[ 'x-access-token'] || req.body.token || req.query.token
  if(token){
      try{
        const payload = jwt.verify(token, jwtSecret)
      console.log(payload)
      if(payload.roles.indexOf('restrito')>=0){
        next()
      }else{
        res.send({success: false})
      }
      }catch(e){
        res.send({success: false})
      }
}else{
  res.send({ success: false })
}
})

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