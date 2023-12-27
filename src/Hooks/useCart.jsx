import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosPublic from "./useAxiosPublic";

const useCart = () => {

    const axiosPublic = useAxiosPublic();
    const { user } = useAuth();

    const { data: cartItems, refetch: refetchCartItems, isPending: isCartPending } = useQuery({
        queryKey: ["cartItems", user?.email],
        queryFn: async () => {
            const res = await axiosPublic.get(`/myAddedCartItems/${user?.email}`);
            return res.data;
        }
    });

    return { cartItems, refetchCartItems, isCartPending }
};

export default useCart;