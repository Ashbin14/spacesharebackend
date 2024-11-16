const express=require('express');
const router=express();

router.use(express.json());

const path=require('path');
const multer=require("multer");

const storage =multer.diskStorage({
    destination:function(req,files,cb){
            cb(null,path.join(__dirname,'../public/images'));
        
        
    },
    filename:function(req,file,cb){
        const name = Date.now()+"-"+file.originalname;
        cb(null,name);
    }
});

const upload=multer({
    storage:storage,
    
});

const userController=require('../controllers/userController');

const{registerValidator,sendMailVerificaitonValidator}=require('../helpers/validation');
const res = require('express/lib/response');

router.post('/register',upload.single('image'),registerValidator,userController.userRegister);

//router.post('/send-mail-verificaiton',sendMailVerificaitonValidator,userController.sendMailVerificaiton);

module.exports = router;