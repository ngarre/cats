const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const app = require('../../app.js').app;

chai.should();
chai.use(chaiHttp);

describe('cats', () => {
    describe('GET /gatos', () => {
        it('Caso de éxito: debe retornar todos los gatos', (done) => {
            chai.request(app)
                .get('/gatos')
                .end((error, response) => {
                    if (error) return done(error);

                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    expect(response.body[0]).to.have.property('nombre');
                    expect(response.body[0]).to.have.property('edad');
                    expect(response.body[0]).to.have.property('raza');
                    expect(response.body[0]).to.have.property('propietario');
                    expect(response.body[0]).to.have.property('id_propietario');


                    expect(response.body[0].nombre).to.equal('Michi');
                    expect(response.body[1].nombre).to.equal('Luna');
                    done();
                });
        });
    });

    describe('GET /gatos/:id', () => {
        it('Caso de éxito: debe retornar un gato por id', (done) => {
            chai.request(app)
                .get('/gatos/1')
                .end((error, response) => {
                    if (error) return done(error);

                    response.should.have.status(200);
                    expect(response.body).to.have.property('nombre');
                    expect(response.body).to.have.property('edad');
                    expect(response.body).to.have.property('raza');
                    expect(response.body).to.have.property('propietario');
                    expect(response.body).to.have.property('id_propietario');


                    expect(response.body.nombre).to.equal('Michi');
                    done();
                });
        });
    });

    describe('POST /gatos', () => {
        it('Caso de éxito: debe crear un nuevo gato', (done) => {
            chai.request(app)
                .post('/gatos')
                .send({
                    nombre: 'Orejitas',
                    edad: 10,
                    raza: 'bonita',
                    propietario: 'gatolover99',
                    id_propietario: 1
                })
                .end((error, response) => {
                    if (error) return done(error);

                    response.should.have.status(201);
                    expect(response.body).to.have.property('message');
                    expect(response.body.message).to.equal('Gatito registrado exitosamente');
                    done();
                });
        });

        it('Caso de error: debe fallar porque el nombre es obligatorio', (done) => {
            chai.request(app)
                .post('/gatos')
                .send({
                    nombre: '',
                    edad: 10,
                    raza: 'bonita',
                    propietario: 'gatolover99',
                    id_propietario: 1
                })
                .end((error, response) => {
                    if (error) return done(error);
                    response.should.have.status(400);
                    done();
                });
        });

    });

    // TODO hacer caso de error
    describe('PUT /gatos/:id', () => {
        it('Caso de éxito: debe modificar un gato', (done) => {
            chai.request(app)
                .put('/gatos/2')
                .send({
                    nombre: 'Sol',
                    edad: 10,
                    raza: 'bonita',
                    propietario: 'gatolover99',
                    id_propietario: 1
                })
                .end((error, response) => {
                    if (error) return done(error);

                    response.should.have.status(200);
                    done();
                });
        });


        it('Caso de error: debe fallar porque el nombre es obligatorio', (done) => {
            chai.request(app)
                .put('/gatos/3')
                .send({
                    nombre: '',
                    edad: 10,
                    raza: 'bonita',
                    propietario: 'gatolover99',
                    id_propietario: 1
                })
                .end((error, response) => {
                    if (error) return done(error);

                    response.should.have.status(400);
                    done();
                });
        });
    });

    describe('DELETE /gatos/:id', () => {
        it('Caso de éxito: debe eliminar un gato', (done) => {
            chai.request(app)
                .delete('/gatos/6')
                .end((error, response) => {
                    if (error) return done(error);

                    response.should.have.status(204);
                    done();
                });
        });

    });

    const originalDb = app.locals.db;

    it('Debe fallar con la base de datos rota', (done) => {
        app.locals.db = null;

        chai.request(app)
            .delete('/gatos/4')
            .end((error, res) => {
                if (error) return done(error);

                res.should.have.status(500);

                app.locals.db = originalDb; // restauramos
                done();
            });
    });


});