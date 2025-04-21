const gatoController = require('../../controllers/gatoController');
const gatoService = require('../../services/gatoService');
const { validationResult } = require('express-validator');

jest.mock('../../services/gatoService');
jest.mock('express-validator', () => ({
    validationResult: jest.fn()
}));

// Función helper para crear mocks de req y res
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

describe('Gato Controller', () => {

    afterEach(() => {
        jest.clearAllMocks(); // Asegura que los mocks se reinicien después de cada test para que no afecten a los siguientes
    });

    describe('getAll', () => {
        it('debe retornar todos los gatos', async () => {
            const { req, res } = getMockReqRes();
            const gatosFake = [{ id: 1, nombre: 'Mittens' }];
            gatoService.getAll.mockResolvedValue(gatosFake);

            await gatoController.getAll(req, res);

            expect(res.json).toHaveBeenCalledWith(gatosFake);
        });
    });

    describe('getById', () => {
        it('debe retornar un gato por id', async () => {
            const { req, res } = getMockReqRes();
            req.params.id = '123';
            const gatoFake = { id: 123, nombre: 'Mittens' };
            gatoService.getById.mockResolvedValue(gatoFake);

            await gatoController.getById(req, res);

            expect(res.json).toHaveBeenCalledWith(gatoFake);
        });
    });

    describe('create', () => {
        it('debe registrar un gato exitosamente', async () => {
            const { req, res } = getMockReqRes();
            req.body = { nombre: 'Mittens' };
            // Simulamos que no hay errores de validación
            validationResult.mockReturnValue({ isEmpty: () => true });
            gatoService.create.mockResolvedValue();

            await gatoController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'Gatito registrado exitosamente' });
        });

        it('debe retornar error de validación', async () => {
            const { req, res } = getMockReqRes();
            // Simulamos que hay errores de validación
            const fakeErrors = [{ msg: 'Campo requerido' }];
            validationResult.mockReturnValue({ isEmpty: () => false, array: () => fakeErrors });

            await gatoController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ errors: fakeErrors });
        });

        it('debe manejar error en la creación del gato', async () => {
            const { req, res } = getMockReqRes();
            req.body = { nombre: 'Mittens' };
            validationResult.mockReturnValue({ isEmpty: () => true });
            const error = new Error('Fallo en la DB');
            gatoService.create.mockRejectedValue(error);

            await gatoController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error al registrar el gato', details: error.message });
        });
    });

    describe('update', () => {
        it('debe actualizar un gato exitosamente', async () => {
            const { req, res } = getMockReqRes();
            req.params.id = '123';
            req.body = { nombre: 'Garfield' };
            validationResult.mockReturnValue({ isEmpty: () => true });
            gatoService.update.mockResolvedValue();

            await gatoController.update(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({});
        });

        it('debe retornar error de validación en update', async () => {
            const { req, res } = getMockReqRes();
            const fakeErrors = [{ msg: 'Campo requerido' }];
            validationResult.mockReturnValue({ isEmpty: () => false, array: () => fakeErrors });

            await gatoController.update(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ errors: fakeErrors });
        });

        it('debe manejar error en la actualización del gato', async () => {
            const { req, res } = getMockReqRes();
            req.params.id = '123';
            req.body = { nombre: 'Garfield' };
            validationResult.mockReturnValue({ isEmpty: () => true });
            const error = new Error('Fallo en la actualización');
            gatoService.update.mockRejectedValue(error);

            await gatoController.update(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error al actualizar el gato', details: error.message });
        });
    });

    describe('remove', () => {
        it('debe remover un gato exitosamente', async () => {
            const { req, res } = getMockReqRes();
            req.params.id = '123';
            gatoService.remove.mockResolvedValue();

            await gatoController.remove(req, res);

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.json).toHaveBeenCalledWith({});
        });
    });

});
