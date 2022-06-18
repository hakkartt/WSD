import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";
import { executeQuery } from "../database/database.js";

const lastUploadedId = async () => {
  const res = await executeQuery(
    "SELECT MAX(id) as max_id FROM miniupload_files;",
  );
  if (res && res.rows && res.rows.length == 1) {
    return res.rows[0].max_id;
  } else {
    return -1;
  }
};

const storeToDatabase = async (details, data) => {
  const pw = `${Math.floor(100000 * Math.random())}`;
  const hash = await bcrypt.hash(pw)
  await executeQuery(
    "INSERT INTO miniupload_files (name, type, password, data) VALUES ($1, $2, $3, $4);",
    details.originalName,
    details.contentType,
    hash,
    data,
  );
  return pw;
};

const getFile = async (id) => {
  const res = await executeQuery(
    "SELECT * FROM miniupload_files WHERE id = $1;", 
    id
  );
  return res.rows[0]
};

export { lastUploadedId, storeToDatabase, getFile };
