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
var Porn = db.Porn;
var PornHot = db.PornHot;
var PornView = db.PornView;
var PornRate = db.PornRate;

// router.get('/porn',function(req,res,next){
// /*
// 	先采用walterfall进行最新电影的详细地址获取
// 	然后再根据获取到的地址采用whilst进行循环抓取详细信息
// 	*/

//     // '',
//     // 'recommended',//推荐
//     // 'video?o=ht', //热门
//     // 'video?o=mv', //观看
//     // 'video?o=tr' //评分

//     var page = 0;
//     setInterval(function(){
//     	page++;
//     	async.waterfall([
//     		function(callback){
//     			var options = {
//     				method:'GET',
//     				url:'https://www.pornhub.com/video?'+'page='+page,
//     				headers:{
//     					'User-Agent':"Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/532.5 (KHTML, like Gecko) Chrome/4.0.249.0 Safari/532.5"
//     				},
//     				Cookie:{
//     					'platform':'pc',
//     					'ss':'367701188698225489',
//     					'bs':'%s',
//     					'RNLBSERVERID':'ded6699',
//     					'FastPopSessionRequestNumber':'1',
//     					'FPSRN':'1',
//     					'performance_timing':'home', 
//     					'RNKEY':'40859743*68067497:1190152786:3363277230:1'
//     				}
//     			}
//     			request(options,function(error,response,body){
//     				if(!error && response.statusCode == 200){
//     					$ = cheerio.load(body,{decodeEntities: false});
//     					var array = [];
//     					$('.search-video-thumbs li').each(function(i,item){
//     						var object = {
// 							title:'',//名称
// 							url :'',//详情地址
// 							image :'',//图片
// 							duration:'',//时长
// 						}
// 						object.title = $(this).find('img').attr('alt');
// 						object.url = 'https://www.pornhub.com'+$(this).find('a:first-child').attr('href');
// 						object.image = $(this).find('img').attr('data-mediumthumb');
// 						object.duration = $(this).find('.duration').html();
// 						return db.sequelize.transaction(function(t){
// 							return Porn.create(object,{
// 								transaction:t
// 							}).then(function(result){
// 								array.push(object);
// 							}).catch(function(err){
// 								console.log("发生错误：" + err);
// 							});
// 						})
// 					})
//     					console.log("+++++++++++++++++++++++++++++++++++++++++++")
//     					callback(null, array);
//     				}
//     			})

//     		}
//     		], function (err, result) {
//     			// res.json({
//     			// 	data:result
//     			// })
//     		});
//     },30*1000)
// })

// router.get('/pornhot',function(req,res,next){    
//     var page = 0;
//     setInterval(function(){
//     	page++;
//     	async.waterfall([
//     		function(callback){
//     			var options = {
//     				method:'GET',
//     				url:'https://www.pornhub.com/video?o=ht&page='+page,
//     				headers:{
//     					'User-Agent':"Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/532.5 (KHTML, like Gecko) Chrome/4.0.249.0 Safari/532.5"
//     				},
//     				Cookie:{
//     					'platform':'pc',
//     					'ss':'367701188698225489',
//     					'bs':'%s',
//     					'RNLBSERVERID':'ded6699',
//     					'FastPopSessionRequestNumber':'1',
//     					'FPSRN':'1',
//     					'performance_timing':'home', 
//     					'RNKEY':'40859743*68067497:1190152786:3363277230:1'
//     				}
//     			}
//     			request(options,function(error,response,body){
//     				if(!error && response.statusCode == 200){
//     					$ = cheerio.load(body,{decodeEntities: false});
//     					var array = [];
//     					$('.search-video-thumbs li').each(function(i,item){
//     						var object = {
// 							title:'',//名称
// 							url :'',//详情地址
// 							image :'',//图片
// 							duration:'',//时长
// 						}
// 						object.title = $(this).find('img').attr('alt');
// 						object.url = 'https://www.pornhub.com'+$(this).find('a:first-child').attr('href');
// 						object.image = $(this).find('img').attr('data-mediumthumb');
// 						object.duration = $(this).find('.duration').html();
// 						return db.sequelize.transaction(function(t){
// 							return PornHot.create(object,{
// 								transaction:t
// 							}).then(function(result){
// 								array.push(object);
// 							}).catch(function(err){
// 								console.log("发生错误：" + err);
// 							});
// 						})
// 					})
//     					console.log("+++++++++++++++++++++++++++++++++++++++++++")
//     					callback(null, array);
//     				}
//     			})

//     		}
//     		], function (err, result) {
//     			// res.json({
//     			// 	data:result
//     			// })
//     		});
//     },3*1000)
// })


// router.get('/pornview',function(req,res,next){    
//     var page = 0;
//     setInterval(function(){
//     	page++;
//     	async.waterfall([
//     		function(callback){
//     			var options = {
//     				method:'GET',
//     				url:'https://www.pornhub.com/video?o=mv&page='+page,
//     				headers:{
//     					'User-Agent':"Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/532.5 (KHTML, like Gecko) Chrome/4.0.249.0 Safari/532.5"
//     				},
//     				Cookie:{
//     					'platform':'pc',
//     					'ss':'367701188698225489',
//     					'bs':'%s',
//     					'RNLBSERVERID':'ded6699',
//     					'FastPopSessionRequestNumber':'1',
//     					'FPSRN':'1',
//     					'performance_timing':'home', 
//     					'RNKEY':'40859743*68067497:1190152786:3363277230:1'
//     				}
//     			}
//     			request(options,function(error,response,body){
//     				if(!error && response.statusCode == 200){
//     					$ = cheerio.load(body,{decodeEntities: false});
//     					var array = [];
//     					$('.search-video-thumbs li').each(function(i,item){
//     						var object = {
// 							title:'',//名称
// 							url :'',//详情地址
// 							image :'',//图片
// 							duration:'',//时长
// 						}
// 						object.title = $(this).find('img').attr('alt');
// 						object.url = 'https://www.pornhub.com'+$(this).find('a:first-child').attr('href');
// 						object.image = $(this).find('img').attr('data-mediumthumb');
// 						object.duration = $(this).find('.duration').html();
// 						return db.sequelize.transaction(function(t){
// 							return PornView.create(object,{
// 								transaction:t
// 							}).then(function(result){
// 								array.push(object);
// 							}).catch(function(err){
// 								console.log("发生错误：" + err);
// 							});
// 						})
// 					})
//     					console.log("+++++++++++++++++++++++++++++++++++++++++++")
//     					callback(null, array);
//     				}
//     			})

//     		}
//     		], function (err, result) {
//     			// res.json({
//     			// 	data:result
//     			// })
//     		});
//     },3*1000)
// })



// router.get('/pornrate',function(req,res,next){    
//     var page = 0;
//     setInterval(function(){
//     	page++;
//     	async.waterfall([
//     		function(callback){
//     			var options = {
//     				method:'GET',
//     				url:'https://www.pornhub.com/video?o=tr&page='+page,
//     				headers:{
//     					'User-Agent':"Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/532.5 (KHTML, like Gecko) Chrome/4.0.249.0 Safari/532.5"
//     				},
//     				Cookie:{
//     					'platform':'pc',
//     					'ss':'367701188698225489',
//     					'bs':'%s',
//     					'RNLBSERVERID':'ded6699',
//     					'FastPopSessionRequestNumber':'1',
//     					'FPSRN':'1',
//     					'performance_timing':'home', 
//     					'RNKEY':'40859743*68067497:1190152786:3363277230:1'
//     				}
//     			}
//     			request(options,function(error,response,body){
//     				if(!error && response.statusCode == 200){
//     					$ = cheerio.load(body,{decodeEntities: false});
//     					var array = [];
//     					$('.search-video-thumbs li').each(function(i,item){
//     						var object = {
// 							title:'',//名称
// 							url :'',//详情地址
// 							image :'',//图片
// 							duration:'',//时长
// 						}
// 						object.title = $(this).find('img').attr('alt');
// 						object.url = 'https://www.pornhub.com'+$(this).find('a:first-child').attr('href');
// 						object.image = $(this).find('img').attr('data-mediumthumb');
// 						object.duration = $(this).find('.duration').html();
// 						return db.sequelize.transaction(function(t){
// 							return PornRate.create(object,{
// 								transaction:t
// 							}).then(function(result){
// 								array.push(object);
// 							}).catch(function(err){
// 								console.log("发生错误：" + err);
// 							});
// 						})
// 					})
//     					console.log("+++++++++++++++++++++++++++++++++++++++++++")
//     					callback(null, array);
//     				}
//     			})

//     		}
//     		], function (err, result) {
//     			// res.json({
//     			// 	data:result
//     			// })
//     		});
//     },3*1000)
// })

//获取播放地址
router.get('/getplay/:id/:type',function(req,res,next){
	if(req.params.type){
		if(req.params.type=='all'){
			Porn.findOne({where:{id:req.params.id}}).then(function(data){
				getSet(data.url,data.id,req.params.type,res)
			}) 
		}
		if(req.params.type=='hot'){
			PornHot.findOne({where:{id:req.params.id}}).then(function(data){
				getSet(data.url,data.id,req.params.type,res)
			}) 
		}
		if(req.params.type=='view'){
			PornView.findOne({where:{id:req.params.id}}).then(function(data){
				getSet(data.url,data.id,req.params.type,res)
			}) 
		}
		if(req.params.type=='rate'){
			PornRate.findOne({where:{id:req.params.id}}).then(function(data){
				getSet(data.url,data.id,req.params.type,res)
			}) 
		}
	}else{

	}
})





function getSet(url,id,type,res){
	var options = {
		method:'GET',
		url:url,
		headers:{
                 'User-Agent':"Mozilla/5.0 (Linux; U; Android 1.6; en-us; SonyEricssonX10i Build/R1AA056) AppleWebKit/528.5  (KHTML, like Gecko) Version/3.1.2 Mobile Safari/525.20.1"//这里可以随机一个请求头
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
                  var result = JSON.parse(body.match(regExp)[1]);
                  var updateData = {
                  	quality_240:result.quality_240p,
                  	quality_480:result.quality_480p,
                  	quality_720:result.quality_720p
                  };

                  if(type=='all'){
                  	return db.sequelize.transaction(function(t){
                  		return Porn.update(updateData,{
                  			transaction:t,
                  			where:{id:id}
                  		}).then(function(result){
                  			res.json({
                  				quality_240:updateData.quality_240,
                  				quality_480:updateData.quality_480,
                  				quality_720:updateData.quality_720
                  			})
                  		}).catch(function(err){
                  			console.log("发生错误：" + err);
                  		});
                  	})
                  }
                  if(type=='hot'){
                  	return db.sequelize.transaction(function(t){
                  		return PornHot.update(updateData,{
                  			transaction:t,
                  			where:{id:id}
                  		}).then(function(result){
                  			res.json({
                  				quality_240:updateData.quality_240,
                  				quality_480:updateData.quality_480,
                  				quality_720:updateData.quality_720
                  			})
                  		}).catch(function(err){
                  			console.log("发生错误：" + err);
                  		});
                  	})
                  }
                  if(type=='view'){
                  	return db.sequelize.transaction(function(t){
                  		return PornView.update(updateData,{
                  			transaction:t,
                  			where:{id:id}
                  		}).then(function(result){
                  			res.json({
                  				quality_240:updateData.quality_240,
                  				quality_480:updateData.quality_480,
                  				quality_720:updateData.quality_720
                  			})
                  		}).catch(function(err){
                  			console.log("发生错误：" + err);
                  		});
                  	})
                  }
                  if(type=='rate'){
                  	return db.sequelize.transaction(function(t){
                  		return PornRate.update(updateData,{
                  			transaction:t,
                  			where:{id:id}
                  		}).then(function(result){
                  			res.json({
                  				quality_240:updateData.quality_240,
                  				quality_480:updateData.quality_480,
                  				quality_720:updateData.quality_720
                  			})
                  		}).catch(function(err){
                  			console.log("发生错误：" + err);
                  		});
                  	})
                  }
                }
              })
          }

//获取列表
router.get('/getall/:page/:type',function(req,res,next){
	if(req.params.type){
		if(req.params.type=='all'){
      db.sequelize.query('select * from tb_porn order by rand() limit 20',{ type: db.sequelize.QueryTypes.SELECT }).then(function(results){
       res.json({
        data:results
      })
     })
			// Porn.findAll({offset:req.params.page*20,limit:20}).then(function(data){
			// 	res.json({
			// 		data:data
			// 	})
			// }) 
		}
		if(req.params.type=='hot'){
      db.sequelize.query('select * from tb_porn_hot order by rand() limit 20',{ type: db.sequelize.QueryTypes.SELECT }).then(function(results){
       res.json({
        data:results
      })
     })
			// PornHot.findAll({offset:req.params.page*20,limit:20}).then(function(data){
			// 	res.json({
			// 		data:data
			// 	})
			// }) 
		}
		if(req.params.type=='view'){
      db.sequelize.query('select * from tb_porn_view order by rand() limit 20',{ type: db.sequelize.QueryTypes.SELECT }).then(function(results){
       res.json({
        data:results
      })
     })
			// PornView.findAll({offset:req.params.page*20,limit:20}).then(function(data){
			// 	res.json({
			// 		data:data
			// 	})
			// }) 
		}
		if(req.params.type=='rate'){
      db.sequelize.query('select * from tb_porn_rate order by rand() limit 20',{ type: db.sequelize.QueryTypes.SELECT }).then(function(results){
       res.json({
        data:results
      })
     })
			// PornRate.findAll({offset:req.params.page*20,limit:20}).then(function(data){
			// 	res.json({
			// 		data:data
			// 	})
			// }) 
		}
	}else{

	}
})

module.exports = router;