import {Geolocation} from '@capacitor/geolocation';
import {Capacitor} from "@capacitor/core";

const platformWeb = Capacitor.getPlatform() === 'web';

async function requestPermissions() {
    return new Promise((resolve => {
        Geolocation.requestPermissions().then((r) => {
            if(!r || r.location != 'granted') {
                setTimeout(() => {
                    requestPermissions();
                }, 5000);
            } else {
                resolve(true);
            }
        })
    }));
}

async function getLocation() {
    if (platformWeb) {
        return {
            coords: {
                latitude: 1.0,
                longitude: -72.0,
            }
        }
    }

    await requestPermissions();
    return await Geolocation.getCurrentPosition();
}

requestPermissions().then();

export function useGeolocation() {
    return {
        getLocation
    };
}
