import axios from 'axios';
import CONFIG from './Config';

export function api(resource: string, service: string) {
    return `${CONFIG.API_URL}/${resource}/${service}`;
}

export async function get(url: string, params: any) {
    const response = await axios.get(url, {
        params
    });
    return response.data;
}

export async function post(url: string, params: any) {
    const response = await axios.post(url, params);
    return response.data;
}
