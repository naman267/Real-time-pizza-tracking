import axios from 'axios'
import Noty from 'noty'
import {loadStripe} from '@stripe/stripe-js';
import {placeOrder} from './apiService' 


export async function initStripe()
{
//Publishable Api key from stripe
const stripe = await loadStripe('pk_test_51I0kzgKw5ISCrHKcqx50ynBcoIiowl0wbVX6zHypD2qz7ByhhXlRMLYItHTZv8OuhgNQJRnCvXLBusEIi2555uzr00rYa23rtC');
let card=null;

function mountWidget()
{
    
const elements=stripe.elements();
let style = {
            base: {
             color: '#32325d',
             fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
             fontSmoothing: 'antialiased',
             fontSize: '16px',
             '::placeholder': {
                 color: '#aab7c4'
             }
             },
             invalid: {
            color: '#fa755a',
         iconColor: '#fa755a'
             }
         };
 card=elements.create('card',{style,hidePostalCode:true});
//Card injecting
card.mount('#card-element')
}

const paymentType=document.querySelector('#paymentType')
if(!paymentType)
{return ;}
paymentType.addEventListener('change',(e)=>{


    if(e.target.value==="card")
    {
       mountWidget()
    }
    else{
      card.destroy();
    }


    console.log(e.target.value)
})
let paymentForm=document.querySelector('#payment-form');
if(paymentForm)
{
paymentForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    let formData=new FormData(paymentForm);
    let formObject={};

    for(let [key,value] of formData.entries())
    {
        formObject[key]=value;
    }
    console.log(formObject)

   if(!card)
   {  console.log("place order")
       placeOrder(formObject);
       return;
   }

    stripe.createToken(card).then(res=>{
        console.log(res)
        formObject.stripeToken=res.token.id;
        placeOrder(formObject);

    }).catch(e=>{
        console.log(e)
    })

    
})


}
}