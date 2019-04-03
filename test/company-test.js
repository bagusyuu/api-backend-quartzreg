let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
var assert = require('chai').assert;
let expect = require('chai').expect;

const sequlize = require('../config/connector');

chai.use(chaiHttp);
describe('Company', function() {
    beforeEach((done) => {
        sequlize.query('truncate table "Companies" cascade;', {raw: true}).then(results => {
            done();
        });
    });


    describe('/GET company', () => {
        it('it should GET all the company   ', (done) => {
            chai.request(server)
                .get('/api/v1/company')
                .end((err, res)=> {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });
    
    describe('/POST company', () => {
        it('it should NOT add company   ', (done) => {
            let company = {
                tdp : "10001",
                address : "bandung"
            }

            chai.request(server)
                .post('/api/v1/company')
                .send(company)
                .end((err, res)=> {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    done();
                });
        });

        it('it should add company   ', (done) => {
            let company = {
                name : "PT. Quartz Sejahtera Bersama",
                tdp : "10001",
                email : "qsb@gmail.com",
                address : "bandung"
            }

            chai.request(server)
                .post('/api/v1/company')
                .send(company)
                .end((err, res)=> {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name').eql("PT. Quartz Sejahtera Bersama");
                    res.body.should.have.property('tdp').eql(10001);
                    res.body.should.have.property('email').eql("qsb@gmail.com");
                    res.body.should.have.property('address').eql("bandung");
                    done();
                });
        });
    });

    describe('/GET/:tdp get detail company', () => {
        it('it should GET a company by the given tdp', (done) => {
            let query = 'insert into "Companies" (tdp, name, email, address, "createdAt", "updatedAt") values ( \'999\', \'pt. auto insert\', \'auto@insert.com\', \'jl. auto1\', current_date, current_date)';
            sequlize.query( query, {raw: true}).then((results, x) => {
                chai.request(server)
                    .get('/api/v1/company/999')
                    .end((err, res)=> {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('tdp');
                        res.body.should.have.property('name');
                        res.body.should.have.property('email');
                        res.body.should.have.property('address');
                        done();
                    });
            });
        });
    });

    describe('/PATCH/:tdp update detail company', () => {
        it('it should PATCH a company by the given tdp', (done) => {
            let query = 'insert into "Companies" (tdp, name, email, address, "createdAt", "updatedAt") values ( \'999\', \'pt. auto insert\', \'auto@insert.com\', \'jl. auto1\', current_date, current_date)';
            sequlize.query( query, {raw: true}).then(results => {
                let company = {
                    name : "PT. Quartz Sejahtera Bersama1",
                    address : "bandung1"
                }
                chai.request(server)
                    .patch('/api/v1/company/999')
                    .send(company)
                    .end((err, res)=> {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('address').eql("bandung1");
                        done();
                    });
            });
        });
    });

    describe('/DELETE/:tdp delete detail company', () => {
        it('it should DELETE a company by the given tdp', (done) => {
            let query = 'insert into "Companies" (tdp, name, email, address, "createdAt", "updatedAt") values ( \'999\', \'pt. auto insert\', \'auto@insert.com\', \'jl. auto1\', current_date, current_date)';
            sequlize.query( query, {raw: true}).then(results => {
                chai.request(server)
                    .delete('/api/v1/company/999')
                    .end((err, res)=> {
                        res.should.have.status(204);
                        res.body.should.be.a('object');
                        done();
                    });
            });
        });
    });

    describe('/GET company by name', () => {
        it('it should GET a company by name', (done) => {
            let query = 'insert into "Companies" (tdp, name, email, address, "createdAt", "updatedAt") values ( \'999\', \'pt. auto insert\', \'auto@insert.com\', \'jl. auto1\', current_date, current_date)';
            sequlize.query( query, {raw: true}).then((results, x) => {
                chai.request(server)
                    .get('/api/v1/company?name=auto')
                    .end((err, res)=> {
                        
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        // res.body[0].should.have.property('name').eql("pt. auto insert");
                        // res.body.should.have.a.min.length.of(1);
                        expect(res.body).to.have.length.above(0);
                        done();
                    });
            });
        });
    });
    
});