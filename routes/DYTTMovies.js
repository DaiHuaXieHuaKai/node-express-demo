var express = require("express");
var router = express.Router();

//网络请求模块
var request = require("request");
//将html代码转为jquery可以解析的模块
var cheerio = require("cheerio");
//转换编码模块
var iconv = require("iconv-lite");
//异步模块---walterfall和whilst
var async = require("async");

//BT吧最新电影
router.get('/dyttMovies',function(req,res,next){
request({url:'http://www.dytt8.net/index.htm',encoding: null},function(error,response,body){
		if(!error && response.statusCode == 200){
			//进行gb2312的转码
			var html = iconv.decode(body, 'gb2312')
			$ = cheerio.load(html,{decodeEntities: false});
			var arr = [];
			$('.co_content2 ul a').each(function(i,item){
				arr.push({name:$(this).html(),href:$(this).attr('href')})
			})
			res.json({
				data:arr
			})
		}
	})
})
module.exports = router;




