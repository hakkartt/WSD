import { executeQuery } from "../database/database.js";

const findAll = async () => {
  return await executeQuery("SELECT * FROM tickets");
};

const add = async (content) => {
  await executeQuery(
    "INSERT INTO tickets (content, reported_on) VALUES ($1, NOW());",
    content,
  );
};

const resolve = async (ticketId) => {
  await executeQuery(
    "UPDATE tickets SET resolved_on = NOW() WHERE id = $1",
    ticketId,
  );
};

const remove = async (ticketId) => {
  await executeQuery(
    "DELETE FROM tickets WHERE id = $1",
    ticketId,
  );
};

export { add, findAll, resolve, remove };
