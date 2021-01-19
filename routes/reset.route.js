const express = require('express');
const logManager = require('../managers/log.manager');
const router = express.Router();

const visitBll = require('./../business_logic/visit.bll');

router.get('/', (req,res)=>{
  visitBll.resetVisits((e)=>{
      if(e){
          logManager.logSync('Could not reset database (Cluster is on). Please try again in a few minutes.');
          res.status(500).send();
      }else{
          logManager.logSync('Resetting database...');
          res.status(200).send();
      }
  })  
})

module.exports = router;