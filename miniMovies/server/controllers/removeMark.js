const DB = require("../utils/db.js");
module.exports = {
  /**
   * 移除收藏的影评
   */
  remove_mark_comment: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId;
    let comment_id = + ctx.request.body.id;

    let data = await DB.query('delete from star_comment where user = ? and comment_id = ?', [user, comment_id]);
    ctx.state.data = data;
  }

}