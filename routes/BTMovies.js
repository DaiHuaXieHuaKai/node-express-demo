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
var db = require('../database');
var Pron = db.Pron;

//BT吧最新电影
router.get('/newMovies',function(req,res,next){
/*
	先采用walterfall进行最新电影的详细地址获取
	然后再根据获取到的地址采用whilst进行循环抓取详细信息
	*/
	async.waterfall([
		function(callback){
			request('http://www.btba.com.cn/',function(error,response,body){
				if(!error && response.statusCode == 200){
					$ = cheerio.load(body,{decodeEntities: false});
					var array = [];
					$('.year li a').each(function(i,item){
						var object = {
							name:'',
							url :'',
							img :'',
							starring:'',
							director:'',
							type:'',
							area:'',
							grade:'',
							releaseDate:'',
							updateDate:'',
							descripe:'',
							images:[],
							download:[],
						}
						object.name = $(this).attr('title');
						object.url = $(this).attr('href');
						array.push(object);
					})
					callback(null, array);
				}
			})

		}
		], function (err, result) {
			var length = result.length;
			var i = 0;
			async.whilst(
				function() { return i < length; },
				function(callback) {
					i++;
					request(result[i-1].url,function(error,response,body){
						if(!error && response.statusCode == 200){
							$ = cheerio.load(body,{decodeEntities: false});
							var img = $('.l img').attr('src');
							var descripe = $('.detail').text();
							var download_array = [];
							$('.btinfo h3').each(function(i,item){
								var download_info = {url:'',size:'',info:''};
								download_info.url = $(this).find('a').attr('href');
								download_info.size = $(this).find('b').html();
								download_info.info = $(this).find('i').html();
								download_array.push(download_info);
							})
							result[i-1].img = img;
							result[i-1].descripe = descripe;
							result[i-1].download = download_array.slice();
							callback(null, result);
						}
					})								
				},
				function (err, content) {
					res.json({
						data:content
					})
				}
				);
		});
})



//BT吧最新电影
router.get('/new',function(req,res,next){
/*
	先采用walterfall进行最新电影的详细地址获取
	然后再根据获取到的地址采用whilst进行循环抓取详细信息
	*/

    // '',
    // 'recommended',//推荐
    // 'video?o=ht', //热门
    // 'video?o=mv', //观看
    // 'video?o=tr' //评分
	async.waterfall([
		function(callback){
			var options = {
				method:'GET',
				url:'https://www.pornhub.com/video',
				headers:{
					'User-Agent':"Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/532.5 (KHTML, like Gecko) Chrome/4.0.249.0 Safari/532.5"
				},
				Cookie:{
					'platform':'pc',
					'ss':'367701188698225489',
					'bs':'%s',
					'RNLBSERVERID':'ded6699',
					'FastPopSessionRequestNumber':'1',
					'FPSRN':'1',
					'performance_timing':'home', 
					'RNKEY':'40859743*68067497:1190152786:3363277230:1'
				}
			}
			request(options,function(error,response,body){
				if(!error && response.statusCode == 200){
					$ = cheerio.load(body,{decodeEntities: false});
					var array = [];
					$('.search-video-thumbs li').each(function(i,item){
						var object = {
							name:'',//名称
							url :'',//详情地址
							img :'',//图片
							duration:'',//时长
							playUrl:''
						}
						object.name = $(this).find('img').attr('alt');
						object.url = 'https://www.pornhub.com'+$(this).find('a:first-child').attr('href');
						object.img = $(this).find('img').attr('data-mediumthumb');
						object.duration = $(this).find('.duration').html();
						var savePorn = {
							title:object.name,
							image:object.img,
							url:object.url,
							duration:object.duration
						}
						return db.sequelize.transaction(function(t){
							return Pron.create(savePorn,{
								transaction:t
							}).then(function(result){
								console.log(savePorn)
								array.push(savePorn);
							}).catch(function(err){
								console.log("发生错误：" + err);
							});
						})
					})
					console.log("+++++++++++++++++++++++++++++++++++++++++++")
					callback(null, array);
				}
			})

		}
		], function (err, result) {
			res.json({
				data:result
			})



			// var length = result.length;
			// var i = 0;
		// 	async.whilst(
		// 		function() { return i < 2; },
		// 		function(callback) {
		// 			i++;
		// 			var optionsNext = {
		// 				method:'GET',
		// 				url:result[i-1].url,
		// 				headers:{
		// 			'User-Agent':agents[1]//这里可以随机一个请求头
		// 		},
		// 		Cookie:{
		// 			'platform':'pc',
		// 			'ss':'367701188698225489',
		// 			'bs':'%s',
		// 			'RNLBSERVERID':'ded6699',
		// 			'FastPopSessionRequestNumber':'1',
		// 			'FPSRN':'1',
		// 			'performance_timing':'home',
		// 			'RNKEY':'40859743*68067497:1190152786:3363277230:1'
		// 		}
		// 	}
		// 	request(optionsNext,function(error,response,body){
		// 		if(!error && response.statusCode == 200){
		// 			var regExp = /flashvars_.*?=(.*?);\n/; 
		// 			var resultString = body.match(regExp)[1];
		// 			var resultJson = JSON.parse(resultString);

		// 			console.log(resultJson)
		// 			result[i-1].playUrl = resultJson['quality_720p'];
		// 			callback(null, result);
		// 		}
		// 	})								
		// },
		// function (err, content) {
		// 	res.json({
		// 		data:content
		// 	})
		// }
		// );
	});
})


//获取Url
router.get('/getUrl',function(req,res,next){
	var agents = [
	"Mozilla/5.0 (Linux; U; Android 1.6; en-us; SonyEricssonX10i Build/R1AA056) AppleWebKit/528.5  (KHTML, like Gecko) Version/3.1.2 Mobile Safari/525.20.1",
	];
	//https://www.pornhub.com/video?o=ht&page=3
	var options = {
		method:'GET',
		url:'https://www.pornhub.com/view_video.php?viewkey=ph58f72a27e1c83',
		headers:{
					'User-Agent':agents[0]//这里可以随机一个请求头
				},
				Cookie:{
					'platform':'pc',
					'ss':'367701188698225489',
					'bs':'%s',
					'RNLBSERVERID':'ded6699',
					'FastPopSessionRequestNumber':'1',
					'FPSRN':'1',
					'performance_timing':'home',
					'RNKEY':'40859743*68067497:1190152786:3363277230:1'
				}
			}
			request(options,function(error,response,body){
				if(!error && response.statusCode == 200){


                  var regExp = /flashvars_.*?=(.*?);\n/; //未使用g选项   
                  　　              var result = body.match(regExp)[1];


                  var saveUser = {
                  	title:"测试",
                  };
                  db.sequelize.transaction(function(t){
                  	console.log("+++++++++++++++++++");
                  	Pron.create(saveUser,{
                  		transaction:t
                  	}).then(function(result){
                  		res.send(result);
                  	}).catch(function(err){
                  		console.log("发生错误：" + err);
                  	});
                  })

					//$ = cheerio.load(body,{decodeEntities: false});
					// res.json({
					// 	data:JSON.parse(result)
					// })
				}
			})
		})










router.get('/newSub',function(req,res,next){
	var agents = [
	"Mozilla/5.0 (Linux; U; Android 1.6; en-us; SonyEricssonX10i Build/R1AA056) AppleWebKit/528.5  (KHTML, like Gecko) Version/3.1.2 Mobile Safari/525.20.1",
	];
	//https://www.pornhub.com/video?o=ht&page=3
	var options = {
		method:'GET',
		url:'https://www.pornhub.com/view_video.php?viewkey=ph58f72a27e1c83',
		headers:{
					'User-Agent':agents[0]//这里可以随机一个请求头
				},
				Cookie:{
					'platform':'pc',
					'ss':'367701188698225489',
					'bs':'%s',
					'RNLBSERVERID':'ded6699',
					'FastPopSessionRequestNumber':'1',
					'FPSRN':'1',
					'performance_timing':'home',
					'RNKEY':'40859743*68067497:1190152786:3363277230:1'
				}
			}
			request(options,function(error,response,body){
				if(!error && response.statusCode == 200){


                  var regExp = /flashvars_.*?=(.*?);\n/; //未使用g选项   
                  　　              var result = body.match(regExp)[1];


                  var saveUser = {
                  	title:"测试",
                  };
                  return db.sequelize.transaction(function(t){
                  	console.log("+++++++++++++++++++");
                  	return Pron.create(saveUser,{
                  		transaction:t
                  	}).then(function(result){
                  		res.send(result);
                  	}).catch(function(err){
                  		console.log("发生错误：" + err);
                  	});
                  })




					//$ = cheerio.load(body,{decodeEntities: false});
					// res.json({
					// 	data:JSON.parse(result)
					// })
				}
			})
		})


module.exports = router;