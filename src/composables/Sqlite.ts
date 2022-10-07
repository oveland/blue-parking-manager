import {SQLiteDBConnection, SQLiteHook, useSQLite} from 'vue-sqlite-hook';

import {Capacitor} from '@capacitor/core';
import {defineCustomElements, applyPolyfills} from 'jeep-sqlite/loader/';


class Sqlite {
    protected sqlite: SQLiteHook | undefined;
    protected connection: SQLiteDBConnection | undefined;
    protected platform: string;
    private DB_NAME = 'PRM';

    constructor() {
        this.platform = Capacitor.getPlatform();
    }

    async init() {
        return new Promise((resolve, reject) => {
            applyPolyfills().then(() => {
                defineCustomElements(window).then(async () => {
                    await this.start(null);
                    const ok = await this.checkStatus();

                    if (ok) resolve(true);
                    else reject(false);
                });
            })
        });
    }

    async start(app: any) {
        const isModalOpen = app?.appContext.config.globalProperties.$isModalOpen;
        const contentMessage = app?.appContext.config.globalProperties.$messageContent;
        const jsonListeners = app?.appContext.config.globalProperties.$isJsonListeners;
        const onProgressImport = async (progress: string) => {
            if (jsonListeners.jsonListeners.value) {
                if (!isModalOpen.isModal.value) isModalOpen.setIsModal(true);
                contentMessage.setMessage(
                    contentMessage.message.value.concat(`${progress}\n`));
            }
        }
        const onProgressExport = async (progress: string) => {
            if (jsonListeners.jsonListeners.value) {
                if (!isModalOpen.isModal.value) isModalOpen.setIsModal(true);
                contentMessage.setMessage(
                    contentMessage.message.value.concat(`${progress}\n`));
            }
        }

        this.sqlite = useSQLite({
            onProgressImport,
            onProgressExport
        });

        // app.appContext.config.globalProperties.$sqlite = this.sqlite;

        if (this.platform === "web") {
            // Create the 'jeep-sqlite' Stencil component
            const jeepSqlite = document.createElement('jeep-sqlite');
            document.body.appendChild(jeepSqlite);
            await customElements.whenDefined('jeep-sqlite');
            // Initialize the Web store
            await this.sqlite.initWebStore();
        }
    }

    protected async checkConnection() {
        if (!this.connection) this.connection = await this.getConnection();
    }

    private async getConnection() {
        const ret = await this.sqlite?.checkConnectionsConsistency();
        // const isConn = (await this.sqlite?.isConnection(this.DB_NAME))?.result;

        let connection: SQLiteDBConnection | undefined;
        if (ret && ret.result) {
            connection = await this.sqlite?.retrieveConnection(this.DB_NAME);
        } else {
            connection = await this.sqlite?.createConnection(this.DB_NAME, false, "no-encryption", 1);
        }

        return connection;
    }

    protected async openConnection() {
        await this.checkConnection();
        await this.connection?.open();
    }

    protected async closeConnection() {
        // await this.sqlite?.closeConnection(this.DB_NAME);
    }

    async execute(query: string) {
        await this.openConnection();
        const response = await this.connection?.execute(query);

        if (response && response.changes && response.changes.changes && response.changes.changes < 0) {
            throw new Error(`Error: execute failed sql: ${query}`);
        }

        await this.closeConnection();
        return response;
    }

    async query(query: string) {
        await this.openConnection();
        const response = await this.connection?.query(query);
        await this.closeConnection();
        return response;
    }

    private async checkStatus() {
        const echo = 'check from echo';
        const res: any = await this.sqlite?.echo(echo);
        if (!res || res.value !== echo) {
            return false;
        }

        await this.checkConnection();
        return true;
    }
}

export default Sqlite;
