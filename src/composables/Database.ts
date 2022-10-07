import Sqlite from "@/composables/Sqlite";
import {Capacitor} from "@capacitor/core";

import moment from 'moment';

class Database extends Sqlite {
    protected platformWeb: boolean;

    constructor() {
        super();
        this.platformWeb = Capacitor.getPlatform() === 'web';
    }

    async initTables() {
        if (this.platformWeb) return true;

        await this.init();

        await this.initReservations();
        await this.initCache();

        return true;
    }

    async initReservations() {
        await this.statement(`
            CREATE TABLE IF NOT EXISTS reservations (
              id INTEGER PRIMARY KEY NOT NULL,
              uid TEXT NOT NULL UNIQUE,
              datetime TEXT NOT NULL,
              plate TEXT DEFAULT '',
              zone INTEGER DEFAULT 0,
              rotation_check INTEGER DEFAULT 0,
              vehicle_type INTEGER DEFAULT 1,
              parking_type INTEGER DEFAULT 1,
              parking_zone INTEGER DEFAULT 1,
              latitude INTEGER DEFAULT 0,
              longitude INTEGER DEFAULT 0,
              user TEXT DEFAULT '',
              status_local INTEGER DEFAULT 0,
              status_remote TEXT DEFAULT 'active',
              photo TEXT NOT NULL
            );
        `);

        const dateAgo = moment().subtract(1, 'days').format('YYYY-MM-DD');
        await this.delete(`DELETE FROM reservations WHERE datetime < '${dateAgo}';`);
    }

    async initCache() {
        await this.statement(`
            CREATE TABLE IF NOT EXISTS cache (
              id INTEGER PRIMARY KEY NOT NULL,
              datetime TEXT NOT NULL,
              key TEXT NOT NULL,
              value TEXT
            );
        `);
    }

    async getCache(key: string) {
        const valueJSON = await this.select(`SELECT value FROM cache WHERE key = '${key}' LIMIT 1`);

        if (!valueJSON || !valueJSON.length || !valueJSON[0]) return null;

        return JSON.parse(valueJSON[0].value);
    }

    async setCache(key: string, value:any) {
        value = JSON.stringify(value);
        const datetime = moment().format('YYYY-MM-DD HH:mm:ss');

        await this.delete(`DELETE FROM cache WHERE key = '${key}'`);
        await this.insert(`INSERT INTO cache (key, value, datetime) WHERE key = '${key}', value = '${value}', datetime = '${datetime}'`);
    }

    async insert(query: string) {
        if (this.platformWeb) return true;

        const response = await this.execute(query);
        return response?.changes?.changes;
    }

    async select(query: string) {
        if (this.platformWeb) return [];

        const d = await this.query(query);
        return d?.values;
    }

    async statement(query: string) {
        if (this.platformWeb) return true;

        return await this.execute(query);
    }

    async delete(query: string) {
        if (this.platformWeb) return true;

        return await this.execute(query);
    }
}


export default new Database();
