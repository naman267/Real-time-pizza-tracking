import axios from 'axios'
import Noty from 'noty'
import {initAdmin} from'./admin'
import moment from 'moment'
import {initStripe} from './stripe'
const cartCounter=document.querySelector('#cartCounter')
let adminAreaPath=window.location.pathname

let counter=document.getElementsByClassName('coun')[0].id

cartCounter.innerText=counter
const user=document.getElementsByClassName('user')[0].id;
console.log("user",user)
function updateCart(pizza){
    axios.post('/update-cart',pizza).then((res)=>{
        cartCounter.innerText=res.data.totalQty
        new Noty({
            type:"success",
            timeout:1000,
            text:'Item added to cart'
        }).show()

    }).catch((e)=>{
        new Noty({
            type:"error",
            timeout:1000,
            text:'Something went wrong'
        }).show()

    })

}
let addToCart=document.querySelectorAll('.add-to-cart')
addToCart.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
        console.log('click');
        let pizza=JSON.parse(btn.dataset.pizza)
        //console.log(pizza)
        updateCart(pizza)
    })
})

if(adminAreaPath.includes('admin'))
{cartCounter.innerText=counter=0;

}

let alertMsg=document.getElementById('success-alert')
if(alertMsg)
{ console.log("hi")
    setTimeout(()=>{
    alertMsg.remove()
},2000)
    
}
let socket=io();


let time=document.createElement('small')
let statuses=document.querySelectorAll('.status_line')
let input =document.getElementById('hiddeninput');
let order=input?input.value:null;
order=JSON.parse(order)
function updateStatus(order)
{let stepCompleted=true;
   
    statuses.forEach((status)=>{
        status.classList.remove('step-completed');
        status.classList.remove('current')
    })


    statuses.forEach((status)=>{
        
        let dataprop=status.dataset.status;

        if(stepCompleted)
        {
            status.classList.add('step-completed')
        }
        if(dataprop==order.status)
        {   stepCompleted=false;
            time.innerText=moment(order.updatedAt).format('hh:mm:A')
            status.appendChild(time)
            if(status.nextElementSibling)
            {
            status.nextElementSibling.classList.add('current');
           
            }
        }
    })

}
updateStatus(order)

//
initStripe()




if(adminAreaPath.includes('admin'))
{initAdmin(socket)
    socket.emit('join','adminRoom')
}
if(order)
{
socket.emit('join',`order_${order._id}`);
}
socket.on('orderUpdated',(data)=>{
    const updatedOrder={...order}
    //New updated time 
    updatedOrder.updatedAt=moment().format()
    updatedOrder.status=data.status
    console.log(data)
    updateStatus(updatedOrder)
    new Noty({
        type:"success",
        timeout:1000,
        text:'Order Updated'
    }).show()

})
