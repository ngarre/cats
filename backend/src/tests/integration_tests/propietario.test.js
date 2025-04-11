const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const app = require('../../app.js').app;

chai.should();
chai.use(chaiHttp);


describe('owners', () => {

    describe('GET /propietarios', () => {
        it('Caso de éxito: debe retornar todos los propietarios', (done) => {
            chai.request(app)
                .get('/propietarios')
                .end((error, response) => {
                    if (error) return done(error);

                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    expect(response.body[0]).to.have.property('nickname');
                    expect(response.body[0]).to.have.property('nombre');
                    expect(response.body[0]).to.have.property('edad');
                    expect(response.body[0]).to.have.property('nacionalidad');

                    expect(response.body[0].nickname).to.equal('gatolover99');
                    expect(response.body[1].nickname).to.equal('miauqueen');
                    done();
                });
        });
    });

    describe('GET /propietarios/:id', () => {
        it('Caso de éxito: debe retornar un propietario por id', (done) => {
            chai.request(app)
                .get('/propietarios/1')
                .end((error, response) => {
                    if (error) return done(error);

                    response.should.have.status(200);
                    expect(response.body).to.have.property('nickname');
                    expect(response.body).to.have.property('nombre');
                    expect(response.body).to.have.property('edad');
                    expect(response.body).to.have.property('nacionalidad');

                    expect(response.body.nombre).to.equal('Carlos Pérez');
                    done();
                });
        });
    });

    describe('POST /propietarios', () => {
        it('Caso de éxito: debe crear un nuevo perfil de propietario', (done) => {
            chai.request(app)
                .post('/propietarios')
                .send({
                    nickname: 'Gerrito',
                    nombre: 'German',
                    edad: 26,
                    nacionalidad: 'Peru',
                })
                .end((error, response) => {
                    if (error) return done(error);

                    response.should.have.status(201);
                    expect(response.body).to.have.property('message');
                    expect(response.body.message).to.equal('Te has registrado exitosamente');
                    done();
                });
        });

        it('Caso de error: debe fallar porque el nickname es obligatorio', (done) => {
            chai.request(app)
                .post('/propietarios')
                .send({
                    nickname: '',
                    nombre: 'Jorge',
                    edad: 10,
                    nacionalidad: 'Chile',
                })
                .end((error, response) => {
                    if (error) return done(error);
                    response.should.have.status(400);
                    done();
                });
        });
    });

    describe('PUT /propietarios/:id', () => {
        it('Caso de éxito: debe modificar un perfil de propietario', (done) => {
            chai.request(app)
                .put('/propietarios/6')
                .send({
                    nickname: 'Asterisco',
                    nombre: 'Asterix',
                    edad: 70,
                    nacionalidad: 'Mexico',
                })
                .end((error, response) => {
                    if (error) return done(error);

                    response.should.have.status(200);
                    done();
                });
        });

        it('Caso de error: debe fallar porque el nickname es obligatorio', (done) => {
            chai.request(app)
                .put('/propietarios/6')
                .send({
                    nickname: '',
                    nombre: 'Luz',
                    edad: 46,
                    nacionalidad: 'USA',
                })
                .end((error, response) => {
                    if (error) return done(error);

                    response.should.have.status(400);
                    done();
                });
        });
    });

    describe('DELETE /propietarios/:id', () => {
        it('Caso de éxito: debe eliminar un propietario', (done) => {
            chai.request(app)
                .delete('/propietarios/7')
                .end((error, response) => {
                    if (error) return done(error);

                    response.should.have.status(204);
                    done();
                });
        });

        it('Debe fallar con la base de datos rota', (done) => {
            const originalDb = app.locals.db;
            app.locals.db = null;

            chai.request(app)
                .delete('/propietarios/7')
                .end((error, res) => {
                    if (error) return done(error);

                    res.should.have.status(500);
                    app.locals.db = originalDb; // restauramos la conexión
                    done();
                });
        });
    });

    describe('GET /propietarios/:id/gatos', () => {
        it('Caso de éxito: debe retornar una lista de gatitos dado el id de un propietario', (done) => {
            chai.request(app)
                .get('/propietarios/1/gatos')
                .end((error, response) => {
                    if (error) return done(error);

                    response.body.should.be.a('array');
                    expect(response.body[0]).to.have.property('nombre');
                    expect(response.body[0]).to.have.property('edad');
                    expect(response.body[0]).to.have.property('raza');
                    expect(response.body[0]).to.have.property('propietario');
                    expect(response.body[0]).to.have.property('propietario');

                    expect(response.body[0].nombre).to.equal('Michi');
                    done();
                });
        });
    });
});
