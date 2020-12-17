const sgMail=require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const sendWelcomeEmail=(email,name)=>{
 sgMail.send({ 
  to:email,
  from:'namanb139j@gmail.com',
  subject:'Thanks for Signing up',
  text:` Welcome ${name} 
  Thanks for registring on All-IN-ONE PIZZA 
  Hope You enjoy !!!!!!`
}).then((data)=>{
console.log('Email sent')
}).catch(e=>{
  console.log(e)
})
}



module.exports=sendWelcomeEmail
