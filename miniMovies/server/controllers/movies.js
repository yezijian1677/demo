const DB = require('../utils/db.js');

module.exports = {
  //电影列表
  list: async ctx => {
    ctx.state.data = await DB.query("SELECT * FROM movies");
  },

  //电影详情
  detail: async ctx => {
    let movieId = + ctx.params.id;
    let movieDetail;
    if(!isNaN(movieId)){
      movieDetail = (await DB.query("SELECT * FROM movies WHERE movies.id = ?",[movieId]))[0];
    } else {
      movieDetail = {};
    }

    ctx.state.data = movieDetail;
  }
  
};