import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosPublic from "./useAxiosPublic";

const useWishlist = () => {

    const { user } = useAuth();
    const axiosPublic = useAxiosPublic();

    const { data: wishlist, refetch: refetchWishlist, isPending: wishlistPending } = useQuery({
        queryKey: ['wishlist', user?.email],
        queryFn: async () => {
            const res = await axiosPublic.get(`/mywishlist/${user?.email}`);
            return res.data;
        }
    })

    return { wishlist, refetchWishlist, wishlistPending }
};

export default useWishlist;