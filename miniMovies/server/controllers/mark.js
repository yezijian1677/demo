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