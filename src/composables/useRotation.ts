import {api, get, post} from "@/composables/Server";
import {useDatabase} from "@/composables/useDatabase";

const db = useDatabase();

/**
 * ROTATION CHECKS
 */

async function current(filters: any) {
    return await get(api('rotation', 'check-current'), {
        status: filters.status,
        zone: filters.zone.id
    });
}

async function start(filters: any) {
    return await post(api('rotation', 'check-start'), {
        'date-start': null,
        'coords': filters.coords,
        'parking-zone': filters.zone.id,
        'location-lat': filters.location?.latitude,
        'location-lng': filters.location?.longitude,
    });
}

async function finish(data: any) {

    await db.deleteBadRegisters(data.id);

    return await get(api('rotation', 'check-finish'), {
        'id': data.id,
        'date-finish': null,
        'location-lat': data.location?.latitude,
        'location-lng': data.location?.longitude,
    });
}

export function useRotation() {
    return {
        current,
        start,
        finish,
    };
}
