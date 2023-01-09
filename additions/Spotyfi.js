require('dotenv').config
// const Spotify = require('spotify-finder');
// const client = new Spotify({
//   consumer: {
//     key: process.env.CLIENT, 
//     secret: process.env.SECRET
//   }
// })

const Spotify = require('spotify-get');
let client = new Spotify()
client.sclient = new Spotify({
  consumer: {
  key: process.env.CLIENT,
  secret: process.env.SECRET 
}});

module.exports = {client}