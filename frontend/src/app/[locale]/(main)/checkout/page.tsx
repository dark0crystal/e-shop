import CheckOutForm from "./CheckoutForm";
import CheckOutOrders from "./CheckoutOrders";


export default function CheckOutPage(){


  return(
    <div className="grid grid-cols-2">
      <div className="h-screen w-full bg-amber-100">
        <CheckOutForm/>
      </div>
      <div className="h-screen w-full bg-cyan-100">
        <CheckOutOrders/>
      </div>
       
    </div>
  )

}