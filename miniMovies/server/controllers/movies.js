const DB = require('../utils/db.js');

module.exports = {
  list: async ctx => {
    ctx.state.data = await DB.query("SELECT * FROM movies;")
  },

  detail: async ctx => {
    let movieId = + ctx.params.id;
    let movieDetail;
    if(!isNaN(movieId)){
      movieDetail = (await DB.query("SELECT * FROM movies WHERE movies.id = ?",[movieId]))[0];
    } else {
      movieDetail = {};
    }

    ctx.state.data = movieDetail;
  },
};