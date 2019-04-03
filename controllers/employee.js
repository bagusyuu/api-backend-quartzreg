const User = require('../models').User;
const Company = require('../models').Company;
const Employee = require('../models').Employee;

var sequelize = require('sequelize');
const Op = sequelize.Op;

module.exports = {
    list(req, res){
        const query = {};
        const queryUser = {};
        const queryCompany = {};
        query.status = 0;
        if(req.query){
            if(req.query.name){ //Find by Name
                let lookupValue = req.query.name.toLowerCase();
                queryUser.name = {};
                queryUser.name = sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + lookupValue + '%')    
            }
            if(req.query.company){ //Find by Company TDP
                queryCompany.tdp = {}
                queryCompany.tdp = req.query.company;
                query.status = 0;
            }
            if(req.query.employee_status == 'all'){ //Find by Status
                query.status = [0,1];
            }
            if(req.query.ktp){ //Find by KTP
                queryUser.ktp = req.query.ktp;
            }
        }
        // console.log(query);
        // console.log(queryCompany);
        
        return Employee.findAll({
            where : query,
            include: [{
                model: User,
                as: 'user',
                where : queryUser
            }, {
                model: Company,
                as: 'company',
                where : queryCompany
            }]
        }).then(employees => {
            res.status(200).send(employees);
        }).catch(error => {
            res.status(400).send(error);
        });
    },
    detailByID(req,res){
        return Employee.findOne({
            where: {
                id: req.params.id
            },
            include: [{
                model: User,
                as: 'user'
            }, {
                model: Company,
                as: 'company'
            }]
        }).then(employee => {
            if(!employee){
                res.status(404).send({
                    message : "Employee not Found"
                })
            }
            res.status(200).send(employee);
        }).catch(error => {
            res.status(400).send(error);
        });
    },
    add(req, res){
        const params = {};
        params.user_id      = req.body.user_id;
        params.company_id   = req.body.company_id;
        params.employee_code   = req.body.employee_code;
        params.title        = req.body.title;
        params.startat = new Date();
        params.createdAt = new Date();
        params.updatedAt = new Date();

        console.log(params);
        const user = User.count({where: {id: req.body.user_id}});
        const company = Company.count({where : {id : req.body.company_id}});
        return Promise.all([user, company]).then(results =>{
            console.log(results);
            if(results[0] == 0 || results[1] == 0){
                res.status(400).send({
                    message : "User/Company is not found, try another data!"
                });
            }
            return Employee.create(params).then(employee =>{
                res.status(201).send(employee);
            }).catch(error => {
                res.status(400).send(error);
            });
        }).catch(error => {
            res.status(400).send(error);
        });
    },
    updateByID(req, res){
        const params = {};
        // params.title     = req.body.title;
        params.endat     = new Date();
        params.updatedAt = new Date();
        params.status = 1;

        // console.log(params);
        return Employee.findOne({
            where: {
                id: req.params.id
            }
        }).then(employee => {
            // console.log(employee);
            if(!employee){
                res.status(404).send({
                    message : "Employee not Found"
                });
            }

            if(employee.title.toLowerCase() == req.body.title.toLowerCase()){ //nothing changes
                res.status(200).send(employee);
            } else {
                return employee.update(params).then(() =>{
                    const paramsNewRow = {};
                    paramsNewRow.user_id      = employee.user_id;
                    paramsNewRow.company_id   = employee.company_id;
                    paramsNewRow.employee_code   = employee.employee_code;
                    paramsNewRow.title      = req.body.title;
                    paramsNewRow.startat    = new Date();
                    paramsNewRow.createdAt = new Date();
                    paramsNewRow.updatedAt = new Date();

                    // console.log(paramsNewRow);

                    return Employee.create(paramsNewRow).then(employeeN => {
                        res.status(200).send(employeeN);
                    });
                }).catch((error) =>{
                    res.status(400).send(error);
                });
            }
        }).catch(error => {
            res.status(400).send(error);
        });
    },
    deleteByID(req,res){
        const params = {};
        params.endat     = new Date();
        params.updatedAt = new Date();
        params.status = 1;
        console.log(params);

        return Employee.findOne({
            where: {
                id: req.params.id
            }
        }).then(employee => {
            if(!employee){
                res.status(404).send({
                    message : "Employee not Found"
                });
            }
            return employee.update(params).then(() =>{
                res.status(204).send({
                    message : "Employee Deleted from Company!"
                });
            }).catch((error) =>{
                res.status(400).send(error);
            });
            
        }).catch(error => {
            res.status(400).send(error);
        });
    }
};