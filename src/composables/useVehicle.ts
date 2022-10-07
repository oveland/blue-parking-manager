import {api, get, post} from "@/composables/Server";

/**
 * VEHICLE
 */
async function decodePlate(uid: string, photo: any, datetime: string) {
    const r = await post(api('vehicle', 'decode-plate'), {
        photo: photo.dataUrl,
        uid,
        datetime
    });

    if (r.success && r.plate) return r.plate

    return '';
}

async function getTypes() {
    const vehicleTypes = await get(api('vehicle', 'types'), {});

    return vehicleTypes.filter((vt: any) => vt.id != 6)
}


export function useVehicle() {
    return {
        decodePlate,
        getTypes
    };
}
