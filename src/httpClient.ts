import axios from "axios";

const getToken = () => {
    const token = `Bearer ${sessionStorage.getItem('userToken')}`
    return token;
}
export const instance = axios.create({
    baseURL: "https://api.realworld.io/api/",
    timeout: 10000,
    headers: {
        Authorization:
            getToken(),
    },
});

instance.interceptors.request.use((config: any) => {
    config.headers.Authorization = getToken();
    // console.log(config);
    return config;
})
