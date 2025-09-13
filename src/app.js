const express=require("express")
const authroutes=require("./routes/auth.routes")
const app=express();
const cookieParser = require("cookie-parser");
app.use(express.json())

app.use(cookieParser())
app.use('/auth',authroutes);
module.exports=app