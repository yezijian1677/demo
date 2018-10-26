/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://neometti.qcloud.la';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/weapp/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `${host}/weapp/user`,

        // 测试的信道服务地址
        tunnelUrl: `${host}/weapp/tunnel`,

        // 上传图片接口
        uploadUrl: `${host}/weapp/upload`,

        //获取电影列表
        movieList: `${host}/weapp/movies`,
        
        //获取电影详情
        movieDetail: `${host}/weapp/movies/`,
        
        //拉取用户信息
        user: `${host}/weapp/user`,

        //获取我的影评收藏
        markList: `${host}/weapp/mark`,

        //添加评论
        addComment: `${host}/weapp/comments`,

        //根据电影获取评论
        commentOfMovie: `${host}/weapp/comments/`,

        //根据评论id获取评论
        getCommentByCommentId: `${host}/weapp/getCommentByCommentId/`,

        //收藏评论
        mark_comment: `${host}/weapp/mark`,

        //查询评论是否被收藏
        user_is_mark: `${host}/weapp/mark/`
    }
};

module.exports = config;
