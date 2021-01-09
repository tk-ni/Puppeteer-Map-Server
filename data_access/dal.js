const mysql = require('mysql');
const env = require('./../core/env');

const database = mysql.createPool({
    host:env.database.credentials.host,
    user:env.database.credentials.user,
    password:env.database.credentials.password,
    port: env.database.credentials.port,
    database: env.database.credentials.database,
    insecureAuth: env.database.credentials.insecureAuth,
    charset: env.database.credentials.charset,
    connectionLimit: 10,
    timeout: 30000,
    waitForConnections: true,
    multipleStatements: true
});

const readAll = (query, cb) =>{
    database.query(query, (e,data)=>{
        if(e){
            cb(e);
        }else{
            cb(null,data);
        }
    })
}
const readOne = (query, cb) =>{
    database.query(query, (e,data)=>{
        if(e){
            cb(e);
        }else{
            if(data.length > 0){
                cb(null,data[0]);
            }else{
                cb(null,null);
            }
        }
    })
}

const addOne = (query, obj, cb) =>{
    database.query(query, obj, (e)=>{
        if(e){
            cb(e);
        }else{
            cb(null);
        }
    })
}
const addOneQuery = (query, cb) =>{
    database.query(query, (e)=>{
        if(e){
            cb(e);
        }else{
            cb(null);
        }
    })
}
const updateOne = (query, obj,cb) =>{
    database.query(query, obj, (e)=>{
        if(e){
            cb(e);
        }else{
            cb(null);
        }
    })
}
const updateOneQuery = (query,cb)=>{
    database.query(query, (e)=>{
        if(e){
            cb(e);
        }else{
            cb(null);
        }
    })
}
const deleteOne = (query, cb) =>{
    database.query(query, (e)=>{
        if(e){
            cb(e);
        }else{
            cb(null);
        }
    })
}

const deleteAll = (query, cb) =>{
    database.query(query, (e)=>{
        if(e){
            cb(e);
        }else{
            cb(null);
        }
    })
}

module.exports = {
    readAll: readAll,
    readOne: readOne,
    addOne: addOne,
    addOneQuery: addOneQuery,
    updateOne: updateOne,
    updateOneQuery:updateOneQuery,
    deleteOne: deleteOne,
    deleteAll:deleteAll
}