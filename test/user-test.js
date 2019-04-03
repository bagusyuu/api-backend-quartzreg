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
        sequlize.query('truncate table "Users" cascade;', {raw: true}).then(results => {
            done();
        });
    });


    describe('/GET user', () => {
        it('it should GET all the user   ', (done) => {
            chai.request(server)
                .get('/api/v1/user')
                .end((err, res)=> {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });
    
    describe('/POST usere', () => {
        it('it should NOT add user   ', (done) => {
            let user = {
                name: 'user1',
                // ktp: '10001',
                email: 'user1@user.com',
                address : 'jl. user1',
                phone : '0191010291'
            }

            chai.request(server)
                .post('/api/v1/user')
                .send(user)
                .end((err, res)=> {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    done();
                });
        });

        it('it should add user   ', (done) => {
            let user = {
                name: 'user1',
                ktp: '10001',
                email: 'user1@user.com',
                address : 'jl. user1',
                phone : '0191010291'
            }

            chai.request(server)
                .post('/api/v1/user')
                .send(user)
                .end((err, res)=> {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name').eql("user1");
                    res.body.should.have.property('ktp').eql('10001');
                    res.body.should.have.property('email').eql("user1@user.com");
                    res.body.should.have.property('address').eql("jl. user1");
                    res.body.should.have.property('phone').eql("0191010291");
                    done();
                });
        });
    });

    describe('/GET/:tdp get detail user', () => {
        it('it should GET a user by the given ktp', (done) => {
            let query = 'insert into "Users" (ktp, name, email, address, phone, "createdAt", "updatedAt") values ( \'1000001\', \'user test\', \'user@test.com\', \'jl. test\',\' 91091091\',    current_date, current_date)';
            sequlize.query( query, {raw: true}).then((results, x) => {
                chai.request(server)
                    .get('/api/v1/user/1000001')
                    .end((err, res)=> {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('ktp');
                        res.body.should.have.property('name');
                        res.body.should.have.property('email');
                        res.body.should.have.property('address');
                        res.body.should.have.property('phone');
                        done();
                    });
            });
        });
    });

    describe('/PATCH/:ktp update detail user', () => {
        it('it should PATCH a user by the given tdp', (done) => {
            let query = 'insert into "Users" (ktp, name, email, address, phone, "createdAt", "updatedAt") values ( \'1000001\', \'user test\', \'user@test.com\', \'jl. test\',\' 91091091\',    current_date, current_date)';
            sequlize.query( query, {raw: true}).then(results => {
                let user = {
                    name : "test2",
                    address : "bandung1"
                }
                console.log(results[0][0]);
                chai.request(server)
                    .patch('/api/v1/user/1000001')
                    .send(user)
                    .end((err, res)=> {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('address').eql("bandung1");
                        done();
                    });
            });
        });
    });

    describe('/DELETE/:ktp delete detail user', () => {
        it('it should DELETE a ktp by the given ktp', (done) => {
            let query = 'insert into "Users" (ktp, name, email, address, phone, "createdAt", "updatedAt") values ( \'1000001\', \'user test\', \'user@test.com\', \'jl. test\',\' 91091091\',    current_date, current_date)';
            sequlize.query(query).then(results => {
                console.log(results);
                chai.request(server)
                    .delete('/api/v1/user/1000001')
                    .end((err, res)=> {
                        res.should.have.status(204);
                        res.body.should.be.a('object');
                        done();
                    });
            });
        });
    });

    
});