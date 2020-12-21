const Order=require('../../../models/order')
const moment=require('moment')
const orderMail=require('../../../email/order')
const stripe=require('stripe')(process.env.STRIPE_PRIVATE_KEY)
function orderController()
{
    return {
        store(req,res)
        { console.log("order aaya")
         const {phone,adderess,stripeToken,paymentType}=req.body;
            if(!phone || !adderess)
            {
               
                return res.status(400).json({message:'All fields required'}) ;
                
                //req.flash('error','All field Required')
                //return res.redirect('/cart');
            }
            const order=new Order({
                customerId:req.user._id,
                items:req.session.cart.items,
                phone:phone,
                adderess:adderess

            })

            order.save().then((result)=>{
                Order.populate(result,{path:'customerId'},(err,placedOrder)=>{
                    //req.flash('success','Order Placed Succesfully')
                     if(paymentType==='card')
                     {
                 stripe.charges.create({
                     amount:req.session.cart.totalPrice*100,
                     source:stripeToken,
                     currency:'inr',
                     description:`Pizza order ${placedOrder._id}`
                 }).then(()=>{
                     placedOrder.paymentStatus=true;
                     placedOrder.paymentType=paymentType;
                     placedOrder.save().then((ord)=>{
                       console.log(ord);
                       const eventEmitter=req.app.get('eventEmitter')
                       eventEmitter.emit('orderPlaced',ord)
                       
                    delete req.session.cart
                    orderMail(req.user.email,req.user.name,result);

                       return res.json({message:'Payment Succesful,Order Placed Succesfully'}) 
                     }).catch(e=>{

                     })
                 }).catch(e=>{
                     console.log(e);
                     
                    delete req.session.cart
                    orderMail(req.user.email,req.user.name,result);

                     return res.json({message:'Order Placed,Payment Not Succesful,You can pay at the time of delievery'}) 
                 })


                  
               
                }
                else{
                    delete req.session.cart;
                    const eventEmitter=req.app.get('eventEmitter')
                    eventEmitter.emit('orderPlaced',placedOrder)
                    

                 orderMail(req.user.email,req.user.name,result);
                  return   res.json({message:'Order Placed Succesfully'}) 

                }
                   //return res.redirect('/customer/orders');
                })
                
            }).catch(e=>{
              //  req.flash('error','Something went wrong')
                //return res.redirect('/cart')
                return res.status(500).json({message:'Something Went wrong'}) 
            })
        },
        async index(req,res)
        {
           const orders=await Order.find({customerId:req.user._id},null,{sort:{'createdAt':-1}})
          // console.log(orders)
           res.header('Cache-Control', 'no-store')
           return res.render('./customers/orders',{orders:orders,moment:moment})
        
        },
        async show(req,res){
            const order=await Order.findById(req.params.id);
            //Authorize
            if(req.user._id.toString()===order.customerId.toString())
            {
                return res.render('customers/singleOrder',{order})
            }
            res.redirect('/')

        }
    }
}
module.exports=orderController