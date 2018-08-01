var express = require("express");
var router = express.Router();

//引入nodejs文件系统模块
var fs = require('fs');
//引入uuid模块
var uuid = require('uuid');

router.post('/', function(req, res, next) {
	var baseFilePath = 'public/images/upload/';
	var imgData = req.body.url;
    var name = req.body.name;
    var size = req.body.size;
    var type = req.body.type;
    //过滤data:URL
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');

    //判断是否存在该路径,如果不存在则创建
    if(!fs.existsSync(baseFilePath)){
    	fs.mkdirSync('public/images/upload');	
    }
     
     var fileName = uuid.v1();
     var fileExtension = name.substring(name.lastIndexOf('.') + 1);
     var fullName = fileName+'.'+fileExtension;
     var savePath = baseFilePath+fullName;

    fs.writeFile(savePath, dataBuffer, function(err) {
    	if(err){
    		res.json({err:1,msg:'保存失败',data:''})
    	}else{
    		res.json({err:0,msg:'保存成功',data:''})    	}
    	});
});

module.exports = router;
