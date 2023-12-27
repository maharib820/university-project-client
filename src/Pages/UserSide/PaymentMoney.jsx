import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const PaymentMoney = () => {

    const stripePromise = loadStripe(import.meta.env.VITE_ecommerce_payment);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="px-32 py-20">
                <h2 className="text-xl mb-5 text-center bg-black text-white py-1">Pay Now</h2>
                <Elements stripe={stripePromise}>
                    <CheckoutForm></CheckoutForm>
                </Elements>
            </div>
        </div>
    );
};

export default PaymentMoney;