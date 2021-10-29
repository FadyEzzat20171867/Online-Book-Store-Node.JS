exports.openConnection = () => {
    const knex = require('knex')({
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: 'fue12345',
            database: 'mydb'
        }
    });
    return knex
}