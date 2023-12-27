import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
import useCart from "../../Hooks/useCart";
import useAuth from "../../Hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";

const CheckoutForm = () => {

    const { user } = useAuth();

    const axiosPrivate = useAxiosPrivate();

    const [error, setError] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const navigate = useNavigate();

    const stripe = useStripe();
    const elements = useElements();

    const { cartItems, refetchCartItems } = useCart();
    // const [paymentAmount, setPaymentAmount] = useState(0);

    const totalAmount = cartItems?.map(item => item.totalSelectedItems * item.cartItemsList.productfinalprice).reduce((acc, currentValue) => acc + currentValue, 0) - 50;

    useEffect(() => {
        if (totalAmount > 0) {
            axiosPrivate.post("/create-payment-intent", { price: totalAmount })
                .then(res => {
                    // console.log(res.data.clientSecret);
                    setClientSecret(res.data.clientSecret)
                })
        }
    }, [axiosPrivate, totalAmount])

    const {data: userData} = useQuery({
        queryKey: ["userData", user?.email],
        queryFn: async () => {
            const res = await axiosPrivate(`/userdatas/${user?.email}`)
            return res.data;
        }
    })

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }
        const card = elements.getElement(CardElement);
        if (card === null) {
            return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card
        })

        if (error) {
            setError(error.message);
        }
        else {
            console.log('PaymentMethod', paymentMethod);
            setError('');
        }

        // confirm payment
        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    email: user?.email || "unknown",
                    name: user?.displayName || "unknown"
                }
            }
        });

        if (confirmError) {
            // console.log(confirmError);
        }
        else {
            console.log(paymentIntent);
            if (paymentIntent.status === "succeeded") {
                console.log('transaction id', paymentIntent.id);
                setTransactionId(paymentIntent.id);
                // saving payment in database
                // console.log(cartItems);
                const paymentHistory = {
                    email: user?.email,
                    transactionId: paymentIntent.id,
                    time: new Date(),
                    amountpaid: totalAmount,
                    cartId: cartItems,
                    productsId: cartItems.map(item => item.cartProductId),
                    productQuantity: cartItems.map(item => item.totalSelectedItems),
                    status: "pending",
                    userDetails: userData
                }
                const res = await axiosPrivate.post(`/buyingpayment/${user.email}`, paymentHistory)
                // console.log(res.data.result.insertedId);
                if (res.data.result.insertedId) {
                    refetchCartItems();
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Payment successful",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    navigate("/")
                }
            }
        }
    }

    console.log(userData);


    return (
        <div>
            <form className="border-2 border-black py-5 px-5" onSubmit={handleSubmit}>
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
                <button className="bg-red-600 w-full mt-5 py-2 text-white font-bold" type="submit" disabled={!stripe || !clientSecret}>
                    Pay
                </button>
                <p className="text-red-600 mt-5">{error}</p>
                {
                    transactionId && <p className="text-green-500">Your transaction id {transactionId}</p>
                }
            </form>
        </div>
    );
};

export default CheckoutForm;