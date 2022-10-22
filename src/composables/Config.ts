const DOMAIN = 'https://rotacion.pcwserviciosgps.com';
// const DOMAIN = `http://192.168.100.100:2001`;

const API_URL = `${DOMAIN}/api/v1/app`;

const STATUS = {
    LOCAL: {
        PROCESSING: 0,
        WITH_PLATE: 1,
        NO_PLATE: 5,
        CREATED: 2,
    },
    REMOTE: {
        ACTIVE: 'active',
        FINISHED: 'finished',
    }
};

export default {
    DOMAIN, API_URL, STATUS
}
