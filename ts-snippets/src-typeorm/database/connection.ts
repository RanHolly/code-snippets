import { DataSource } from "typeorm";
import { entity } from "./entity.export";
import { config } from "dotenv";

config();

export class Connect extends DataSource { //more info: https://typeorm.io/data-source-options
    constructor() {
        super({
            type: `postgres`, //https://typeorm.io/#installation
            host: process.env.HOST,
            port: 5432, //default port - 5432.
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            entities: entity,
            cache: true,
            synchronize: true,
        });
    }
    /**
     * Method for connecting Databases.
     */
    async connection() {
        try {
            await this.initialize();
            console.log(`Database connected.`)
        } catch (e) {
            console.error(`Database failed to connect. Error:`, e);
        }
    }
}
