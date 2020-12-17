const sgMail=require('@sendgrid/mail')
const apikey='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';
sgMail.setApiKey(apikey)
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
