const mongoose=require('mongoose')
const menu=require('../../models/menu')

function homeController(){
    return {
        index(req,res){
            menu.find({}).then((pizzas)=>{
                if(!req.session.cart)
                {
                    counter=0;
                }
                else
                {
                    counter=req.session.cart.totalQty;
                }
                res.render('home',{pizzas:pizzas,counter:counter})
            }).catch((e)=>{
                console.log(e)
                console.log('Not found empty')
            })
           
        }
    }
}
module.exports=homeController