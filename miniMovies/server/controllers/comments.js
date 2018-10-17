const DB = require("../utils/db.js");

module.exports = {

  /**
   * 添加评论
   */
  add: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId;
    let username = ctx.state.$wxInfo.userinfo.nickName;
    let avatar = ctx.state.$wxInfo.userinfo.avatarUrl;
    let movieId = +ctx.request.body.id;
    let type = ctx.request.body.type;
    let content = ctx.request.body.content || null;
    if (!isNaN(movieId)) {
      await DB.query('INSERT INTO movies_comment(user, username, avatar, content, id, type) VALUES (?, ?, ?, ?, ?, ?)', [user, username, avatar, content, id, type]);
    }
    ctx.state.data = {}
  }
  

}