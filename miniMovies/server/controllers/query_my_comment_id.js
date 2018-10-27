const DB = require("../utils/db.js");

module.exports = {
  /**
   * 查看写过
   * 返回我的评论的id
   */
  my_id: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId;
    let movie_id = + ctx.params.id;
    let my_comment_id = await DB.query('select id from movies_comment where user = ? and movie_id = ?', [user, movie_id]);

    ctx.state.data = my_comment_id;
  }
}