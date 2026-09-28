import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const params = (key) => (key ? { params: { key } } : {});

export const fetchTime = (key) => axios.get(`${API}/time`, params(key)).then((r) => r.data);
export const fetchEvents = (key) => axios.get(`${API}/events`, params(key)).then((r) => r.data);
