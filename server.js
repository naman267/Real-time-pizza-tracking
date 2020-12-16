const express=require('express')
const Emitter=require('events')
const app=express()
const ejs=require('ejs')
const expressLayouts=require('express-ejs-layouts')
const path=require('path')
const mongoose=require('mongoose')
const session=require('express-session')
const flash=require('express-flash')
const Mongodbstore=require('connect-mongo')(session)
const PORT=process.env.PORT || 3000;
const passport=require('passport')
//global middlreware

let bodyParser = require('body-parser')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())
//database connection
const url="mongodb://127.0.0.1:27017/pizza";
mongoose.connect(url,{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true,useFindAndModify:false})
const connection=mongoose.connection

connection.once('open',()=>{
    console.log('Established')
}).catch((e)=>{
    console.log('Not')
})


let mongoStore=new Mongodbstore({
    mongooseConnection:connection,
    collection:'sessions'
})
//const eventEmitter=new Emitter()
//app.set('eventEmitter',eventEmitter)
//session
app.use(flash())
app.use(session({
    secret:'thisismysecret',
    resave:false,
    store:mongoStore,
    saveUninitialized:false,
    cookie:{maxAge:1000*60*60*24}
}))

const passportInit=require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use((req,res,next)=>{
    res.locals.session=req.session;
    res.locals.user=req.user;
    next()
})
//app.use(express.urlencoded({ extended:false })); 





//set template engine

app.use(expressLayouts)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')
require('./routes/web')(app)
//global middleware


const server=app.listen(PORT,()=>{
    console.log('Listening on port',PORT)
})
/*const io=require('socket.io')(server)
//socket

io.on('connection',socket=>{
    console.log("user connected",socket.id)
    socket.on('join',(orderId)=>{
        console.log(orderId)
        socket.join(orderId)
    })
})
eventEmitter.on('orderUpdated',(data)=>{
    io.to(`order_${data.id}`).emit('orderUpdated',data)
})
/*eventEmitter.on('orderPlaced',(data)=>{
    io.to('adminRoom').emit('orderPlaced',data)
})*/
