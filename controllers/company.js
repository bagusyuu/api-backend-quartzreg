const Company = require('../models').Company;
const Employee = require('../models').Employee;

var sequelize = require('sequelize');

module.exports = {
    list(req, res){
        var query = {};
        if(req.query.name){
            let lookupValue = req.query.name.toLowerCase();
            query.name = {};
            query.name = sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + lookupValue + '%')    
        } 
        console.log(query);
        
        return Company.findAll({
            // where : query,
        }).then(companies => {
            res.status(200).send(companies);
        }).catch(error => {
            res.status(400).send(error);
        });
    },
    detailByTDP(req,res){
        return Company.findOne({
            where: {
                tdp: req.params.tdp
            },
            include: [{
                model: Employee,
                attributes: ['id', 'user_id', 'company_id', 'employee_code', 'title', 'startat', 'endat', 'status'],
                as: 'employee'
            }]
        }).then(company => {
            if(!company){
                res.status(404).send({
                    message : "Company not Found"
                })
            }
            res.status(200).send(company);
        }).catch(error => {
            res.status(400).send(error);
        });
    },
    add(req, res){
        const params = {};
        params.name     = req.body.name;
        params.tdp      = req.body.tdp;
        params.email    = req.body.email;
        params.address  = req.body.address;
        params.createdAt = new Date();
        params.updatedAt = new Date();

        console.log(params);
        return Company.create(params).then(company => {
            res.status(201).send(company);
        }).catch(error => {
            res.status(400).send(error);
        });
    },
    updateByTDP(req, res){
        const params = {};
        params.name     = req.body.name;
        params.tdp      = req.body.tdp;
        params.email    = req.body.email;
        params.address  = req.body.address;
        params.updatedAt = new Date();

        console.log(params);
        return Company.findOne({
            where: {
                tdp: req.params.tdp
            }
        }).then(company => {
            if(!company){
                res.status(404).send({
                    message : "Company not Found"
                })
            }
            return company.update(params).then(() => {
                res.status(200).send(company);
            }).catch((error) =>{
                res.status(400).send(error);
            });
        }).catch(error => {
            res.status(400).send(error);
        });
    },
    deleteByTDP(req,res){
        return Company.findOne({
            where: {
                tdp: req.params.tdp
            }
        }).then(company => {
            if(!company){
                res.status(404).send({
                    message : "Company not Found"
                })
            }
            return company.destroy().then(() => {
                res.status(204).send({
                    message : "Company deleted!"
                });
            }).catch(error => {
                res.status(400).send(error);
            });
        }).catch(error => {
            res.status(400).send(error);
        });
    }
};