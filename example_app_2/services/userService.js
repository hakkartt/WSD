import { executeQuery } from "../database/database.js";

const addUser = async (name, address, email, password) => {
  await executeQuery(
    `INSERT INTO users
      (name, address, email, password)
        VALUES ($1, $2, $3, $4)`,
    name,
    address,
    email,
    password,
  );
};

const findUserByEmail = async (email) => {
    const result = await executeQuery(
      "SELECT * FROM users WHERE email = $1",
      email,
    );
  
    return result.rows;
  };
  
export { addUser, findUserByEmail };
