import { executeQuery } from "../database/database.js";

const create = async (sender, message) => {
  await executeQuery(
    "INSERT INTO messages (sender, message) VALUES ($1, $2);",
    sender,
    message,
  );
};

const findAll = async () => {
  let result = await executeQuery(
      "SELECT * FROM (SELECT * FROM messages ORDER BY id DESC LIMIT 5) tmp ORDER BY tmp.id ASC;"
  );
  return result.rows;
};

export { create, findAll };