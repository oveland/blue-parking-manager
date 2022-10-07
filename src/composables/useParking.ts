import {api, get} from "@/composables/Server";

/**
 * PARKING LOTS
 */

async function lots(filters: any) {
    return await get(api('zone', 'list-parking-lots'), {
        code: filters?.code
    });
}

async function zones(filters: any) {
    return await get(api('zone', 'list'), {
        parking: filters.parking
    });
}

export function useParking() {
    return {
        lots,
        zones
    };
}
