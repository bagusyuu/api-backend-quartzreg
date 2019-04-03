const User = require('../models').User;
const Employee = require('../models').Employee;
const Company = require('../models').Company;
const Friendship = require('../models').Friendship;

var sequelize = require('sequelize');
const Op = sequelize.Op;

module.exports = {
    list(req, res){
        const query = {};
        if(req.query.name){
            let lookupValue = req.query.name.toLowerCase();
            query.name = {};
            query.name = sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + lookupValue + '%')    
        } 
        console.log(query);
        
        return User.findAll({
            where : query,
            include: [{
                model: Employee,
                attributes: ['id', 'user_id', 'company_id', 'employee_code', 'title', 'startat', 'endat', 'status'],
                as: 'employee'
            }]
        }).then(companies => {
            res.status(200).send(companies);
        }).catch(error => {
            res.status(400).send(error);
        });
    },
    detailByKTP(req,res){
        return User.findOne({
            where: {
                ktp: req.params.ktp
            },
            include: [{
                model: Employee,
                attributes: ['id', 'user_id', 'company_id', 'employee_code', 'title', 'startat', 'endat', 'status'],
                as: 'employee'
            }]
        }).then(user => {
            if(!user){
                res.status(404).send({
                    message : "User not Found"
                })
            }
            res.status(200).send(user);
        }).catch(error => {
            res.status(400).send(error);
        });
    },
    add(req, res){
        const params = {};
        params.name     = req.body.name;
        params.ktp      = req.body.ktp;
        params.email    = req.body.email;
        params.address  = req.body.address;
        params.phone    = req.body.phone;
        params.createdAt = new Date();
        params.updatedAt = new Date();

        // console.log(params);
        return User.create(params).then(user => {
            res.status(201).send(user);
        }).catch(error => {
            res.status(400).send(error);
        });
    },
    updateByKTP(req, res){
        const params = {};
        params.name     = req.body.name;
        params.ktp      = req.body.tdp;
        params.email    = req.body.email;
        params.address  = req.body.address;
        params.phone  = req.body.phone;
        params.updatedAt = new Date();

        console.log(params);
        return User.findOne({
            where: {
                ktp: req.params.ktp
            }
        }).then(user => {
            if(!user){
                res.status(404).send({
                    message : "User not Found"
                })
            }
            return user.update(params).then(() => {
                res.status(200).send(user);
            }).catch((error) =>{
                res.status(400).send(error);
            });
        }).catch(error => {
            res.status(400).send(error);
        });
    },
    deleteByKTP(req,res){
        return User.findOne({
            where: {
                ktp: req.params.ktp
            }
        }).then(user => {
            if(!user){
                res.status(404).send({
                    message : "User not Found"
                })
            }
            return user.destroy().then(() => {
                res.status(204).send({
                    message : "User deleted!"
                });
            }).catch(error => {
                res.status(400).send(error);
            });
        }).catch(error => {
            res.status(400).send(error);
        });
    },
    listFriends(req, res){
        return Friendship.findAll({
            include: [{
                model: User,
                as: 'user',
                where : {
                    ktp : req.params.ktp
                }
            }, {
                model: User,
                as: 'friend'
            }]
        }).then((friends) => {
            res.status(200).send(friends);
        }).catch(error => {
            res.status(400).send(error);
        });
    },
    addFriends(req, res){
        const arrayParams = [];

        const params1 = {};
        params1.user_id = req.body.user_id;
        params1.friend_id = req.body.friend_id;
        params1.createdAt = new Date();
        params1.updatedAt = new Date();
        arrayParams.push(params1);
        const params2 = {};
        params2.user_id = req.body.friend_id;
        params2.friend_id = req.body.user_id;
        params2.createdAt = new Date();
        params2.updatedAt = new Date();
        arrayParams.push(params2);

        //Checking the ID parameter
        const user = User.count({where: {id: req.body.user_id}});
        const friend = User.count({where: {id: req.body.user_id}});
        return Promise.all([user, friend]).then(results =>{
            // console.log(results);
            if(results[0] == 0 || results[1] == 0){
                res.status(400).send({
                    message : "User / Friend is not found, try another one!"
                });
            }
            return Friendship.count({where: {user_id : req.body.user_id, friend_id : req.body.friend_id} }).then(friend => {
                if(friend > 0){
                    res.status(400).send({
                        message : "User has been friended with this user"
                    });
                } else {
                    return Friendship.bulkCreate(arrayParams).then(results => {
                        res.status(200).send(results);
                    }).catch(error => {
                        res.status(400).send(error);
                    });
                }
            }).catch(error => {
                res.status(400).send(error);
            });
        }).catch(error => {
            res.status(400).send(error);
        });
    },
    removeFriends(req, res){
        // console.log(req.body);
        const user = Friendship.destroy({where: {user_id : req.body.user_id, friend_id : req.body.friend_id} });
        const friend = Friendship.destroy({where: {user_id : req.body.friend_id, friend_id : req.body.user_id} });
        return Promise.all([user, friend]).then(results =>{
            res.status(204).send(results);
        }).catch(error => {
            res.status(400).send(error);
        });
    },
    listHistory(req, res){
        return User.findOne({
            where : {
                ktp : req.params.ktp
            }, 
            include : [{
                model: Employee,
                attributes: ['id', 'user_id', 'company_id', 'employee_code', 'title', 'startat', 'endat', 'status'],
                as: 'employee',
                where : {
                    status : [0,1]
                }
            }]
        }).then(results =>{
            res.status(200).send(results);
        }).catch(error => {
            res.status(400).send(error);
        });
    },
    listWorkers(req,res){
        return User.findOne({
            where : {
                ktp : req.params.ktp
            }, 
            include : [{
                model: Employee,
                attributes: ['company_id'],
                as: 'employee',
                where : {
                    status : [0,1]
                }
            }]
        }).then(user =>{
            const arrayCompany = [];
            for(var i = 0; i < user.employee.length; i++){
                arrayCompany.push(user.employee[i].company_id);
            }
            // console.log(arrayCompany);
            return Employee.findAll({
                where : {
                    user_id :  {
                        [Op.ne] :  user.id
                    },
                    company_id : arrayCompany
                },
                include: [{
                    model: User,
                    as: 'user'
                }, {
                    model: Company,
                    as: 'company'
                }]
            }).then(employees =>{
                res.status(200).send(employees);
            }).catch(error => {
                res.status(400).send(error);
            });
        }).catch(error => {
            res.status(400).send(error);
        });
    },
    listMutualFriends(req, res){
        return User.findOne({
            where : {
                ktp : req.params.ktp
            }, 
            include: [{
                model: Friendship,
                as: 'friend'
            }]
        }).then(user =>{
            const arrayFriends = [];
            for(var i = 0; i < user.friend.length; i++){
                arrayFriends.push(user.friend[i].friend_id);
            }
            console.log(arrayFriends);
            return Friendship.findAll({
                where : {
                    user_id : arrayFriends,
                    friend_id : {
                        [Op.ne] :  user.id
                    }
                }
            }).then(friends =>{
                res.status(200).send(friends);
            }).catch(error => {
                res.status(400).send(error);
            });
        }).catch(error => {
            res.status(400).send(error);
        });
    }
};