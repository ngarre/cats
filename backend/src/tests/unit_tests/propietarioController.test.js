const propietarioController = require('../../controllers/propietarioController');
const propietarioService = require('../../services/propietarioService');
const gatoService = require('../../services/gatoService');
const { validationResult } = require('express-validator');

jest.mock('../../services/propietarioService');
jest.mock('../../services/gatoService');
jest.mock('express-validator', () => ({
    validationResult: jest.fn()
}));

// Defino los parámetros que necesitan las funciones de Controller
const getMockReqRes = () => {
    const req = {
        app: { locals: { db: {} } },
        params: {},
        body: {}
    };
    const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
    };
    return { req, res };
};

describe('Propietario Controller', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAll', () => {
        it('debe retornar todos los propietarios', async () => {
            const { req, res } = getMockReqRes();
            const propietariosFake = [{ id: 1, nombre: 'Juan' }];
            propietarioService.getAll.mockResolvedValue(propietariosFake);

            await propietarioController.getAll(req, res);

            
            expect(res.json).toHaveBeenCalledWith(propietariosFake);
        });
    });

    describe('getById', () => {
        it('debe retornar un propietario por id', async () => {
            const { req, res } = getMockReqRes();
            req.params.id = '123';
            const propietarioFake = { id: 123, nombre: 'Juan' };
            propietarioService.getById.mockResolvedValue(propietarioFake);

            await propietarioController.getById(req, res);

            
            expect(res.json).toHaveBeenCalledWith(propietarioFake);
        });
    });

    describe('getByNickname', () => {
        it('debe retornar un propietario por nickname', async () => {
            const { req, res } = getMockReqRes();
            req.params.nickname = 'juanito';
            const propietarioFake = { id: 123, nickname: 'juanito' };
            propietarioService.getByNickname.mockResolvedValue(propietarioFake);

            await propietarioController.getByNickname(req, res);

            expect(res.json).toHaveBeenCalledWith(propietarioFake);
        });
    });

    describe('create', () => {
        it('debe registrar un propietario exitosamente', async () => {
            const { req, res } = getMockReqRes();
            req.body = { nombre: 'Juan' };
            validationResult.mockReturnValue({ isEmpty: () => true });
            propietarioService.create.mockResolvedValue();

            await propietarioController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'Te has registrado exitosamente' });
        });

        it('debe retornar error de validación', async () => {
            const { req, res } = getMockReqRes();
            const fakeErrors = [{ msg: 'Campo requerido' }];
            validationResult.mockReturnValue({ isEmpty: () => false, array: () => fakeErrors });

            await propietarioController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ errors: fakeErrors });
        });

        it('debe manejar error en la creación del propietario', async () => {
            const { req, res } = getMockReqRes();
            req.body = { nombre: 'Juan' };
            validationResult.mockReturnValue({ isEmpty: () => true });
            const error = new Error('Fallo en la DB');
            propietarioService.create.mockRejectedValue(error);

            await propietarioController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Ocurrió un error al registrar', details: error.message });
        });
    });

    describe('update', () => {
        it('debe actualizar un propietario exitosamente', async () => {
            const { req, res } = getMockReqRes();
            req.params.id = '123';
            req.body = { nombre: 'Juan Actualizado' };
            validationResult.mockReturnValue({ isEmpty: () => true });
            propietarioService.update.mockResolvedValue();

            await propietarioController.update(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({});
        });

        it('debe retornar error de validación en update', async () => {
            const { req, res } = getMockReqRes();
            const fakeErrors = [{ msg: 'Campo requerido' }];
            validationResult.mockReturnValue({ isEmpty: () => false, array: () => fakeErrors });

            await propietarioController.update(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ errors: fakeErrors });
        });

        it('debe manejar error en la actualización del propietario', async () => {
            const { req, res } = getMockReqRes();
            req.params.id = '123';
            req.body = { nombre: 'Juan Actualizado' };
            validationResult.mockReturnValue({ isEmpty: () => true });
            const error = new Error('Fallo en la actualización');
            propietarioService.update.mockRejectedValue(error);

            await propietarioController.update(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Ocurrió un error al registrar', details: error.message });
        });
    });

    describe('remove', () => {
        it('debe remover un propietario exitosamente', async () => {
            const { req, res } = getMockReqRes();
            req.params.id = '123';
            propietarioService.remove.mockResolvedValue();

            await propietarioController.remove(req, res);

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.json).toHaveBeenCalledWith({});
        });
    });

    describe('getGatos', () => {
        it('debe retornar los gatos de un propietario', async () => {
            const { req, res } = getMockReqRes();
            req.params.id = '123';
            const gatosFake = [{ id: 1, nombre: 'Mittens' }];
            propietarioService.getGatos.mockResolvedValue(gatosFake);

            await propietarioController.getGatos(req, res);

            expect(res.json).toHaveBeenCalledWith(gatosFake);
        });
    });

});
