const sgMail=require('@sendgrid/mail')
const apikey='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';
sgMail.setApiKey(apikey)
let totalPrice=0;
function renderItems(items) {
    let parsedItems = Object.values(items)
    
    return parsedItems.map((menuItem) => {
        totalPrice=totalPrice+menuItem.item.price;
        return `
            ${ menuItem.item.name } - ${ menuItem.qty } pcs 
        `
    }).join('')
  }

const sendOrderEmail=(email,name,order)=>{

 sgMail.send({ 
  to:email,
  from:'namanb139j@gmail.com',
  subject:'Thanks for Ordering ',
  text:` Thanks ${name}  for ordering 
  Your order Id-
  ${order._id}
  
  Your Order Details-

  ${renderItems(order.items)}
  Your Final Price-
  Rs-${totalPrice}
  `
}).then((data)=>{
console.log('Email sent')
}).catch(e=>{
  console.log(e)
})
}



module.exports=sendOrderEmail