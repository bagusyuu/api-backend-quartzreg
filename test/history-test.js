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
        let querytruncate = sequlize.query('truncate table "Employees" cascade; truncate table "Companies" cascade; truncate table "Users" cascade;', {raw: true}).then(results => {
            done();
        });
    });

    describe('/GET user history', () => {
        it('it should GET all the user work history  ', (done) => {
            
            let queryUser = sequlize.query('insert into "Users" (ktp, name, email, address, phone, "createdAt", "updatedAt") values ( \'1000001\', \'user test\', \'user@test.com\', \'jl. test\',\' 91091091\', current_date, current_date)', {raw: true});
            let queryCompany = sequlize.query('insert into "Companies" (tdp, name, email, address, "createdAt", "updatedAt") values ( \'999\', \'pt. auto insert\', \'auto@insert.com\', \'jl. auto1\', current_date, current_date)', {raw: true});
            let queryCompany1 = sequlize.query('insert into "Companies" (tdp, name, email, address, "createdAt", "updatedAt") values ( \'9999\', \'pt. auto insert 2\', \'auto@insert2.com\', \'jl. auto2\', current_date, current_date)', {raw: true});
            let queryUserandCompany = sequlize.query('select a.id as user_id, b.id as company_id from "Users" as a, "Companies" as b; ', {raw: true});

            Promise.all([queryUser, queryCompany, queryCompany1, queryUserandCompany]).then(results => {
                let queryEmployee1 = sequlize.query('insert into "Employees" (user_id, company_id, employee_code, title, startat, "createdAt", "updatedAt") values ( '+results[3][0][0].user_id+', '+results[3][0][0].company_id+', \'100001\', \'manager\',current_date,current_date, current_date); ', {raw: true});
                let queryEmployee2 = sequlize.query('insert into "Employees" (user_id, company_id, employee_code, title, startat, "createdAt", "updatedAt") values ( '+results[3][0][1].user_id+', '+results[3][0][1].company_id+', \'100002\', \'sr. manager\',current_date,current_date, current_date); ', {raw: true});

                Promise.all([queryEmployee1, queryEmployee2]).then(results2 => {
                    // console.log(results2);
                    chai.request(server) 
                    .get('/api/v1/user/1000001/history')
                    .end((err, res)=> {
                        console.log(res.body);
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        expect(res.body.employee).to.have.length.above(1);
                        done();
                    });
                });
            });
        });
    });
});