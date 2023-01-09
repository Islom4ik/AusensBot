require('dotenv').config()

const { MongoClient, ObjectId } = require('mongodb');
const url = process.env.DB;
const clientdb = new MongoClient(url);
clientdb.connect();
const db = clientdb.db('musics');
const collection = db.collection('musics_info');
const searchedb = db.collection('usersearchedmusic');
module.exports = {collection, searchedb, ObjectId}