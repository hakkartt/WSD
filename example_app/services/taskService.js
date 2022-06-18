import { executeQuery } from "../database/database.js";

const completeById = async (id) => {
  await executeQuery("UPDATE tasks SET completed = true WHERE id = $1;", id);
};

const create = async (name) => {
  await executeQuery("INSERT INTO tasks (name) VALUES ($1);", name);
};

const findAllNonCompletedTasks = async () => {
  let result = await executeQuery(
    "SELECT * FROM tasks WHERE completed = false;",
  );
  return result.rows;
};

const findById = async (id) => {
  let result = await executeQuery("SELECT * FROM tasks WHERE id = $1;", id);
  if (result.rows && result.rows.length > 0) {
    return result.rows[0];
  }

  return { id: 0, name: "Unknown" };
};

export { completeById, create, findAllNonCompletedTasks, findById };