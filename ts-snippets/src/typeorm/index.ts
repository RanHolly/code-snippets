/*
To use this code, you need to install the typeorm library via the npm/yarn or pnpm installer. For example: 
npm install typeorm typescript @types/node
P.S. `i` aliase `install`. If you use yarn or pnpm - install has no other alias. Intall new packages - yarn/pnpm add package-name 
npm/yarn/pnpm install - will install all packages from package.json 
+ database driver-library. For example: postgresql - pg; mysql/mariadb - mysql or mysql2.This more details - https://typeorm.io/#installation
*/

import { DataSource, ObjectLiteral, DeleteResult, UpdateResult } from 'typeorm';
import { collectionEntity } from './entity.export';
import { DataManipulator } from '../data.manipulator';
import { Connect } from './connection';


/**
 * Class for working with database data.
 */
export class Database {
    db: DataSource;
    constructor() {
        this.db = new Connect();
        this.checkConnection();
    }

    /**
     * Method for checking the existence of a connection to the database.
     * @returns {void} Nothing if there is a connection or console output.
     */
    checkConnection(): void {
        const db = this.db;
        if (db === undefined) return console.error('Database failed to connect!');
    }

    /**
     * Method for getting data from the database by the given fields and values.
     * @param {string} fieldName - The name of the search field.
     * @param {string} fieldValue - Field values ​​to search.
     * @param {string} repoName - The name of the repository (table) to search for data.
     * @returns {Promise<{res: ObjectLiteral | null, status: boolean | null, error: null | string;}>} Promise with an object containing information about the results of the query or error.
     */
    async fetchData(fieldName: string, fieldValue: string, repoName: string): Promise<{ error: null | string; res: ObjectLiteral | null; status: boolean | null;}> {
        const repo = collectionEntity.get(repoName);

        if (!repo) return { error: 'The specified name was not found in the collection! (fetchData)', res: null, status: null };

        try {
            const res = await repo.findOne({ where: { [fieldName]: fieldValue } });

            if (!res) return { error: 'Looks like nothing was found.', res: null, status: false };
            return { error: null, res: res, status: true };
        } catch (e: any) {
            console.error(e);
            return { error: e.message, res: null, status: null };
        }
    }

    /**
     * Method for getting all data from the specified table
     * @param {string} repoName name table.
     * @returns {Promise<{res: ObjectLiteral[] | null; status: boolean | null; error: null | string;}>} Promise with an object containing information about the results of the query or error.
     */
    async fetchAllData(repoName: string): Promise<{ res: ObjectLiteral[] | null, status: boolean | null, error: null | string; }> {
        const repo = collectionEntity.get(repoName);

        if (!repo) return { error: 'The specified name was not found in the collection! (fetchAllData)', res: null, status: null };
        try {
            const res = await repo.find()

            if (!res || res.length === 0) return { error: 'Looks like nothing was found.', res: null, status: false };
            return { error: null, res: res, status: true };
        } catch (e: any) {
            console.error(e);
            return { error: e.message, res: null, status: null };
        }
    }

    /**
     * Getting data from a table by one or more `id`.
     * @param {string | number | {} | []} ids `id` by which (or more) the data will be searched.
     * @param {string} repoName name table.
     * @returns {Promise<{res: ObjectLiteral[] | null; status: boolean | null; error: null | string;}>} Promise with an object containing information about the results of the query or error.
     */
    async fetchByIds(ids: string | number | {} | [], repoName: string): Promise<{ res: ObjectLiteral[] | null; status: boolean | null; error: null | string; }> {
        const repo = collectionEntity.get(repoName);

        if (!repo) return { error: 'The specified name was not found in the collection! (fetchByIds)', res: null, status: null };
        try {
            let idRef = ids;

            if (!Array.isArray(ids)) {
                idRef = [ids];
            }

            const res = await repo.findBy({ id: idRef });

            if (!res || res.length === 0) return { error: 'Looks like nothing was found.', res: null, status: false };
            return { error: null, res: res, status: true };
        } catch (e: any) {
            console.error(e);
            return { error: e.message, res: null, status: null };
        }
    }

    /**
     * Method for getting the largest id value in the table.
     * @param {string} repoName name table.
     * @returns {Promise<{ res: ObjectLiteral | null; status: boolean | null; error: null | string; }>} Promise with an object containing information about the results of the query or error.
     */
    async fetchLastId(repoName: string): Promise<{ res: ObjectLiteral | null; status: boolean | null; error: null | string; }> {
        const repo = collectionEntity.get(repoName);

        if (!repo) return { error: `The specified name was not found in the collection! (fetchLastId)`, res: null, status: null };
        try {
            const res = await repo.findOne({ order: { id: 'DESC' } });

            if (!res) return { error: 'Looks like nothing was found.', res: null, status: false };
            return { error: null, res: res, status: true };
        } catch (e: any) {
            console.error(e);
            return { error: e.message, res: null, status: null };
        }
    }

    /**
     * Method for finding a match in a table by a specified column and value.
     * @param {string} fieldName column name.
     * @param {string | number | {} | []} fieldValue the value of this field.
     * @param {string} repoName name table.
     * @returns {Promise<{res: ObjectLiteral | null; status: boolean | null; error: null | string;}>} Promise with an object containing information about the results of the query or error.
     */
    async fetchAllByField(fieldName: string, fieldValue: string | number | {} | [], repoName: string): Promise<{ res: ObjectLiteral | null; status: boolean | null; error: null | string; }> {
        const repo = collectionEntity.get(repoName);

        if (!repo) return { error: 'The specified name was not found in the collection!', res: null, status: null };

        try {
            const res = await repo.find({ where: { [fieldName]: fieldValue } })

            if (!res) return { error: 'Looks like nothing was found.', res: null, status: false };
            return { error: null, res: res, status: true };
        } catch (e: any) {
            console.error(e);
            return { error: e.message, res: null, status: null };
        }
    }

    /**
     * Method for deleting data by id.
     * @param {string | number | {} | []} ids id of the data you want to delete
     * @param repoName table name.
     * @returns {Promise<{res: DeleteResult | null; error: null | string}>} Promise with an object containing information about the results of the delete or error.
     */
    async deleteByIds(ids: string | number | {} | [], repoName: string): Promise<{ res: DeleteResult | null; error: null | string }> {
        const repo = collectionEntity.get(repoName);

        if (!repo) return { error: 'The specified name was not found in the collection! (deleteByIds)', res: null };
        try {
            let idRef = ids;

            if (!Array.isArray(ids)) {
                idRef = [ids];
            }

            const res = await repo.delete({ id: idRef });

            if (!res) return { error: 'Looks like something went wrong in deleteByIds.', res: null };
            return { error: null, res: res };
        } catch (e: any) {
            console.error(e);
            return { error: e.message, res: null };
        }
    }

    /**
     * Method for writing/updating a table. save() is used.
     * @param {{}} document Values ​​to write/update the table.
     * @param repoName table name.
     * @returns {Promise<{ res: ObjectLiteral | null; status: boolean | null; error: null | string; }>} A promise with an object containing information about the results of creating/updating the table or error.
     */
    async upsertData(document: {}, repoName: string): Promise<{ res: ObjectLiteral | null; status: boolean | null; error: null | string; }> {
        const repo = collectionEntity.get(repoName);

        if (!repo) return { error: 'The specified name was not found in the collection! (upsertData)', res: null, status: null };
        try {
            const res = await repo.save(document);

            if (!res) return { error: 'Looks like something went wrong in upsertData()', res: null, status: false };
            return { error: null, res: res, status: true };
        } catch (e: any) {
            console.error(e);
            return { error: e.message, res: null, status: null };
        }

    }

    /**
     * Method for writing/updating a table. insert() is used.
     * @param {{}} document Values ​​to write/update the table.
     * @param repoName table name.
     * @returns {Promise<{ res: ObjectLiteral | null; status: boolean | null; error: null | string; }>} A promise with an object containing information about the results of creating/updating the table or error.
     */
    async insertData(document: {}, repoName: string): Promise<{ res: ObjectLiteral | null; status: boolean | null; error: null | string; }> {
        const repo = collectionEntity.get(repoName);

        if (!repo) return { error: 'The specified name was not found in the collection! (insertData)', res: null, status: null };
        try {
            const res = await repo.insert(document);

            if (!res) return { error: 'Looks like something went wrong in upsertData()', res: null, status: false };
            return { error: null, res: res, status: true };
        } catch (e: any) {
            console.error(e);
            return { error: e.message, res: null, status: null };
        }
    }

    /**
     * Method for updating values ​​in the Database.
     * @param {string | number} id the id of the column we want to update.
     * @param {{}} partialObjectData The object to change the data.
     * @param {string} repoName table name.
     * @returns {Promise<{ res: UpdateResult | null; error: null | string; }>} A promise with an object containing information about the results of updating the table or error.
     */
    async updatePartialData(id: string | number, partialObjectData: {}, repoName: string): Promise<{ res: UpdateResult | null; error: null | string; }> {
        const repo = collectionEntity.get(repoName);

        if (!repo) return { error: 'The specified name was not found in the collection! (updatePartialData)', res: null };
        try {
            const res = await repo.findBy({ id: [id] }) //findByIds

            if (!res || res.length === 0) return { error: 'Data for the specified identifier was not found.', res: null };

            const upd = await repo.update(id, partialObjectData);

            if (!upd) return { error: 'Looks like something went wrong in updatePartialData()', res: null };
            return { error: null, res: upd };
        } catch (e: any) {
            console.error(e);
            return { error: e.message, res: null };
        }
    }

    /**
     * Method for updating data in a table using various types of operations (eg `$push`, `$pull`, `$set`). P.S. My implementation of these methods has nothing to do with Mongoose or Mongodb. You can see the implementation in the DataManipulator class.
     * @param {object} id - An object with parameters for searching data.
     * @param {string} repoName - table name.
     * @param {object} updType - An object that specifies the type of operation and data to update.
     * @param {object} [path] - An optional argument containing the path to the data if you want to update the data at the exact path.
     * @returns {Promise<string | void>} Promise, which may contain a string with a string message about the result of the operation or an error in console.
     */
    async updateData(id: {}, repoName: string, updType: { $push?: {}, $pull?: {}, $set?: {} }, path?: { end1: string, end2?: string }): Promise<string | void> {
        try {
            const repo = collectionEntity.get(repoName);

            if (!repo) return console.log('The specified name was not found in the collection! (updateData)');

            const idAction = Object.keys(id);
            const updTypeAction = Object.keys(updType);

            if (idAction.length === 0 || updTypeAction.length === 0) {
                return console.log('Failed to update data: Invalid parameters. (updateData)');
            }

            const repoData = await repo.findOneBy(id);

            if (!repoData) {
                return console.log('Failed to update data: record not found. (updateData)');
            }

            switch (updTypeAction[0]) {
                case '$push': {
                    const { $push } = updType;

                    if (!$push) { //this error is unlikely to occur ;D (in $pull/$set too)
                        return console.log('Failed to update data: $push parameter was not specified. (updateData/$push)');
                    }

                    const data = { ...$push };
                    const push = new DataManipulator(repoData, data, path);
                    const pushData = push.build();

                    if (typeof pushData === 'string') {
                        return console.log(`Failed to update data: ${pushData}. (updateData)`);
                    }

                    if (!Array.isArray(pushData.obj1)) {
                        return console.log('You cannot do this because the last element of the first argument is not an array! (updateData/$push)');
                    }

                    pushData.obj1.push(pushData.obj2);
                    await repo.save(repoData);
                    return 'Data updated successfully.';
                };

                case '$pull': {
                    const { $pull } = updType;

                    if (!$pull) {
                        return console.log('Failed to update data: $pull was not specified. (updateData/$pull)');
                    }

                    const data = { ...$pull };
                    const pull = new DataManipulator(repoData, data, path);
                    const pullData = pull.build();

                    if (typeof pullData === 'string') {
                        return console.log(`Failed to update data: ${pullData}. (updateData/$pull)`);
                    }

                    if (!Array.isArray(pullData.obj1)) {
                        return console.log('You cannot do this because the last element of the first argument is not an array! (updateData/$pull)');
                    }

                    pullData.obj1 = pullData.obj2.filter((item: any) => item != pullData.obj2);
                    await repo.save(repoData);
                    return 'Data updated successfully.';
                };

                case '$set': {
                    const { $set } = updType;

                    if (!$set) {
                        return console.log('Failed to update data: $set was not specified. (updateData/$set)');
                    }

                    const data = { ...$set };
                    const set = new DataManipulator(repoData, data, path);
                    const setData = set.build();

                    if (typeof setData === 'string') {
                        return console.log(`Failed to update data: ${setData}. (updateData/$set)`);
                    }

                    setData.obj1 = setData.obj2;
                    await repo.save(repoData);
                    return 'Data updated successfully.';
                };

                default: return console.log(`The ${updTypeAction} option is not available in the Database.updateData method! Available: $push, $pull or $set. (updateData)`);
            }
        } catch (error: any) {
            return console.log('Error while updating data. (updateData). Error:', error);
        }
    }

    /**
     * Method for viewing a table by specified columns
     * @param {string} repoName - table name.
     * @param {(string | string[])} fieldNamesArray - name (or names) of columns in table.
     * @returns {Promise<{res: ObjectLiteral[] | null; status: boolean | null; error: null | string;}>} Promise with query results or error.
     */
    async selectData(repoName: string, fieldNamesArray: string | string[]): Promise<{ res: ObjectLiteral[] | null; status: boolean | null; error: null | string; }> {
        const repo = collectionEntity.get(repoName);

        if (!repo) return { error: 'The specified name was not found in the collection! (selectData)', res: null, status: null };

        const selectionRef = Array.isArray(fieldNamesArray) ? fieldNamesArray : [fieldNamesArray];

        try {
            const res = await repo.find({ select: selectionRef });

            if (!res || res.length === 0) return { error: 'It looks like nothing was found with the specified data.', res: null, status: false };

            return { error: null, res: res, status: true };
        } catch (e: any) {
            console.error(e);
            return { error: e.message, res: null, status: null };
        }
    }
}