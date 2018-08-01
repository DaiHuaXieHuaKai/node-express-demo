var express = require("express");
var router = express.Router();

//网络请求模块
var request = require("request");
var fs = require("fs");
//将html代码转为jquery可以解析的模块
var cheerio = require("cheerio");
//转换编码模块
var iconv = require("iconv-lite");
//异步模块---walterfall和whilst
var async = require("async");
var db = require('../database');
var NineOne = db.NineOne;






var proxys = [];  //保存从网站上获取到的代理
var useful = [];  //保存检查过有效性的代理


//获取国内代理地址
router.get('/proxy',function(req,res,next){
    url = "http://www.xicidaili.com/nn";  // 国内高匿代理
    request ({
      url: url,
      method: "GET",
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36'
        } //给个浏览器头，不然网站拒绝访问
      }, function(error, response, body) {
        if(!error) {
          var $ = cheerio.load(body,{decodeEntities: false});
          var trs = $("#ip_list tr");
          for(var i=1;i<trs.length;i++) {
            var proxy = {};
            tr = trs.eq(i);
            tds = tr.children("td");
            proxy['ip'] = tds.eq(1).text();
            proxy['port'] = tds.eq(2).text();
            proxys.push(proxy);
          }
        }
        check();
      });
  })
/**
 * 过滤无效的代理
 */
 function check() {
    //尝试请求百度的静态资源公共库中的jquery文件
    var url = "https://www.pornhub.com/";
    var flag = proxys.length;  //检查是否所有异步函数都执行完的标志量
    for(var i=0;i<proxys.length;i++) {
      var proxy = proxys[i];
      request({
        url: url,
        proxy: "http://"+proxy['ip']+':'+proxy['port'],
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36'
        }, //给个浏览器头，不然网站拒绝访问
            timeout: 20000  //20s没有返回则视为代理不行
          }, function (error, response, body) {
            if(!error) {
              if (response.statusCode == 200) {
                    //这里因为nodejs的异步特性，不能push(proxy),那样会存的都是最后一个
                    useful.push(response.request['proxy']['href']);
                  } else {
                    //console.log(response.request['proxy']['href'], "failed!");
                  }
                } else {
                //console.log("One proxy failed!");
              }
              flag--;
              if (flag == 0) {
                console.log(useful)
                //saveProxys();
              }
            });
    }
  }

/**
 * 把获取到的有用的代理保存成json文件，以便在别处使用
 */
 function saveProxys() {
  fs.writeFileSync("proxys.json", JSON.stringify(useful));
  console.log("Save finished!");
}

















//通过复制postman的请求返回页面抓取91数据
router.get('/save',function(req,res,next){
  var body = `



  `
  $ = cheerio.load(body,{decodeEntities: false});
  $('#videobox .listchannel').each(function(i,item){
    var object = {
              title:'',//名称
              url :'',//详情地址
              image :'',//图片
              duration:'',//时长
            }
            object.title = $(this).find('div:first-child').find('a').find('img').attr('title');
            object.url = $(this).find('div:first-child').find('a').attr('href');
            object.image = $(this).find('div:first-child').find('a').find('img').attr('src'); 
            var node = $(this).find('span.info').eq(0);
            object.duration = node[0].nextSibling.nodeValue.trim();
            return db.sequelize.transaction(function(t){
              return NineOne.create(object,{
                transaction:t
              }).then(function(result){
                    res.json({
                      data:"保存成功"
                    })
              }).catch(function(err){
                console.log("发生错误：" + err);
              });
            })
          })
})


















//抓取91数据
router.get('/watch',function(req,res,next){
  console.log("enter")
  var page = 1;
  var options = {
    method:'GET',
    proxy: "http://116.226.90.12:808",
    url:'http://www.91porn.com/v.php?next=watch'+'&page='+31,
    headers:{
     'User-Agent':"Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/532.5 (KHTML, like Gecko) Chrome/4.0.249.0 Safari/532.5"
   },
   Cookie:{
     '__cfduid':'dc40643cdcf6969812843f75f592284761495069578',

     'CLIPSHARE':'h75s326c2ilo4m1hbs06ks0dh4',

     'show_msg':1

   }
 }
 request(options,function(error,response,body){
  if(!error && response.statusCode == 200){
    console.log(body)
    $ = cheerio.load(body,{decodeEntities: false});
    $('#videobox .listchannel').each(function(i,item){
      var object = {
							title:'',//名称
							url :'',//详情地址
							image :'',//图片
							duration:'',//时长
						}
						object.title = $(this).find('div:first-child').find('a').find('img').attr('title');
						object.url = $(this).find('div:first-child').find('a').attr('href');
						object.image = $(this).find('div:first-child').find('a').find('img').attr('src'); 
            var node = $(this).find('span.info').eq(0);
            object.duration = node[0].nextSibling.nodeValue.trim();
            return db.sequelize.transaction(function(t){
              return NineOne.create(object,{
                transaction:t
              }).then(function(result){

              }).catch(function(err){
                console.log("发生错误：" + err);
              });
            })
          })
  }
})
})




//获取播放地址
router.get('/getplay/:id/:type',function(req,res,next){
 if(req.params.type){
  if(req.params.type=='nineone'){
   NineOne.findOne({where:{id:req.params.id}}).then(function(data){
    res.json({
      quality_240:data.quality_240,
      quality_480:data.quality_240,
      quality_720:data.quality_240,
    })
     //getSet(data.url,data.id,res)
   }) 
 }
}else{

}
})



//自动获取播放地址
router.get('/autogetplay',function(req,res,next){
  console.log("enter")
  var id = 11;
  // setInterval(function(){
    // id++;
    NineOne.findOne({where:{id:id}}).then(function(data){
      getSetAuto(data.url,data.id,res)
    }) 
  // },1000*10)


})


function getSetAuto(url,id,res){
  var options = {
    method:'GET',
    url:url,
    headers:{
      'User-Agent':"Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/532.5 (KHTML, like Gecko) Chrome/4.0.249.0 Safari/532.5"
    },
    Cookie:{
      '__cfduid':'da18bf8589a1f068d3ef101567014dfab1493994149',

      'CLIPSHARE':'irg22ok5vk7f3oo2g1cacj51v1',

      'show_msg':3,

      'evercookie_cache':'undefined',

      'evercookie_etag':'undefined',

      '91username':'daihuaxiehuakai',

      'DUID':'b858WAiP2FshjZVx%2BKes9oe4NVhmvAjpmwqnz01H5svTs9%2Fy',

      'USERNAME':'bf35RFRpVnmrAbzo1jpkBoY5AVQpt6hv3KwOx8vh%2B9KM3X%2F93sascgOwFKk',

      'user_level':1,

      'EMAILVERIFIED':'no', 
      'level':1,

      'watch_times':1,

      '__utma':'50351329.159317400.1493994437.1493994437.1493994437.1',

      '__utmb':'50351329.0.10.1493994437',

      '__utmc':'50351329',

      '__utmz':'50351329.1493994437.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)',

    }
  }
  request(options,function(error,response,body){
   if(!error && response.statusCode == 200){
    $ = cheerio.load(body,{decodeEntities: false});
    var src = $('source').attr('src');
    var updateData = {
     quality_240:src,
     quality_480:src,
     quality_720:src
   };
   return db.sequelize.transaction(function(t){
    return NineOne.update(updateData,{
     transaction:t,
     where:{id:id}
   }).then(function(result){
    console.log('更新成功');
  }).catch(function(err){
   console.log("发生错误：" + err);
 });
})
 }
})
}




function getSet(url,id,res){
  var options = {
    method:'GET',
    url:url,
    headers:{
      'User-Agent':"Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/532.5 (KHTML, like Gecko) Chrome/4.0.249.0 Safari/532.5"
    },
    Cookie:{
      '__cfduid':'d72d644558bd27ee4e4c6b94f939e44841491057579',
      'CLIPSHARE':'0r8sg33vmje81akedsjjl0dd47',
      'show_msg':'1',
      'watch_times':'1',
      '__utma':'50351329.377688248.1491057578.1491057578.1493911409.2',
      '__utmb':'50351329.0.10.1493911409',
      '__utmc':'50351329', 
      '__utmz':'50351329.1493911409.2.2.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided)',
      'AJSTAT_ok_pages':'5',
      'AJSTAT_ok_times':'2',
      'language':'cn_CN'
    }
  }
  request(options,function(error,response,body){
   if(!error && response.statusCode == 200){
    $ = cheerio.load(body,{decodeEntities: false});
    var src = $('source').attr('src');
    var updateData = {
     quality_240:src,
     quality_480:src,
     quality_720:src
   };
   return db.sequelize.transaction(function(t){
    return NineOne.update(updateData,{
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
})
}

//获取列表
router.get('/getall/:page/:type',function(req,res,next){
  if(req.params.type){
    if(req.params.type=='nineone'){
      db.sequelize.query('select * from tb_nineone order by rand() limit 20',{ type: db.sequelize.QueryTypes.SELECT }).then(function(results){
       res.json({
        data:results
      })
     })
     //  NineOne.findAll({offset:req.params.page*200,limit:200}).then(function(data){
     //   res.json({
     //    data:data
     //  })
     // }) 
   }
 }else{

 }
})

module.exports = router;