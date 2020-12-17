constUser=require('../../models/user')
const bcrypt=require('bcrypt')
const passport = require('passport')
const User = require('../../models/user')
const signupMail=require('../../email/signup')

function authController(){
    function _getRedirectedlogin(req)
    {return req.user.role==='admin'?'/admin/orders':'customer/orders'}
    return{
        login(req,res){
            res.render('auth/login')
        },
        register(req,res){
            res.render('auth/register')
        },
        async postRegister(req,res){
        const {Name,password,Email}=req.body
        if(!Name || !Email || !password)
        {
            req.flash('error','All Fields Required')
            req.flash('name',Name)
            req.flash('email',Email)
            return res.redirect('/register')
        }
        User.exists({email:Email},(err,result)=>{
            if(result)
            {
                
            req.flash('error','Email already taken ')
            req.flash('name',Name)
            req.flash('email',Email)
           return  res.redirect('/register')
            }
        })
        const hashed=await bcrypt.hash(password,10)
        const user=new User({
            name:Name,
            email:Email,
            password:hashed
        })
        user.save().then((result)=>{
            signupMail(Email,Name);
            res.redirect('/login')
        }).catch((e)=>{
            req.flash('error','Somethong went wrong')
            return res.redirect('/register')
        })

        console.log("req",req.body)
        },

    postLogin(req,res,next){
         
        //Validation request

        const {password,email}=req.body
        if(!email || !password)
        {
            req.flash('error','All Fields Required')
            req.flash('email',email)
         return res.redirect('/login')
        }

        passport.authenticate('local',(err,user,info)=>{
            if(err)
            {
                req.flash('error',info.message)
                return next(err)
            }
            if(!user)
            {
                req.flash('error',info.message)
                return res.redirect('/login')
            }
            req.logIn(user,(err)=>{
                if(err)
                {
                    req.flash('error',info.message)
                    return next(error)
                }
                return res.redirect(_getRedirectedlogin(req))

            })
        })(req,res,next)
    },
    logout(req,res){
        req.logout()
        return res.redirect('/login')
    }
    }
}
module.exports=authController