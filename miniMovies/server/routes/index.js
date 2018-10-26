/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

// --- 登录与授权 Demo --- //
// 登录接口
router.get('/login', authorizationMiddleware, controllers.login)
// 用户信息接口（可以用来验证登录态）
router.get('/user', validationMiddleware, controllers.user)

// --- 图片上传 Demo --- //
// 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中
router.post('/upload', controllers.upload)

// --- 信道服务接口 Demo --- //
// GET  用来响应请求信道地址的
router.get('/tunnel', controllers.tunnel.get)
// POST 用来处理信道传递过来的消息
router.post('/tunnel', controllers.tunnel.post)

// --- 客服消息接口 Demo --- //
// GET  用来响应小程序后台配置时发送的验证请求
router.get('/message', controllers.message.get)
// POST 用来处理微信转发过来的客服消息
router.post('/message', controllers.message.post)

//获取电影列表
router.get('/movies',controllers.movies.list)

//获取电影详情
router.get('/movies/:id', controllers.movies.detail)

//获取我收藏的影评
router.get('/getStarMark', validationMiddleware, controllers.getStarMark.user_star_comment)

//添加评论
router.post('/comments', validationMiddleware, controllers.comments.add)

//根据电影id获取评论
router.get('/comments/:id', controllers.comments.getCommentOfMovie)

//根据评论id获取评论
router.get('/getCommentByCommentId/:id', controllers.getCommentByCommentId.getCommentByCommentId)

//根据id收藏评论
router.post('/mark', validationMiddleware, controllers.mark.mark_comment)

//根据id查询是否被用户收藏过
router.get('/mark/:id', validationMiddleware, controllers.mark.user_is_mark)

//移除收藏
router.post('/removeMark', validationMiddleware, controllers.removeMark.remove_mark_comment)

//获取我的评论
router.get('/getMyComment', validationMiddleware, controllers.getMyComment.my_comment)

module.exports = router
