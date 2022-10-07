import Database from './Database';
import moment from "moment";
import CONFIG from './Config';

async function init() {
    return await Database.initTables();
}

function format(row: any) {
    const processing = row.status_local == CONFIG.STATUS.LOCAL.PROCESSING || row.status_local == CONFIG.STATUS.LOCAL.NO_PLATE || row.status_local == '' || !row.status_local;

    return {
        id: row.uid,
        uid: row.uid,
        local: true,
        stLocal: row.status_local,
        isProcessing: processing,
        zone: {
            id: row.zone
        },
        vehicle: {
            plate: row.plate,
            editablePlate: processing,
            type: row.vehicleType
        },
        location: {
            latitude: row.latitude,
            longitude: row.longitude,
        },
        status: {
            name: 'Parqueado',
            time: '0m'
        },
        start: row.datetime,
        startTime: moment(row.datetime).format('HH:mm:ss')
    }
}

async function deleteBadRegisters(rotationCheckId:any) {
    if(!rotationCheckId) return null;
    await Database.statement(`DELETE FROM reservations WHERE (plate = 'No reconocido' OR status_local = ${CONFIG.STATUS.LOCAL.NO_PLATE}) AND rotation_check = ${rotationCheckId}`);
}

async function checkBadPlates() {
    const dateOld = moment().subtract(1, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    await Database.statement(`UPDATE reservations set plate = 'No reconocido', status_local = ${CONFIG.STATUS.LOCAL.NO_PLATE} WHERE datetime < '${dateOld}' AND status_local = ${CONFIG.STATUS.LOCAL.PROCESSING}`);
}

async function listReservations(params: any) {
    await checkBadPlates();

    const today = moment().format('YYYY-MM-DD');
    const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD');

    const list = await Database.select(`
        SELECT * 
        FROM reservations 
        WHERE zone = ${params.zone} 
        AND status_remote = '${params.status}' 
        AND (
            status_local = ${CONFIG.STATUS.LOCAL.PROCESSING}
            OR status_local = ${CONFIG.STATUS.LOCAL.WITH_PLATE}
            OR status_local = ${CONFIG.STATUS.LOCAL.NO_PLATE}
        )
        AND datetime BETWEEN '${today} 00:00:00' AND '${tomorrow} 00:00:00'
    `);

    return Array.from(list ? list : [], (r) => format(r));
}

async function loadPhoto(uid:string) {
    const p = await Database.select(`SELECT photo FROM reservations WHERE uid = '${uid}' LIMIT 1`);
    if(!p || !p.length || !uid) return '';

    return p[0].photo;
}

function createReservation(data: any) {
    data.uid = makeUid();

    Database.insert(`
        INSERT INTO reservations (uid, datetime, plate, zone, rotation_check, vehicle_type, parking_type, parking_zone, latitude, longitude, status_local, photo)
        VALUES ('${data.uid}', '${data.datetime}','${data.plate}', ${data.zone}, ${data.rotationCheck?.id}, ${data.vehicleType?.id}, ${data.parkingType}, ${data.parkingZone}, ${data.latitude}, ${data.longitude}, ${CONFIG.STATUS.LOCAL.PROCESSING}, '${data.photo}');
    `).then();

    return format(data);
}

async function setReservationStatusLocal(uid: any, status: number) {
    if (!uid) return null;
    await Database.statement(`UPDATE reservations SET status_local = ${status} WHERE uid = '${uid}'`);
}

async function setReservationPlate(uid: any, plate: string) {
    if (!uid) return null;
    const statusLocal = plate ? CONFIG.STATUS.LOCAL.PROCESSING : CONFIG.STATUS.LOCAL.NO_PLATE;
    await Database.statement(`UPDATE reservations SET plate = '${plate ? plate : 'No reconocido'}', status_local = ${statusLocal} WHERE uid = '${uid}'`);
}

async function setReservationLocation(uid: any, latitude: any, longitude: any) {
    if (!uid || !latitude || !longitude) return null;
    await Database.statement(`UPDATE reservations SET latitude = ${latitude}, longitude = ${longitude} WHERE uid = '${uid}'`);
}

function makeUid() {
    return moment().format('x');
}

export function useDatabase() {
    return {
        init,
        loadPhoto,
        listReservations,
        createReservation,
        setReservationStatusLocal,
        setReservationPlate,
        setReservationLocation,
        deleteBadRegisters
    };
}
