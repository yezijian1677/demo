const DB = require("../utils/db.js");

module.exports = {

  /**
   * 添加评论
   */
  add: async ctx => {
    let data = ctx.request.body;

    let user = ctx.state.$wxInfo.userinfo.openId
    let username = ctx.state.$wxInfo.userinfo.nickName
    let avatar = ctx.state.$wxInfo.userinfo.avatarUrl


    let id = +data.id
    let content = data.content || null
    let recordUrl = data.recordUrl || null
    let type = data.comment_type

    if (!isNaN(movieId)) {
      if(type == 0){
      await DB.query('INSERT INTO movies_comment(user, username, useravatar, content, movie_id, type) VALUES (?, ?, ?, ?, ?, ?)', [user, username, avatar, content, id, type])
      }
      else if(type == 1){
        await DB.query('INSERT INTO movies_comment(user, username, useravatar, content, movie_id, type) VALUES (?, ?, ?, ?, ?, ?)', [user, username, avatar, recordUrl, id, type])
      }

    }

    ctx.state.data = {}
  },
  

}