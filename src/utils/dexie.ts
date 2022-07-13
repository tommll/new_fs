import Dexie from "dexie";
/* Just for code completion and compilation - defines
 * the interface of objects stored in the emails table.
 */
export interface IColumns {
  id: string;
  name: string;
  h: number;
}
const version = 1;
export class RPTable extends Dexie {
  columns!: Dexie.Table<IColumns, string>;
  jpmData!: Dexie.Table<Record<string, any>, string>;
  jobs!: Dexie.Table<Record<string, any>, string>;
  users!: Dexie.Table<Record<string, any>, string>;

  constructor() {
    super("rp-table");

    var db = this;

    db.version(11).stores({
      columns: "id, name, h",
      jpmData: "id, name",
      jobs: "id, name",
      users: "id, name"
    });
  }
}

export const rpTable = new RPTable();

export const changeSchema = async (db: Dexie, schemaChanges: any) => {
  db.close();
  const newDb = new Dexie(db.name);

  newDb.on("blocked", () => false); // Silence console warning of blocked event.
  // Workaround: If DB is empty from tables, it needs to be recreated
  if (db.tables.length === 0) {
    await db.delete();
    newDb.version(1).stores(schemaChanges);
    return await newDb.open();
  }

  // Extract current schema in dexie format:
  const currentSchema = db.tables.reduce((result, { name, schema }) => {
    // @ts-ignore
    result[name] = [
      schema.primKey.src,
      ...schema.indexes.map((idx) => idx.src)
    ].join(",");
    return result;
  }, {});

  // Tell Dexie about current schema:
  newDb.version(db.verno).stores(currentSchema);
  // Tell Dexie about next schema:
  newDb.version(db.verno + 1).stores(schemaChanges);
  // Upgrade it:
  return await newDb.open();
};

export const deleteTable = () => {
  Dexie.delete("rp-table");
};
