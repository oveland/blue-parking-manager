import {api, get, post} from "@/composables/Server";
import {useDatabase} from "@/composables/useDatabase";
import CONFIG from './Config';

const db = useDatabase();

/**
 * RESERVATIONS
 */

async function list(filters: any) {
    if (!filters.zone) return [];

    const params = {
        date: filters.date,
        status: filters.status,
        zone: filters.zone?.id
    };

    let serverList = await get(api('reservation', 'list'), params);

    serverList = serverList ? serverList : [];
    const localList = await db.listReservations(params);

    return serverList.concat(localList);
}

async function create(data: any) {
    const r = await post(api('reservation', 'create'), {
        'uid': data.uid,
        'date': data.datetime,
        'vehicle-plate': data.plate,
        'user-name': '',                                        // Use internal from server
        'vehicle-type': data.type.id,
        'parking-type': 1,                                      // Parking Mix
        'parking-zone': data.zone.id,
        'location-lat': data.location?.latitude,
        'location-lng': data.location?.longitude,
    });

    if (r.success) await db.setReservationStatusLocal(r.uid, CONFIG.STATUS.LOCAL.CREATED);

    return r;
}

async function remove(data: any) {
    return await post(api('reservation', 'delete'), {
        id: data.id
    });
}

export function useReservation() {
    return {
        list,
        create,
        remove
    };
}

