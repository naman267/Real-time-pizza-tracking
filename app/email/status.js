const sgMail=require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const sendStatusEmail=(email,name,orderId,status)=>{
    console.log("emaill status")
 sgMail.send({ 
  to:email,
  from:'namanb139j@gmail.com',
  subject:'Status Changed',
  text:` ${name} 
  Status of your order with OrderId-${orderId}
  has been changed to-${status} 
  Hope You enjoy !!!!!!`
}).then((data)=>{
console.log('Email sent')
}).catch(e=>{
  console.log(e)
})
}



module.exports=sendStatusEmail
