const DB = require("../utils/db.js");
module.exports = {
  /**
   * 根据评论id获取评论
   */
  getCommentByCommentId: async ctx => {
    let id = + ctx.params.id;
    let comment_detail;
    if (!isNaN(id)) {
      comment_detail = (await DB.query("select * from movies_comment where id = ?", [id]));
    } else {
      comment_detail = {};
    }
    ctx.state.data = comment_detail;
  }

}