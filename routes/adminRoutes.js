const express = require('express');
const auth = require('../middleware/authAdmin');
const { problemCreation, problemList, problemDisplay, updateProblem, deleteProblem } = require('../controller/admin/problemController');
const { addTestcase, getTestcase } = require('../controller/admin/testcaseController');

const router = express.Router();
 

router.post('/problems',auth,problemCreation);         //to create problem and store it in Database
router.get('/problems',auth,problemList);              //to get list of all the problems
router.get('/problems/:id',auth,problemDisplay);       //to get details of specific problem
router.put('/problems/:id',auth,updateProblem);        //to update problem details
router.delete('/problems/:id',auth,deleteProblem);     //to delete problem from sphere-Engine and Database


router.post('/testcase',auth,addTestcase);             //to create test case for specific problems
router.get('/testcase/:id',auth,getTestcase);          //to get list of all the test case for specific problems

module.exports = router;