const sgMail=require('@sendgrid/mail')
const apikey='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';
sgMail.setApiKey(apikey)
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
