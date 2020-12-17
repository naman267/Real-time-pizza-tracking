const Order=require('../../../models/order')
const moment=require('moment')
const orderMail=require('../../../email/order')
function orderController()
{
    return {
        store(req,res)
        { console.log("order aaya")
         const {phone,adderess}=req.body;
            if(!phone || !adderess)
            {
                req.flash('error','All field Required')
                return res.redirect('/cart');
            }
            const order=new Order({
                customerId:req.user._id,
                items:req.session.cart.items,
                phone:phone,
                adderess:adderess

            })

            order.save().then((result)=>{
                Order.populate(result,{path:'customerId'},(err,placedOrder)=>{
                    req.flash('success','Order Placed Succesfully')
                    delete req.session.cart
                    orderMail(req.user.email,req.user.name,result);
                   const eventEmitter=req.app.get('eventEmitter')
                   eventEmitter.emit('orderPlaced',result)
                    return res.redirect('/customer/orders');
                })
                
            }).catch(e=>{
                req.flash('error','Something went wrong')
                return res.redirect('/cart')
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