import { executeQuery } from "../../database/database.js";
import { bcrypt, validate, required, isEmail, minLength } from "../../deps.js";

const handleErrors = (errors, session, response, isLoginError = false) => {
  session.set("errors", errors);
  response.redirect(isLoginError ? "/auth/login" : "/auth/registration");
};

const loginValidationRules = {
  email: [required],
  password: [required],
};

const registrationValidationRules = {
  email: [required, isEmail],
  password: [required, minLength(4)],
  verification: [required, minLength(4)],
};

const register = async ({ request, response, session }) => {
  const body = request.body();
  const params = await body.value;

  const email = params.get("email");
  const password = params.get("password");
  const verification = params.get("verification");

  await session.set("RegistrationEmailInput", email);

  const [passes, errors] = await validate(
    { email, password, verification },
    registrationValidationRules
  );

  if (!passes) {
    handleErrors(errors, session, response);
    return;
  }

  if (password !== verification) {
    handleErrors(errors, session, response);
    return;
  }

  const existingUsers = await executeQuery(
    "SELECT * FROM users WHERE email = $1",
    email
  );

  if (existingUsers.rowCount > 0) {
    handleErrors(
      { email: { reserved: "The email is already reserved." } },
      session,
      response
    );
    return;
  }

  const hash = await bcrypt.hash(password);

  await executeQuery(
    "INSERT INTO users (email, password) VALUES ($1, $2);",
    email,
    hash
  );

  response.redirect("/auth/login");
};

const login = async ({ request, response, session }) => {
  const body = request.body();
  const params = await body.value;

  const email = params.get("email");
  const password = params.get("password");

  const [passes, errors] = await validate(
    { email, password },
    loginValidationRules
  );

  if (!passes) {
    handleErrors(errors, session, response, true);
    return;
  }

  // check if the email exists in the database
  const res = await executeQuery(
    "SELECT * FROM users WHERE email = $1;",
    email
  );

  if (res.rowCount === 0) {
    handleErrors(
      { both: { noMatch: "Invalid email or password" } },
      session,
      response,
      true
    );
    return;
  }

  // take the first row from the results
  const userObj = res.rowsOfObjects()[0];

  const hash = userObj.password;

  const passwordCorrect = await bcrypt.compare(password, hash);
  if (!passwordCorrect) {
    handleErrors(
      { both: { noMatch: "Invalid email or password" } },
      session,
      response,
      true
    );
    return;
  }

  await session.set("authenticated", true);
  await session.set("user", {
    id: userObj.id,
    email: userObj.email,
  });

  response.redirect("/behavior/reporting");
};

const logout = async ({ response, session }) => {
  await session.set("authenticated", null);
  await session.set("user", null);
  await session.set("RegistrationEmailInput", null);
  response.redirect("/");
};

export { register, login, logout };
