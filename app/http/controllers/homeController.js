const mongoose=require('mongoose')
const menu=require('../../models/menu')

function homeController(){
    return {
        index(req,res){
            menu.find().then((pizzas)=>{
                
                res.render('home',{pizzas:pizzas,counter:req.session.cart.totalQty})
            }).catch((e)=>{
                console.log('Not found empty')
            })
           
        }
    }
}
module.exports=homeController