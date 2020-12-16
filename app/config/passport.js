const localStartegy=require('passport-local')
const User=require('../models/user')
const bcrypt=require('bcrypt') 
function passportInit(passport)
{
  passport.use(new localStartegy({usernameField:'email'},async (email,password,done)=>{

    //check if user exist
    const user=await User.findOne({email:email})
    if(!user)
    {
        return done(null,false,{message:'No user with this email'})
    }
    bcrypt.compare(password,user.password).then(match=>{
       if(match)
       {
           return done(null,user,{message:'Logged in Succesfully'})
       }
       return done(null,false,{message:'Wrong username or password'})
    }).catch(e=>{
        console.log("hello bcrypt")
        return done(null,false,{message:'Some error occured'})
    })



  }))

  passport.serializeUser((user,done)=>{
    done(null,user._id)
})
 passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{
        done(err,user)
    })
})


}
module.exports=passportInit