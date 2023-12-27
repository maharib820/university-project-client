import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosPublic from "./useAxiosPublic";

const useRole = () => {

    const {user, loading} = useAuth();
    const axiosPublic = useAxiosPublic();

    const {data: status} = useQuery({
        queryKey: ["role"],
        enabled: !loading,
        queryFn: async () => {
            const res = await axiosPublic(`/userstatus/${user?.email}`);
            return res.data;
        }
    });

    return status;
};

export default useRole;