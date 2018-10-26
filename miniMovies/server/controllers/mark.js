const DB = require("../utils/db.js");

module.exports = {
  /**
   * 收藏影评
   */
  mark_comment: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId;
    let comment_id = + ctx.request.body.id;

    let data = await DB.query('insert into star_comment(comment_id, user) values (?, ?)', [comment_id, user]);
    ctx.state.data = {data, comment_id, user};
  },


  /**
   * 查询用户收藏的影评
   */
    user_star_comment: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId;
    let comments = await DB.query('SELECT star_comment.comment_id AS `id`, movies_comment.username AS `username`,     movies_comment.avatar AS `avatar`, movies_comment.content AS `content`, movies_comment.type AS `type`, movies.title AS `title`, movies.id AS `movie_id` FROM movies_comment LEFT JOIN star_comment ON star_comment.comment_id = movies_comment.id LEFT JOIN movies ON movies.id = movies_comment.movie_id WHERE star_comment.user = ? ORDER BY star_comment.create_time DESC', [user]);
    
    ctx.state.data = comments;
  },

  /**
   * 查看是否收藏
   * 返回收藏个数
   */
  user_is_mark: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId;
    let comment_id = + ctx.params.id;

    let comment_num = await DB.query('select count(*) from star_comment where user = ? and comment_id = ?',[user, comment_id]);

    ctx.state.data = comment_num;
  }
}