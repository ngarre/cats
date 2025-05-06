module.exports = {
    getAll: async (db) => await db('propietarios').select('*'),
    getById: async (db, id) => await db('propietarios').select('*').where({ id }).first(),
    getByNickname: async (db, nickname) => await db('propietarios').select('*').where({nickname}).first(),
    create: async (db, propietario) => await db('propietarios').insert(propietario),
    update: async (db, id, propietario) => await db('propietarios').update(propietario).where({id}),
    remove:  async (db, id) => await db('propietarios').del().where({id}),
    getGatos: async (db, id) => await db('gatos').select('*').where({id_propietario: id})
}