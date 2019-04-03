let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
var assert = require('chai').assert;
let expect = require('chai').expect;

const sequlize = require('../config/connector');

chai.use(chaiHttp);
describe('User', function() {
    beforeEach((done) => {
        sequlize.query('truncate table "Employees" cascade; truncate table "Companies" cascade; truncate table "Users" cascade; truncate table "Friendships" cascade', {raw: true}).then(results => {
            done();
        });
    });

    describe('/GET user friends', () => {
        it('it should GET all the user friends  ', (done) => {
            
            let queryUser = sequlize.query('insert into "Users" (ktp, name, email, address, phone, "createdAt", "updatedAt") values ( \'1000001\', \'user test\', \'user@test.com\', \'jl. test\',\' 91091091\', current_date, current_date)', {raw: true});
            let queryUser2 = sequlize.query('insert into "Users" (ktp, name, email, address, phone, "createdAt", "updatedAt") values ( \'1000002\', \'user test2\', \'user2@test.com\', \'jl. test2\',\' 91091092\', current_date, current_date)', {raw: true});
            let queryUserFind = sequlize.query('select * from "Users"', {raw: true});

            Promise.all([queryUser, queryUser2, queryUserFind]).then(results => {
                let queryFriendship1 = sequlize.query('insert into "Friendships" (user_id, friend_id, "createdAt", "updatedAt") values ( '+results[2][0][0].id+', '+results[2][0][1].id+',current_date, current_date); ', {raw: true});
                let queryFriendship2 = sequlize.query('insert into "Friendships" (user_id, friend_id, "createdAt", "updatedAt") values ( '+results[2][0][1].id+', '+results[2][0][0].id+',current_date, current_date); ', {raw: true});

                Promise.all([queryFriendship1, queryFriendship2]).then(results2 => {
                    // console.log(results2);
                    chai.request(server) 
                    .get('/api/v1/user/1000001/friends')
                    .end((err, res)=> {
                        // console.log(res.body);
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        // expect(res.body.employee).to.have.length.above(1);
                        done();
                    });
                });
            });
        });
    });

    describe('/POST user friends', () => {
        it('it should POST add friends  ', (done) => {
            
            let queryUser = sequlize.query('insert into "Users" (ktp, name, email, address, phone, "createdAt", "updatedAt") values ( \'1000001\', \'user test\', \'user@test.com\', \'jl. test\',\' 91091091\', current_date, current_date)', {raw: true});
            let queryUser2 = sequlize.query('insert into "Users" (ktp, name, email, address, phone, "createdAt", "updatedAt") values ( \'1000002\', \'user test2\', \'user2@test.com\', \'jl. test2\',\' 91091092\', current_date, current_date)', {raw: true});
            let queryUserFind = sequlize.query('select * from "Users"', {raw: true});

            Promise.all([queryUser, queryUser2, queryUserFind]).then(results => {
                let friendship = {
                    user_id : results[2][0][0].id,
                    friend_id : results[2][0][1].id
                }
                console.log(friendship);
                chai.request(server) 
                    .post('/api/v1/user/1000001/friends')
                    .send(friendship)
                    .end((err, res)=> {
                        console.log(res.body);
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        expect(res.body).to.have.length.above(1);
                        done();
                    });
            });
        });
    });
    
    describe('/DELETE user friends', () => {
        it('it should DELETE friends  ', (done) => {
            
            let queryUser = sequlize.query('insert into "Users" (ktp, name, email, address, phone, "createdAt", "updatedAt") values ( \'1000001\', \'user test\', \'user@test.com\', \'jl. test\',\' 91091091\', current_date, current_date)', {raw: true});
            let queryUser2 = sequlize.query('insert into "Users" (ktp, name, email, address, phone, "createdAt", "updatedAt") values ( \'1000002\', \'user test2\', \'user2@test.com\', \'jl. test2\',\' 91091092\', current_date, current_date)', {raw: true});
            let queryUserFind = sequlize.query('select * from "Users"', {raw: true});

            Promise.all([queryUser, queryUser2, queryUserFind]).then(results => {
                // console.log(results);
                let friendship = {
                    user_id : results[2][0][0].id,
                    friend_id : results[2][0][1].id
                }
                console.log(friendship);
                let queryFriendship1 = sequlize.query('insert into "Friendships" (user_id, friend_id, "createdAt", "updatedAt") values ( '+results[2][0][0].id+', '+results[2][0][1].id+',current_date, current_date); ', {raw: true});
                let queryFriendship2 = sequlize.query('insert into "Friendships" (user_id, friend_id, "createdAt", "updatedAt") values ( '+results[2][0][1].id+', '+results[2][0][0].id+',current_date, current_date); ', {raw: true});

                Promise.all([queryFriendship1, queryFriendship2]).then(results2 => {
                    console.log(results2);
                    chai.request(server) 
                    .delete('/api/v1/user/1000001/friends')
                    .send(friendship)
                    .end((err, res)=> {
                        // console.log(res.body);
                        res.should.have.status(204);
                        res.body.should.be.a('object');
                        // expect(res.body).to.have.length.above(1);
                        done();
                    });
                });
                
            });
        });
    });

    describe('/GET user mutual friends', () => {
        it('it should GET all the user mutual friends  ', (done) => {
            
            let queryUser = sequlize.query('insert into "Users" (ktp, name, email, address, phone, "createdAt", "updatedAt") values ( \'1000000\', \'user test\', \'user@test.com\', \'jl. test\',\'91091090\', current_date, current_date)', {raw: true});
            let queryUser1 = sequlize.query('insert into "Users" (ktp, name, email, address, phone, "createdAt", "updatedAt") values ( \'1000001\', \'user test1\', \'user1@test.com\', \'jl. test1\',\'91091091\', current_date, current_date)', {raw: true});
            let queryUser2 = sequlize.query('insert into "Users" (ktp, name, email, address, phone, "createdAt", "updatedAt") values ( \'1000002\', \'user test2\', \'user2@test.com\', \'jl. test2\',\'91091092\', current_date, current_date)', {raw: true});
            let queryUserFind = sequlize.query('select * from "Users"', {raw: true});

            Promise.all([queryUser, queryUser1, queryUser2, queryUserFind]).then(results => {
                // console.log(results[3][0]);
                
                let queryFriendship1 = sequlize.query('insert into "Friendships" (user_id, friend_id, "createdAt", "updatedAt") values ( '+results[3][0][0].id+', '+results[3][0][1].id+',current_date, current_date); ', {raw: true});
                let queryFriendship2 = sequlize.query('insert into "Friendships" (user_id, friend_id, "createdAt", "updatedAt") values ( '+results[3][0][1].id+', '+results[3][0][2].id+',current_date, current_date); ', {raw: true});

                Promise.all([queryFriendship1, queryFriendship2]).then(results2 => {
                    // console.log(results2);
                    chai.request(server) 
                    .get('/api/v1/user/1000000/mutual')
                    .end((err, res)=> {
                        console.log(res.body);
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        expect(res.body).to.have.length.above(0);
                       done();
                    });
                });
            });
        });
    });

    describe('/GET user workers', () => {
        it('it should GET all Employee Workers  ', (done) => {
            
            let queryUser = sequlize.query('insert into "Users" (ktp, name, email, address, phone, "createdAt", "updatedAt") values ( \'1000001\', \'user test\', \'user@test.com\', \'jl. test\',\' 91091091\', current_date, current_date)', {raw: true});
            let queryUser2 = sequlize.query('insert into "Users" (ktp, name, email, address, phone, "createdAt", "updatedAt") values ( \'1000002\', \'user test2\', \'user2@test.com\', \'jl. test2\',\' 91091092\', current_date, current_date)', {raw: true});
            let queryCompany = sequlize.query('insert into "Companies" (tdp, name, email, address, "createdAt", "updatedAt") values ( \'999\', \'pt. auto insert\', \'auto@insert.com\', \'jl. auto1\', current_date, current_date)', {raw: true});
            let queryUserandCompany = sequlize.query('select a.id as user_id, b.id as company_id from "Users" as a, "Companies" as b; ', {raw: true});

            Promise.all([queryUser, queryUser2, queryCompany, queryUserandCompany]).then(results => {
                console.log(results[3][0]);
                let queryEmployee1 = sequlize.query('insert into "Employees" (user_id, company_id, employee_code, title, startat, "createdAt", "updatedAt") values ( '+results[3][0][0].user_id+', '+results[3][0][0].company_id+', \'100001\', \'manager\',current_date,current_date, current_date); ', {raw: true});
                let queryEmployee2 = sequlize.query('insert into "Employees" (user_id, company_id, employee_code, title, startat, "createdAt", "updatedAt") values ( '+results[3][0][1].user_id+', '+results[3][0][1].company_id+', \'100002\', \'sr. manager\',current_date,current_date, current_date); ', {raw: true});
                Promise.all([queryEmployee1, queryEmployee2]).then(results2 => {
                    // console.log(results2);
                    chai.request(server) 
                    .get('/api/v1/user/1000001/workers')
                    .end((err, res)=> {
                        console.log(res.body);
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        expect(res.body).to.have.length.above(0);
                        done();
                    });
                });
            });
        });
    });
});