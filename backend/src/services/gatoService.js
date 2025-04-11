module.exports = {
    getAll: async (db) => await db('gatos').select('*'),
    getById: async (db, id) => await db('gatos').select('*').where({ id }).first(),
    create: async (db, gato) => await db('gatos').insert(gato),
    update: async (db, id, gato) => await db('gatos').update(gato).where({ id }),
    remove: async (db, id) => await db('gatos').del().where({ id }),
};
