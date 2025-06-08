import axios from "axios";

const token = '66ad4bee-3015-45dc-92d1-d5f5c14fc919'
const apiKey = 'e2dbdc3e-bea2-44f2-a873-dd87cb2109cc'

export const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1',
    headers: {
        Authorization: `Bearer ${token}`,
        'API-KEY': apiKey,
    }
})