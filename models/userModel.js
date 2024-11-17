const mongoose = require('mongoose');

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    moblie:{
        type:String,
        require:true,
        match: /^[0-9]{10}$/, 
    },
    password:{
        type:String,
        require:true
    },
    is_verified:{
        type:Number,
        default:0
    },
    image:{
        type:String,
        require:false
    },
    userType:{
        type:String,
        enum: ['Tennent', 'Flatfinder','RoomMatefinder'],
        default:'Tennent',
        required:true,
    },
    personalityscore:{
        type:Number,
        required:function(){
            return this.userType=='RoomMatefinder';
        }
    },
    personalitytype:{
        type:String,
        required:function(){
            return this.userType=='RoomMatefinder';
        }
    }

});

module.exports=mongoose.model("User",userSchema);