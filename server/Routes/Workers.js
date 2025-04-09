const express = require('express')
const router = express.Router()
const worker = require('../Controllers/Workers')

router.post('/login',worker.login)
router.post('/addworker',worker.addworker)
router.get('/getallworkers',worker.allworkers)
router.get('/getaworker/:worktype',worker.oneworker)
router.put('/updateworker/:workerid',worker.updateworker)
router.delete('/deleteworker/:workerid',worker.deleteworker)
module.exports = router