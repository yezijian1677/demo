const DB = require("../utils/db.js");

module.exports = {
  /**
   * 查看写过
   * 返回收藏个数
   */
  user_is_comment: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId;
    let comment_id = + ctx.params.id;

    let comment_num = await DB.query('select count(*) from movies_comment where user = ? and id = ?', [user, comment_id]);

    ctx.state.data = comment_num;
  }
}