import { executeQuery } from "../database/database.js";

const create = async (name) => {
  await executeQuery(
    "INSERT INTO animals (name) VALUES ($1);",
    name,
  );
};

const deleteById = async (id) => {
  await executeQuery(
    "DELETE FROM animals WHERE id = $1;",
    id,
  );
};

const findAll = async () => {
  let result = await executeQuery("SELECT * FROM animals;");
  return result.rows;
};

export { create, deleteById, findAll };
