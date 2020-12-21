import axios from 'axios'
import Noty from 'noty'
export function placeOrder(formObject)
{console.log("Inside place order funxction")
    axios.post('/orders',formObject).then((res)=>{
        new Noty({
            type:"success",
            timeout:1000,
            text:res.data.message,
        }).show()
        setTimeout(()=>{
            window.location.href='/customer/orders'
        },1000)
        

        console.log(res.data);
    }).catch(e=>{
        console.log(e);
    })
}