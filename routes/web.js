const homeController=require('../app/http/controllers/homeController')
const authController=require('../app/http/controllers/authController')
const cartController=require('../app/http/controllers/customers/cartController')
const orderController=require('../app/http/controllers/customers/orderController')
const AdminorderController=require('../app/http/controllers/admin/orderController')
const statusController=require('../app/http/controllers/admin/statusController')
let bodyParser = require('body-parser')
let urlencodedParser = bodyParser.urlencoded({ extended: false })
const guest=require('../app/http/middlewares/guest')
const auth=require('../app/http/middlewares/auth')
const admin=require('../app/http/middlewares/admin')
function initRoutes(app)
{
    app.get('/',homeController().index)
    app.get('/cart',cartController().index)
    app.get('/login',guest,authController().login )
    app.post('/login',authController().postLogin )
    app.post('/logout',authController().logout)
    app.get('/register',guest,authController().register)
    app.post('/register',urlencodedParser ,authController().postRegister)
    app.post('/update-cart',cartController().update)
   //customer controller
    app.post('/orders',auth,orderController().store)//To give a new order and store the order
    //To get the info of al the orders of the registered user
    app.get('/customer/orders',auth,orderController().index)
    app.get('/customer/orders/:id',auth,orderController().show)

    //Admin
    app.get('/admin/orders',admin,AdminorderController().index)
    app.post('/admin/order/status',admin,statusController().update)
}
module.exports=initRoutes