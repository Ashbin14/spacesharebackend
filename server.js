require('dotenv').config();

const mongoose=require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/Spaceshare-backend-apis")//ip and port
const express=require('express');
const app= express();


app.set('view engine','ejs');
app.set('views','./views');

const port=process.env.SERVER_PORT | 3000;
const userRoute=require('./routes/userRoute');
const { userRegister } = require('./controllers/userController');

app.use('/api',userRoute);
const flatRoutes = require('./routes/flatRoute');
app.use('/api',flatRoutes);

const flatmateSearch=require('./routes/similarSearchRoute');
app.use('/api',flatmateSearch);

const formInputRoutes = require('./routes/formInputRoutes');
app.use('/api/form-inputs', formInputRoutes);

const userProfileRoutes = require('./routes/userprofileRoute');
app.use('/api/profiles', userProfileRoutes);
// const authRoute=require('./routes/authRoute');
// app.use('/',authRoute);

app.listen(port ,function(){
    console.log("server listen on port "+ port);
});

