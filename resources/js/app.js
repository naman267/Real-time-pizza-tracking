import axios from 'axios'
import Noty from 'noty'

const cartCounter=document.querySelector('#cartCounter')
let counter=document.getElementsByClassName('coun')[0].id
cartCounter.innerText=counter

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
