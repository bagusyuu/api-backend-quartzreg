let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
var assert = require('chai').assert;
let expect = require('chai').expect;

let Company = require('../models/company')

const sequlize = require('../config/connector');

chai.use(chaiHttp);
describe('Employee', function() {
    beforeEach((done) => {
        sequlize.query('truncate table "Employees" cascade; truncate table "Companies" cascade; truncate table "Users" cascade;', {raw: true}).then(results => {
            done();
        });
    });


    describe('/GET Employee', () => {
        it('it should GET all the Employee   ', (done) => {
            chai.request(server)
                .get('/api/v1/employee')
                .end((err, res)=> {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });
    
    describe('/POST Employee', () => {
        it('it should NOT add company', (done) => {
            let queryUser = sequlize.query('insert into "Users" (ktp, name, email, address, phone, "createdAt", "updatedAt") values ( \'1000001\', \'user test\', \'user@test.com\', \'jl. test\',\' 91091091\',    current_date, current_date)', {raw: true});
            let queryCompany = sequlize.query('insert into "Companies" (tdp, name, email, address, "createdAt", "updatedAt") values ( \'999\', \'pt. auto insert\', \'auto@insert.com\', \'jl. auto1\', current_date, current_date)', {raw: true});
            let queryUserandCompany = sequlize.query('select a.id as user_id, b.id as company_id from "Users" as a, "Companies" as b; ', {raw: true});

            Promise.all([queryUser, queryCompany, queryUserandCompany]).then(results => {
                let employee = {
                    // title : "manager"
                    user_id : results[2].user_id,
                    employee_id : results[2].employee_id,
                    employee_code : '10001'
                }
                chai.request(server)
                .post('/api/v1/employee')
                .send(employee)
                .end((err, res)=> {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    done();
                });
            });

            
        });

        it('it should add company   ', (done) => {
            let queryUser = sequlize.query('insert into "Users" (ktp, name, email, address, phone, "createdAt", "updatedAt") values ( \'1000001\', \'user test\', \'user@test.com\', \'jl. test\',\' 91091091\',    current_date, current_date)', {raw: true});
            let queryCompany = sequlize.query('insert into "Companies" (tdp, name, email, address, "createdAt", "updatedAt") values ( \'999\', \'pt. auto insert\', \'auto@insert.com\', \'jl. auto1\', current_date, current_date)', {raw: true});
            let queryUserandCompany = sequlize.query('select a.id as user_id, b.id as company_id from "Users" as a, "Companies" as b; ', {raw: true});

            Promise.all([queryUser, queryCompany, queryUserandCompany]).then(results => {
                var test = results[2][0][0].user_id;
                let employee = {
                    title : "manager",
                    user_id : results[2][0][0].user_id,
                    company_id : results[2][0][0].company_id,
                    employee_code : '10001'
                }

                chai.request(server)
                    .post('/api/v1/employee')
                    .send(employee)
                    .end((err, res)=> {
                        res.should.have.status(201);
                        res.body.should.be.a('object');
                        res.body.should.have.property('title').eql("manager");
                        res.body.should.have.property('employee_code').eql('10001');
                        done();
                    });
            });
        });
    });

    describe('/GET/:tdp get detail employee', () => {
        it('it should GET a employee by the given id', (done) => {
            let queryUser = sequlize.query('insert into "Users" (ktp, name, email, address, phone, "createdAt", "updatedAt") values ( \'1000001\', \'user test\', \'user@test.com\', \'jl. test\',\' 91091091\',    current_date, current_date)', {raw: true});
            let queryCompany = sequlize.query('insert into "Companies" (tdp, name, email, address, "createdAt", "updatedAt") values ( \'999\', \'pt. auto insert\', \'auto@insert.com\', \'jl. auto1\', current_date, current_date)', {raw: true});
            let queryUserandCompany = sequlize.query('select a.id as user_id, b.id as company_id from "Users" as a, "Companies" as b; ', {raw: true});

            Promise.all([queryUser, queryCompany, queryUserandCompany]).then(results => {
                sequlize.query('insert into "Employees" (user_id, company_id, employee_code, title, startat, "createdAt", "updatedAt") values ( '+results[2][0][0].user_id+', '+results[2][0][0].company_id+', \'100001\', \'manager\',current_date,current_date, current_date); select * from "Employees" where user_id = '+results[2][0][0].user_id+' and company_id = '+results[2][0][0].company_id, {raw: true}).then(row => {
                    console.log(row[0][0]);
                    chai.request(server)
                    .get('/api/v1/employee/'+row[0][0].id)
                    .end((err, res)=> {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('title');
                        res.body.should.have.property('startat');
                        done();
                    });
                });
            });
        });
    });

    describe('/PATCH/:tdp update detail employee', () => {
        it('it should PATCH an Employee by the given id', (done) => {
            let queryUser = sequlize.query('insert into "Users" (ktp, name, email, address, phone, "createdAt", "updatedAt") values ( \'1000001\', \'user test\', \'user@test.com\', \'jl. test\',\' 91091091\',    current_date, current_date)', {raw: true});
            let queryCompany = sequlize.query('insert into "Companies" (tdp, name, email, address, "createdAt", "updatedAt") values ( \'999\', \'pt. auto insert\', \'auto@insert.com\', \'jl. auto1\', current_date, current_date)', {raw: true});
            let queryUserandCompany = sequlize.query('select a.id as user_id, b.id as company_id from "Users" as a, "Companies" as b; ', {raw: true});

            Promise.all([queryUser, queryCompany, queryUserandCompany]).then(results => {
                sequlize.query('insert into "Employees" (user_id, company_id, employee_code, title, startat, "createdAt", "updatedAt") values ( '+results[2][0][0].user_id+', '+results[2][0][0].company_id+', \'100001\', \'manager\',current_date,current_date, current_date); select * from "Employees" where user_id = '+results[2][0][0].user_id+' and company_id = '+results[2][0][0].company_id, {raw: true}).then(row => {
                    let employee = {
                        title : "senior manager"
                    }
                    chai.request(server)
                    .patch('/api/v1/employee/'+row[0][0].id)
                    .send(employee)
                    .end((err, res)=> {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('title').eql("senior manager");
                        done();
                    });
                });
            });
        });
    });

    describe('/DELETE/:tdp delete detail employee', () => {
        it('it should DELETE a employee by the given tdp', (done) => {
            let queryUser = sequlize.query('insert into "Users" (ktp, name, email, address, phone, "createdAt", "updatedAt") values ( \'1000001\', \'user test\', \'user@test.com\', \'jl. test\',\' 91091091\',    current_date, current_date)', {raw: true});
            let queryCompany = sequlize.query('insert into "Companies" (tdp, name, email, address, "createdAt", "updatedAt") values ( \'999\', \'pt. auto insert\', \'auto@insert.com\', \'jl. auto1\', current_date, current_date)', {raw: true});
            let queryUserandCompany = sequlize.query('select a.id as user_id, b.id as company_id from "Users" as a, "Companies" as b; ', {raw: true});

            Promise.all([queryUser, queryCompany, queryUserandCompany]).then(results => {
                sequlize.query('insert into "Employees" (user_id, company_id, employee_code, title, startat, "createdAt", "updatedAt") values ( '+results[2][0][0].user_id+', '+results[2][0][0].company_id+', \'100001\', \'manager\',current_date,current_date, current_date); select * from "Employees" where user_id = '+results[2][0][0].user_id+' and company_id = '+results[2][0][0].company_id, {raw: true}).then(row => {
                    chai.request(server)
                    .delete('/api/v1/employee/'+row[0][0].id)
                    .end((err, res)=> {
                        res.should.have.status(204);
                        res.body.should.be.a('object');
                        done();
                    });
                });
            });
        });
    });

    describe('/GET employee by TDP', () => {
        it('it should GET employee by tdp', (done) => {
            let queryUser = sequlize.query('insert into "Users" (ktp, name, email, address, phone, "createdAt", "updatedAt") values ( \'1000001\', \'user test\', \'user@test.com\', \'jl. test\',\' 91091091\',    current_date, current_date)', {raw: true});
            let queryCompany = sequlize.query('insert into "Companies" (tdp, name, email, address, "createdAt", "updatedAt") values ( \'999\', \'pt. auto insert\', \'auto@insert.com\', \'jl. auto1\', current_date, current_date)', {raw: true});
            let queryUserandCompany = sequlize.query('select a.id as user_id, b.id as company_id from "Users" as a, "Companies" as b; ', {raw: true});

            Promise.all([queryUser, queryCompany, queryUserandCompany]).then(results => {
                sequlize.query('insert into "Employees" (user_id, company_id, employee_code, title, startat, "createdAt", "updatedAt") values ( '+results[2][0][0].user_id+', '+results[2][0][0].company_id+', \'100001\', \'manager\',current_date,current_date, current_date); select * from "Employees" where user_id = '+results[2][0][0].user_id+' and company_id = '+results[2][0][0].company_id, {raw: true}).then(row => {
                    // console.log(row[0][0]);
                    chai.request(server)
                    .get('/api/v1/employee?tdp=999')
                    .end((err, res)=> {
                        // console.log(res.body);
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        expect(res.body).to.have.length.above(0);
                        done();
                    });
                });
            });
        });
    });

    describe('/GET employee by with TDP with status employee all', () => {
        it('it should GET employee by tdp and status all', (done) => {
            let queryUser = sequlize.query('insert into "Users" (ktp, name, email, address, phone, "createdAt", "updatedAt") values ( \'1000001\', \'user test\', \'user@test.com\', \'jl. test\',\' 91091091\', current_date, current_date)', {raw: true});
            let queryUser1 = sequlize.query('insert into "Users" (ktp, name, email, address, phone, "createdAt", "updatedAt") values ( \'1000002\', \'user test2\', \'user2@test.com\', \'jl. test2\',\' 91091092\', current_date, current_date)', {raw: true});
            let queryCompany = sequlize.query('insert into "Companies" (tdp, name, email, address, "createdAt", "updatedAt") values ( \'999\', \'pt. auto insert\', \'auto@insert.com\', \'jl. auto1\', current_date, current_date)', {raw: true});
            let queryUserandCompany = sequlize.query('select a.id as user_id, b.id as company_id from "Users" as a, "Companies" as b; ', {raw: true});

            Promise.all([queryUser, queryUser1, queryCompany, queryUserandCompany]).then(results => {
                // console.log(results[3][0]);
                
                let queryEmployee1 = sequlize.query('insert into "Employees" (user_id, company_id, employee_code, title, startat, "createdAt", "updatedAt") values ( '+results[3][0][0].user_id+', '+results[3][0][0].company_id+', \'100001\', \'manager\',current_date,current_date, current_date); select * from "Employees" where user_id = '+results[3][0][0].user_id+' and company_id = '+results[3][0][0].company_id, {raw: true});
                let queryEmployee2 = sequlize.query('insert into "Employees" (user_id, company_id, employee_code, title, startat, "createdAt", "updatedAt", status, endat) values ( '+results[3][0][1].user_id+', '+results[3][0][1].company_id+', \'100002\', \'manager\',current_date,current_date, current_date, 1, current_date); select * from "Employees" where user_id = '+results[3][0][1].user_id+' and company_id = '+results[3][0][1].company_id, {raw: true});

                Promise.all([queryEmployee1, queryEmployee2]).then(results2 => {
                    // console.log(results2);
                    chai.request(server)
                    .get('/api/v1/employee?tdp=999&employee_status=all')
                    .end((err, res)=> {
                        // console.log(res.body);
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        expect(res.body).to.have.length.above(1);
                        done();
                    });
                });
            });
        });
    });

    describe('/GET employee by name', () => {
        it('it should GET 2 employees when name is user test', (done) => {
            let queryUser = sequlize.query('insert into "Users" (ktp, name, email, address, phone, "createdAt", "updatedAt") values ( \'1000001\', \'user test\', \'user@test.com\', \'jl. test\',\' 91091091\', current_date, current_date)', {raw: true});
            let queryUser1 = sequlize.query('insert into "Users" (ktp, name, email, address, phone, "createdAt", "updatedAt") values ( \'1000002\', \'user test2\', \'user2@test.com\', \'jl. test2\',\' 91091092\', current_date, current_date)', {raw: true});
            let queryCompany = sequlize.query('insert into "Companies" (tdp, name, email, address, "createdAt", "updatedAt") values ( \'999\', \'pt. auto insert\', \'auto@insert.com\', \'jl. auto1\', current_date, current_date)', {raw: true});
            let queryUserandCompany = sequlize.query('select a.id as user_id, b.id as company_id from "Users" as a, "Companies" as b; ', {raw: true});

            Promise.all([queryUser, queryUser1, queryCompany, queryUserandCompany]).then(results => {
                console.log(results[3][0]);
                
                let queryEmployee1 = sequlize.query('insert into "Employees" (user_id, company_id, employee_code, title, startat, "createdAt", "updatedAt") values ( '+results[3][0][0].user_id+', '+results[3][0][0].company_id+', \'100001\', \'manager\',current_date,current_date, current_date); select * from "Employees" where user_id = '+results[3][0][0].user_id+' and company_id = '+results[3][0][0].company_id, {raw: true});
                let queryEmployee2 = sequlize.query('insert into "Employees" (user_id, company_id, employee_code, title, startat, "createdAt", "updatedAt") values ( '+results[3][0][1].user_id+', '+results[3][0][1].company_id+', \'100002\', \'manager\',current_date,current_date, current_date); select * from "Employees" where user_id = '+results[3][0][1].user_id+' and company_id = '+results[3][0][1].company_id, {raw: true});

                Promise.all([queryEmployee1, queryEmployee2]).then(results2 => {
                    console.log(results2);
                    chai.request(server)
                    .get('/api/v1/employee?name=test')
                    .end((err, res)=> {
                        // console.log(res.body);
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        expect(res.body).to.have.length.above(1);
                        done();
                    });
                });
            });
        });
    });
    
});