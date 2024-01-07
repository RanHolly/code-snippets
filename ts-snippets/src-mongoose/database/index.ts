import { DeleteResult } from "mongodb";
import { Document, UpdateWriteOpResult, Model, QueryOptions, FilterQuery } from "mongoose";
import { modelsMap, ModelsName, ModelsTable } from "./models";

export const missModelError = `Are you sure this table (model) exists? Check the table(model) name again.`;
export const createOrUpdateError = `An error occurred while creating/updating a record. Look in the terminal/console.`;
export const findError = `According to the data provided, nothing was found.`;

//for types - I recommend creating a .d.ts file. In my case I will do them here
type ModelType<T extends ModelsName> = Model<ModelsTable[T]>;
type FilterType<T extends ModelsName> = Partial<ModelsTable[T]>;
type UpdateType<T extends ModelsName> = Partial<ModelsTable[T]> | QueryOptions<Partial<ModelsTable[T]>>;

/** Class for working with the mongodb database. 
 * 
 * Options (like $and or others) in the filter are not currently supported due to the "any" on filter when selecting the options we need. 
 * 
 * If you don't want to bother with this, add `| FilterQuery<ModelsTable[T]>` in type FilerType.
 * 
 * Or just replace `type FilterType` with this:
 * ```js
 * type FilterType<T extends ModelsName> = Partial<ModelsTable[T]> | FilterQuery<ModelsTable[T]>
 * ```
 */
export class Database {
  private readonly model = modelsMap;

  private action<T extends ModelsName>(name: T): ModelType<T> | undefined {
    // I intentionally changed the type to unknown (not any) and then to ModelType<T>. 
    return name in this.model ? (this.model[name] as unknown as ModelType<T>) : undefined;
  }

  async findOne<T extends ModelsName>(filter: FilterType<T>, tableName: T): Promise<{ error: null | string; res: ModelsTable[T] | null }> {
    const model = this.action(tableName);

    if (!model) return { error: missModelError, res: null };

    const find = await model.findOne(filter);

    if (!find) return { error: findError, res: null };

    return { error: null, res: find };
  }

  async find<T extends ModelsName>(filter: FilterType<T>, tableName: T): Promise<{ error: null | string; res: ModelsTable[T][] | [] }> {
    const model = this.action(tableName);

    if (!model) return { error: missModelError, res: [] };

    const find = await model.find(filter);

    return { error: null, res: find };
  }

  async create<T extends ModelsName>(document: ModelsTable[T], tableName: T): Promise<{ error: null | string; res: Document<unknown, object, ModelsTable[T]> | null }> {
    const model = this.action(tableName);

    if (!model) return { error: missModelError, res: null };

    try {
      const created: Document<unknown, object, ModelsTable[T]> = new model(document);
      created.save();
      return { error: null, res: created };
    } catch (e) {
      console.error(e);
      return { error: createOrUpdateError, res: null };
    }
  }

  async deleteOne<T extends ModelsName>(filter: FilterType<T>, tableName: T): Promise<{ error: null | string; res: DeleteResult | null }> {
    const model = this.action(tableName);

    if (!model) return { error: missModelError, res: null };

    return { error: null, res: await model.deleteOne(filter) };
  }

  async deleteMany<T extends ModelsName>(filter: FilterType<T>, tableName: T): Promise<{ error: null | string; res: DeleteResult | null }> {
    const model = this.action(tableName);

    if (!model) return { error: missModelError, res: null };

    return { error: null, res: await model.deleteMany(filter) };
  }

  async findOneOrCreate<T extends ModelsName>(filter: FilterType<T>, document: ModelsTable[T], tableName: T): Promise<{ error: null | string; res: ModelsTable[T] | Document<unknown, object, ModelsTable[T]> | null; created: boolean | null }> {
    const model = this.action(tableName);

    if (!model) return { error: missModelError, res: null, created: null };

    const find = await this.findOne(filter, tableName);

    if (find.error) return { created: true, ...(await this.create(document, tableName)) };

    return { created: false, ...find };
  }

  async findOneAndUpdateOrCreate<T extends ModelsName>(filter: FilterType<T>, update: UpdateType<T>, document: ModelsTable[T], tableName: T, updOptions?: UpdateType<T>): Promise<{ error: null | string; res: ModelsTable[T] | Document<unknown, object, ModelsTable[T]> | null; created: boolean | null }> {
    const model = this.action(tableName);

    if (!model) return { error: missModelError, res: null, created: null };
    if (!document) return { error: `Вы не указали данные для создания таблицы, если её нет!`, res: null, created: null };

    const find = await this.findOne(filter, tableName);

    if (find.error) return { created: true, ...(await this.create(document, tableName)) };

    return { created: false, ...(await this.findOneAndUpdate(filter, update, tableName, updOptions)) };
  }

  async updateOne<T extends ModelsName>(filter: FilterType<T>, update: UpdateType<T>, tableName: T, options?: UpdateType<T>): Promise<{ error: null | string; res: UpdateWriteOpResult | null }> {
    const model = this.action(tableName);

    if (!model) return { error: missModelError, res: null };

    try {
      const updated = await model.updateOne(filter, update, options);

      return { error: null, res: updated };
    } catch (e) {
      console.error(e);
      return { error: createOrUpdateError, res: null };
    }
  }

  async updateMany<T extends ModelsName>(filter: FilterType<T>, update: UpdateType<T>, tableName: T, options?: UpdateType<T>): Promise<{ error: null | string; res: UpdateWriteOpResult | null }> {
    const model = this.action(tableName);

    if (!model) return { error: createOrUpdateError, res: null };

    try {
      const updated = await model.updateMany(filter, update, options);

      return { error: null, res: updated };
    } catch (e) {
      console.error(e);
      return { error: createOrUpdateError, res: null };
    }
  }

  async findOneAndUpdate<T extends ModelsName>(filter: FilterType<T>, update: UpdateType<T>, tableName: T, options?: UpdateType<T>): Promise<{ error: null | string; res: ModelsTable[T] | null }> {
    const model = this.action(tableName);

    if (!model) return { error: createOrUpdateError, res: null };

    try {
      const updated = await model.findOneAndUpdate(filter, update, options);

      return { error: null, res: updated };
    } catch (e) {
      console.error(e);
      return { error: createOrUpdateError, res: null };
    }
  }
}
