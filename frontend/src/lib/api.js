import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const options = { timeout: 12000, headers: { 'Cache-Control': 'no-cache' } };
export const fetchTime = () => axios.get(`${API}/time`, options).then((r) => r.data);
export const fetchEvents = () => axios.get(`${API}/events`, options).then((r) => r.data);
export const fetchDressCode = () => axios.get(`${API}/dress-code`, options).then((r) => r.data);
