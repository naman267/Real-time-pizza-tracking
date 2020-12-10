//const { update } = require("../../../models/menu")

function cartController(){
    return{
        index(req,res){
            console.log(req.session)
            res.render('customers/cart',{session:req.session,counter:req.session.cart.totalQty})
           },
        update(req,res){
           
             if(!req.session.cart)
             {
                 req.session.cart={
                     items:{},
                     totalQty:0,
                     totalPrice:0
                 }
                
               
             }
            let cart=req.session.cart
            if(!cart.items[req.body._id])
            {
                cart.items[req.body._id]={
                    item:req.body,
                    qty:1
                }
                cart.totalQty+=1;
                cart.totalPrice+=req.body.price
            }
            else
            {
                cart.items[req.body._id].qty+=1;
                cart.totalQty+=1;
                cart.totalPrice+=req.body.price

            }

            res.send({totalQty:req.session.cart.totalQty})
        }

    }
}
module.exports=cartController