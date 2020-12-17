const Order=require('../../../models/order')
const orderStatus=require('../../../email/status')
function statusController()
{
return {
    update(req,res)
    {
      Order.updateOne({_id:req.body.orderId},{status:req.body.status},(err,data)=>{
      Order.findById(req.body.orderId,(err,result)=>{
        Order.populate(result,{path:'customerId'},(err,result1)=>{
          console.log("result1",result1)
          orderStatus(result1.customerId.email,result1.customerId.name,req.body.orderId,req.body.status)
        })
       
         if(err)
         {
           console.log(err)
         }
       
      })
      if(err)
      {
        return   res.redirect('/admin/orders')
      }
      //eventEmitter
      //orderStatus(data.customerId.email,data.customerId.name,req.body.orderId,req.body.status)
      const eventEmitter=req.app.get('eventEmitter')
      eventEmitter.emit('orderUpdated',{id:req.body.orderId,status:req.body.status})
      
      return res.redirect('/admin/orders')

  })
}
}
}
module.exports=statusController