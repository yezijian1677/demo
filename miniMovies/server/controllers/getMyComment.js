const DB = require("../utils/db.js");

module.exports = {
  /**
  * 查询用户收藏的影评
  */
  my_comment: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId;
    let comments = await DB.query('SELECT movies_comment.id AS `id`, movies_comment.username AS `username`,     movies_comment.avatar AS `avatar`, movies_comment.content AS `content`, movies_comment.type AS `type`, movies.title AS `title`, movies.id AS `movie_id`, movies.image AS `image` FROM movies_comment LEFT JOIN star_comment ON star_comment.comment_id = movies_comment.id LEFT JOIN movies ON movies.id = movies_comment.movie_id WHERE movies_comment.user = ? ORDER BY star_comment.create_time DESC', [user]);

    ctx.state.data = comments;
  }

}