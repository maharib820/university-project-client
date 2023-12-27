import axios from "axios";

const axiosPrivate = axios.create({
    baseURL: "http://localhost:7000/"
})

const useAxiosPrivate = () => {
    return (
        axiosPrivate
    );
};

export default useAxiosPrivate;