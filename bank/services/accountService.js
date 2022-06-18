import { executeQuery } from "../database/database.js";

const findAccountsByUser = async (user_id) => {
    return await executeQuery(
      "SELECT * FROM accounts WHERE user_id = $1",
      user_id,
    );
  };

const addAccount = async (name, user_id) => {
  await executeQuery(
    "INSERT INTO accounts (name, user_id) VALUES ($1, $2);",
    name,
    user_id,
  );
};

const findAccountById = async (id) => {
  return await executeQuery(
    "SELECT * FROM accounts WHERE id = $1",
    id,
  );
};

const deposit = async (id, amount) => {
  await executeQuery(
    "UPDATE accounts SET balance = balance + $1 WHERE id = $2;",
    amount,
    id,
  );
}

const withdraw = async (id, amount) => {
  await executeQuery(
    "UPDATE accounts SET balance = balance - $1 WHERE id = $2;",
    amount,
    id,
  );
}

const hasEnough = async (id, amount) => {
  const res = await executeQuery(
    "SELECT * FROM accounts WHERE id = $1;",
    id,
  );
  const balance = res.rows[0].balance;
  const a = balance - amount;
  console.log(a);
  if (a >= 0) {
    return true;
  } else {
    return false;
  }
}

const getUserByAccountId = async (id) => {
  const res = await executeQuery(
    "SELECT user_id FROM accounts WHERE id = $1;",
    id,
  );
  return res.rows[0]
}
  
export { 
  findAccountsByUser, addAccount, findAccountById,
  deposit, withdraw, hasEnough, getUserByAccountId };