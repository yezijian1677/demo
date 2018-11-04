---
title: 小程序侃侃看电影
date: 2018-10-27 10:28:50
tags:
---
##侃侃看电影的开始

 侃侃看电影项目是udacity微信小程序纳米学位的结项设计，udacity给予了绝大部分的设计和功能需求，
 需要去实现它的需求从申请审阅。  
 
 由于Curtains是第一次接触小程序这方面的，也不能说单单小程序吧，算是第一次比较系统的写一个应用，
 因为其他都学的杂七杂八的，没有很多的实际成果，所以写的代码段会很乱。  
 
###页面交互  
![页面交互图](https://i.imgur.com/W1t9RHB.png)

###页面的实现
- [HomePage](https://i.imgur.com/NYKPyrk.png)
- [detail](https://i.imgur.com/NGf5JkL.png)
- [comment_list](https://i.imgur.com/uOYFZrg.png)
- [comment_detail](https://i.imgur.com/TmhwOMc.png)
- [comment_edit](https://i.imgur.com/fFzzY9E.png)
- [comment_preview](https://i.imgur.com/wuPkjky.png)
- [HotPage](https://i.imgur.com/fTa1LHA.png)
- [my_collection](https://i.imgur.com/GAXPRsE.png)
- [my_comment](https://i.imgur.com/hQKFlOg.png)  

总体思路是完成先把页面框架写好，然后慢慢晚上后端的数据以及服务api
####HomePage
[HomePage](https://i.imgur.com/NYKPyrk.png)页面的页面结构很简单，由一个图片的窗口和下方导航栏组成

	<!-- 电影推荐卡 -->
	<view>
	<view class='film-card'>
	  <view bindtap='ToDetail' data-id='{{movieId}}'>
	    <image class='film-img' src='{{movies.image}}'></image>
	    <view class='film-name'>{{movies.title}}</view>
	  </view>
	  <view wx:if='{{comment_array[0] == null}}' class='no-data-text'>
	    此电影尚未有影评
	  </view>
	  <view wx:else>
	    <view class='film-recom' data-comment_id='{{comment_array[0].id}}' bindtap='ToCommentDetail' >
	      <image class='recom-avatar' src='{{comment_array[0].avatar}}'></image>
	      <view class='recom-text'>{{comment_array[0].username}}给你推荐了一部电影</view>
	    </view>
	  </view>
	</view>

	<view class='navigator'>
		<navigator class='navigator1' url='/pages/hot/hot' >
			 <image class='img' src='../../img-mini/hot.svg'></image>
			 <view class='text'>热门</view>
		</navigator>
		<navigator class='navigator1' url='/pages/user/user' >
    		<image class='img' src='../../img-mini/me.svg'></image>
			<view class='text'>我的</view>
		</navigator>
	</view>  

css方面也很简单，主要是用好postion和display以及flex这三个，其他的基本属性由于小程序的即时预览很好修改,电影海报和名字在一个view里绑定了一个函数`todetail`指引向电影详情页面，下方的推荐是从该电影影评里获取的一条评论，也帮了了`todetail`函数，但是是指向到评论详情的，热门指引到热门界面，我的指引到个人界面，部分js函数如下  


#####这里是获取一部随机电影详情的js代码 


	
	//获取电影信息
	getMovieData(){
    	let movieId = Math.floor(Math.random() * (15 - 1) + 2);
    	// console.log(movieId);
    	//获取评论
    	this.getCommentList(movieId);
		 wx.showLoading({
      		title: '影片快速加载中',
   	 });

    qcloud.request({
      url: config.service.movieDetail + movieId,

      success: res => {
        wx.hideLoading();

        let data = res.data;
        
        if(!data.code){
          this.setData({
            movies: data.data,
            movieId
          });
        } else {
          wx.showToast({
            title: '影片加载失败',
          });
        }
      },

      fail: () => {
        wx.hideLoading();
        
        setTimeout(() => {
          wx.showToast({
            title: '影片加载失败',
            icon: 'none'
          });
        })
      },

    }); 
   
  	},

#####获取电影的router config 以及api数据库代码的实现  

	
	
    //获取电影详情
	movieDetail: `${host}/weapp/movies/`,

	//获取电影详情
	router.get('/movies/:id', controllers.movies.detail)

	//电影详情
	detail: async ctx => {
    	let movieId = + ctx.params.id;
    	let movieDetail;
	    if(!isNaN(movieId)){
     		 movieDetail = (await DB.query("SELECT * FROM movies WHERE movies.id = ?",[movieId]))[0];
		} else {
     		 movieDetail = {};
		}

    	ctx.state.data = movieDetail;
	}

至此homepage页面完成了  

####detail  
[detail](https://i.imgur.com/NGf5JkL.png)由上一个界面也就是homepage传来的`movie_id`做参数，也是调用获取详情函数传入指定的参数，获取详细电影的详情，页面由一个介绍详情和按钮组成，都在一个view里 

	<view class='wrapper'>
		<image class='img' src='{{movies_detail.image}}'></image>
		<view class='info-card'>
    	<view class='title'>{{movies_detail.title}}</view>
    	<view class='description'>{{movies_decription_short}}</view>
			 <view class='func-button'>
     		 <view class='button' data-type='view_comment' bindtap='viewOrAdd'>查看影评</view>
      		<view class='button' data-type='add_comment' bindtap='viewOrAdd'>添加影评</view>
		</view>
	</view>
	</view>

css慢慢调试就好，js方面代码基本如上，查看影评和添加影评都是按钮携带电影的一些参数然后使用`wx.navigator()`函数

######部分router, api, js代码

	//添加评论
	router.post('/comments', validationMiddleware, controllers.comments.add)

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
	 * 按钮功能选择 文字0 音频1
	 */
	viewOrAdd(e) {
		let type = e.currentTarget.dataset.type;
		// console.log(type);
		let movieId = this.data.movies_detail.id;
		let imgSrc = this.data.movies_detail.image;
		let title = this.data.movies_detail.title;
		// console.log(movieId);
		let pages = '/pages/';

    switch(type){
      case 'view_comment':
        pages += "comment-list/comment-list?imgSrc="+imgSrc+"&title="+title+"&id="+movieId;
        wx.navigateTo({
          url: pages,
        });
        break;

      case 'add_comment':
        pages += "edit_comment/edit_comment?id=" + movieId;
        wx.showActionSheet({
          itemList: ["文字", "录音"],
          success: res => {
            // console.log(res.tapIndex);
            pages += "&comment_type=" + res.tapIndex;
            console.log(pages);
            wx.navigateTo({
              url: pages,
            });
          }
        });
        break;
    }
	},

添加评论有一个actionsheet选择发布影评的格式，文字和录音， 如果是文字则携带类型type参数为0，录音为1  

####Comment_list  

[comment_list](https://i.imgur.com/uOYFZrg.png)页面是非常间的wx:for生成的影评列表，由电影详情界面传入的`movie_id` 至服务端查询影评

	
	<view class='me-wrapper'>
    <!-- 如果返回无数据 -->
    <view wx:if="{{comment_array.length == 0}}">
      <image src='../../img-mini/order.png' class='no-data-img'></image>
      <view class='no-data-text'>没有评论噢</view>
    </view>

    
    <!-- 如果返回有数据 -->
    <view wx:else>

      <view class='comment-list' wx:for="{{comment_array}}" id='{{item.id}}' bindtap='to_comment_detail' >
        <view class='user'>
          <image class='img' src="{{item.avatar}}"></image>
          <view class='name'>{{item.username}}</view>
        </view>

        <view wx:if="{{item.type === 0}}">
          <view class='comment'>{{item.content}}</view>
        </view>
        <view wx:else>
          <view class='playButton' bindtap='play_record' data-url='{{item.content}}'>
              <image class='play-svg' src='../../img-mini/playNow.svg'></image>
              <view class='play'>播放音频</view>
          </view>
        </view>
        
      </view>
    </view>

    
	</view>
	<navigator class='back2home' url='/pages/home/home'>回到首页</navigator>


#####router ，api, js  

	//根据电影id获取评论
	router.get('/comments/:id', controllers.comments.getCommentOfMovie)

	
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


	 /**
	 * 播放音频
	 */
	play_record(e){
	    let url = e.currentTarget.dataset.url;
	    // console.log(url);
	    let innerAudioContext = wx.createInnerAudioContext();
	    innerAudioContext.src = url;
	    innerAudioContext.play();
	},
 
	
	/**
	 * 获取评论等信息
	 */
	getCommentList(id){
	    wx.showLoading({
	      title: '评论加载中',
	    })
	    qcloud.request({
	      url: config.service.commentOfMovie + id,
	
	      success: res => {
	        wx.hideLoading();
	        console.log(res)
	        let data = res.data;
	        // console.log(data)
	        // console.log(data.data);
	        if (!data.code) {
	          this.setData({
	            comment_array: data.data
	          })
	        } else {
	          wx.showToast({
	            title: '影片加载失败',
	          });
	        }
	      },
	
	      fail: () => {
	        wx.hideLoading();
	
	        setTimeout(() => {
	          wx.showToast({
	            title: '影片加载失败',
	            icon: 'none'
	          });
	        })
	      },
	
	    })
	},


录音调用wx.createInnerAudioContext()监听动作保存好链接当作内容传输到数据库，判别的时候，根据类型判别是文字还是录音，是文字直接显示，若是录音则把内容当作url传入。  

####comment_detail
[comment_detail](https://i.imgur.com/TmhwOMc.png)页面和detail页面等都极为相似  
函数也大同小异，	

		<view class='wrapper'>
	  <image class='img' src='{{imgSrc}}'></image>
	  <view class='info-card'>
	    <view class='title'>{{title}}</view>
	    <view class='description'>
	      <view class='user-info'>
	        <image src='{{comment_detail[0].avatar}}' class='avatar'></image>
	        <view class='mark'>"</view>
	      </view>
	      <view class='user-comment'>
	        <view class='username'>{{comment_detail[0].username}}的影评</view>
	        <view wx:if="{{comment_detail[0].type == 0}}">
	          <view class='comment'>{{comment_detail[0].content}}</view>
	        </view>
	        <view wx:else>
	          <view class='playButton' bindtap='play_record' data-url='{{comment_detail[0].content}}'>
	            <image class='play-svg' src='../../img-mini/playNow.svg'></image>
	            <view class='play'>播放音频</view>
	          </view>
	        </view>
	      </view>
	    </view>
	    <view class='func-button'>
      
	      <view wx:if='{{isMark == 0}}' class='button' data-type='mark_comment' bindtap='markOrAdd'>收藏影评</view>
	      <view wx:else class='button' data-type='mark_comment' bindtap='markOrAdd'>取消收藏</view>
	
	      <view wx:if='{{isComment == 0}}' class='button' data-type='add_comment' bindtap='markOrAdd'>写影评</view>
	      <view wx:else class='button' data-type='add_comment' bindtap='markOrAdd'>我的影评</view>
	    </view>
	  	</view>
	</view>  

######router, js, api 
	
	 //根据评论id获取评论
    getCommentByCommentId: `${host}/weapp/getCommentByCommentId/`,

	//获取我的评论
	router.get('/getMyComment', validationMiddleware, controllers.getMyComment.my_comment)
	
	//查询是否发布过影评
	router.get('/user_is_comment/:id', validationMiddleware, controllers.user_is_comment.user_is_comment)
	
	//查询我的评论的id
	router.get('/query_my_comment_id/:id', validationMiddleware, controllers.query_my_comment_id.my_id)
		
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

	const DB = require("../utils/db.js");

	module.exports = {
	  /**
	  * 查询用户收藏的影评
	  */
	  my_comment: async ctx => {
	    let user = ctx.state.$wxInfo.userinfo.openId;
	    let comments = await DB.query('SELECT movies_comment.id AS `id`, movies_comment.username AS `username`,     movies_comment.avatar AS `avatar`, movies_comment.content AS `content`, movies_comment.type AS `type`, movies.title AS `title`, movies.id AS `movie_id`, movies.image AS `image` FROM movies_comment LEFT JOIN star_comment ON star_comment.comment_id = movies_comment.id LEFT JOIN movies ON movies.id = movies_comment.movie_id WHERE movies_comment.user = ? ORDER BY star_comment.create_time DESC', [user]);
	
	    ctx.state.data = comments;
	  }
	
	}


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



因为页面要判别是否收藏过，或者自己是否由评论，再来判别是要收藏还是读写评论，所以调用的js和api都很多，会比较麻烦  

		/**
	   * 查询用户是否评论过
	   */
	  user_is_comment(id){
	    qcloud.request({
	      url: config.service.user_is_comment + id,
	      login: true,
	      success: res => {
	        console.log("is_comment_query success", res);
	        // console.log(res.data.data[0]['count(*)']);
	        let comment_num = res.data.data[0]['count(*)'];
	        if (comment_num == 0) {
	          this.setData({
	            isComment: 0
	          })
	        } else {
	          this.setData({
	            isComment: 1
	          })
	        }
	      },
	
	      fail: res => {
	        console.log("is_comment_query fail", res);
	      },
	
	    });
	  },
	  /**
	   * 查询我的评论id
	   */
	  my_comment_id(id) {
	    let movieId = this.data.movie_id;
	    qcloud.request({
	      url: config.service.query_my_comment_id + id,
	      login: true,
	      success: res => {
	        console.log("my_comment_query success", res.data.data[0].id);
	        this.setData({
	          my_comment_id: res.data.data[0].id
	        })
	      },
	
	      fail: res => {
	        console.log("my_comment_query fail", res);
	      },
	
	    });
	  },
	/**
	   * 收藏影评
	   */
	  mark_comment(){
	    wx.showLoading({
	      title: '收藏中',
	    });
	    let id = this.data.comment_detail[0].id;
	    // console.log(id);
	    qcloud.request({
	      url: config.service.mark_comment,
	      login: true,
	      method: 'POST',
	      data: {
	        id: id
	      },
	      success: res => {
	
	        wx.hideLoading();
	        wx.showToast({
	          title: '收藏成功',
	        })
	      
	        console.log("mark successfully", res)
	        // console.log(res.data);
	        this.setData({
	          isMark: 1
	        })
	      },
	
	      fail: res => {
	        wx.hideLoading();
	
	        console.log("mark fail", res)
	        setTimeout(() => {
	          wx.showToast({
	            title: '收藏失败',
	            icon: 'none'
	          });
	        })
	      },
	
	    });
	  },
	
	  /**
	   * 移除收藏
	   */
	  remove_mark(){
	    wx.showLoading({
	      title: '取消收藏',
	    });
	    let id = this.data.comment_detail[0].id;
	    // console.log(id);
	    qcloud.request({
	      url: config.service.remove_mark,
	      login: true,
	      method: 'POST',
	      data: {
	        id: id
	      },
	      success: res => {
	
	        wx.hideLoading();
	        wx.showToast({
	          title: '移除成功',
	        })
	
	        console.log("remove_mark successfully", res)
	        // console.log(res.data);
	        this.setData({
	          isMark: 0
	        })
	      },
	
	      fail: res => {
	        wx.hideLoading();
	
	        console.log("remove_mark fail", res)
	        setTimeout(() => {
	          wx.showToast({
	            title: '移除失败',
	            icon: 'none'
	          });
	        })
	      },
	
	    });
	  },
	
	  /**
	   * 判断是否收藏过
	   */
	  isMark(id){
	    // console.log(id)
	    qcloud.request({
	      url: config.service.user_is_mark + id,
	      login: true,
	      success: res => {
	        console.log("query success", res);
	        // console.log(res.data.data[0]['count(*)']);
	        let comment_num = res.data.data[0]['count(*)'];
	        if (comment_num == 0) {
	          this.setData({
	            isMark: 0
	          })
	        } else {
	          this.setData({
	            isMark: 1
	          })
	        }
	      },
	
	      fail: res => {
	        console.log("query fail", res);
	      },
	
	    });
	  },

	 /**
	   * 获取评论详情
	   * 
	   */
	  get_comment_detail(id){
	    // console.log("this is comment",id)
	    wx.showLoading({
	      title: '评论加载中',
	    })
	    qcloud.request({
	      url: config.service.getCommentByCommentId + id,
	
	      success: res => {
	        wx.hideLoading();
	        // console.log("in getcomment detail",res)
	        let data = res.data;
	        // console.log(data)
	        // console.log('thissss',data.data[0].movie_id);
	        let movie_id = data.data[0].movie_id
	        this.my_comment_id(movie_id);
	        if (!data.code) {
	          this.setData({
	            comment_detail: data.data,
	          })
	        } else {
	          wx.showToast({
	            title: '评论加载失败',
	          });
	        }
	      },
	
	      fail: () => {
	        wx.hideLoading();
	
	        setTimeout(() => {
	          wx.showToast({
	            title: '评论加载失败',
	            icon: 'none'
	          });
	        })
	      },
	
	    })
	  },
	
			
#####comment_preview 页面 hot user页面都和上方类似，具体代码查看[github](https://github.com/yezijian1677/demo/tree/demo/miniMovies "Github")

因为都没什么营养，都是把整个小电影分割成几个块完成的，没有什么太大的想法，于是不想写的太详尽。共勉

by CurtainsYe