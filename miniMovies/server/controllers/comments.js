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

    if (!isNaN(id)) {
      if(type == 0){
      await DB.query('INSERT INTO movies_comment(user, username, avatar, content, movie_id, type) VALUES (?, ?, ?, ?, ?, ?)', [user, username, avatar, content, id, type])
      }
      else if(type == 1){
        await DB.query('INSERT INTO movies_comment(user, username, avatar, content, movie_id, type) VALUES (?, ?, ?, ?, ?, ?)', [user, username, avatar, recordUrl, id, type])
      }

    }

    ctx.state.data = {id}
  },

  /**
   * 根据电影id获取评论
   */
  getCommentOfMovie: async ctx => {
    let id = + ctx.params.id;
    let comment_list;
    if(!isNaN(id)){
      comment_list = (await DB.query("select * from movies_comment where movie_id = ? order by create_time desc", [id]));
    } else {
      comment_list = [];
    }
    ctx.state.data = comment_list;
  },
  
  // /**
  //  * 根据评论id获取评论
  //  */
  // getCommentByCommentId: async ctx => {
  //   let id = + ctx.params.id;
  //   let comment_detail;
  //   if(!isNaN(id)){
  //     comment_detail = (await DB.query("select * from movies_comment where id = ?",[id]));
  //   } else {
  //     comment_detail = {};
  //   }
  //   ctx.state.data = comment_detail;
  // }

}