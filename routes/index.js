var express = require('express');
var router = express.Router();

const companyController = require('../controllers').company;
const userController = require('../controllers').user;
const employeeController = require('../controllers').employee;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//company
router.get('/api/v1/company', companyController.list);
router.get('/api/v1/company/:tdp', companyController.detailByTDP);
router.post('/api/v1/company', companyController.add);
router.put('/api/v1/company/:tdp', companyController.updateByTDP);
router.patch('/api/v1/company/:tdp', companyController.updateByTDP);
router.delete('/api/v1/company/:tdp', companyController.deleteByTDP);

//user
router.get('/api/v1/user', userController.list);
router.get('/api/v1/user/:ktp', userController.detailByKTP);
router.post('/api/v1/user', userController.add);
router.put('/api/v1/user/:ktp', userController.updateByKTP);
router.patch('/api/v1/user/:ktp', userController.updateByKTP);
router.delete('/api/v1/user/:ktp', userController.deleteByKTP);
router.get('/api/v1/user/:ktp/friends', userController.listFriends);
router.post('/api/v1/user/:ktp/friends', userController.addFriends);
router.delete('/api/v1/user/:ktp/friends', userController.removeFriends);
router.get('/api/v1/user/:ktp/history', userController.listHistory);
router.get('/api/v1/user/:ktp/workers', userController.listWorkers);
router.get('/api/v1/user/:ktp/mutual', userController.listMutualFriends);

//employee
router.get('/api/v1/employee', employeeController.list);
router.get('/api/v1/employee/:id', employeeController.detailByID);
router.post('/api/v1/employee', employeeController.add);
router.put('/api/v1/employee/:id', employeeController.updateByID);
router.patch('/api/v1/employee/:id', employeeController.updateByID);
router.delete('/api/v1/employee/:id', employeeController.deleteByID);

module.exports = router;
