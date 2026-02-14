require("dotenv").config();
const express = require("express");

const User = require("./models/user");
const cookieParser = require("cookie-parser");
const ConnectDB = require("./config/database");
const cors = require("cors");

const app = express();
require("./utils/cronjob");


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

const appRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");


app.use("/", appRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);


ConnectDB().then( () =>{
    console.log("connected db");

    app.listen(3000, ()=>{
    console.log("running fine on 3000");
    
})
    
}).catch((err) =>{
    console.error("not connected");
})

