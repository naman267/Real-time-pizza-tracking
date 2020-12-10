const express=require('express')
const app=express()
const ejs=require('ejs')
const expressLayouts=require('express-ejs-layouts')
const path=require('path')
const mongoose=require('mongoose')
const session=require('express-session')
const flash=require('express-flash')
const Mongodbstore=require('connect-mongo')(session)
const PORT=process.env.PORT || 3000
app.use(express.static('public'))
//database connection
const url="mongodb://127.0.0.1:27017/pizza";
mongoose.connect(url,{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true,useFindAndModify:false})
const connection=mongoose.connection
app.use(express.json())
connection.once('open',()=>{
    console.log('Established')
}).catch((e)=>{
    console.log('Not')
})
let mongoStore=new Mongodbstore({
    mongooseConnection:connection,
    collection:'sessions'
})
//session
app.use(flash())
app.use(session({
    secret:'thisismysecret',
    resave:false,
    store:mongoStore,
    saveUninitialized:false,
    cookie:{maxAge:1000*60*60*24}
}))


//set template engine

app.use(expressLayouts)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')
require('./routes/web')(app)

app.listen(PORT,()=>{
    console.log('Listening on port',PORT)
})
