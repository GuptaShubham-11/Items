import axios from "axios";

const API = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api/v1/items` || "http://localhost:1111/api/v1/items",
    timeout: 30000
});

export const getItems = () => API.get("/get-items");
export const addItem = (data: FormData) => API.post("/add-item", data);
export const deleteItem = (id: string) => API.delete(`/delete-item/${id}`);
export const updateItem = (id: string, data: any) => API.put(`/update-item/${id}`, data);
export const sendEnquireEmail = (data: any) => API.post("/send-enquire-email", data);