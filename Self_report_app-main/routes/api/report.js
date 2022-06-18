import { executeQuery } from "../../database/database.js";
import {
  validate,
  required,
  isNumber,
  maxNumber,
  minNumber,
} from "../../deps.js";

const morningValidationRules = {
  date: [required],
  sport: [required, isNumber, minNumber(0), maxNumber(24)],
  study: [required, isNumber, minNumber(0), maxNumber(24)],
  eating: [required, isNumber, minNumber(1), maxNumber(5)],
  mood: [required, isNumber, minNumber(1), maxNumber(5)],
};

const reportEvening = async ({ request, response, session }) => {
  const user = await session.get("user");
  const body = request.body();
  const params = await body.value;

  const date = new Date(params.get("dateInput"));
  date.setDate(date.getDate() + 1); // database sets date to UTC, i.e. to the previous date.

  const sport = params.get("sport");
  const study = params.get("study");
  const eating = params.get("eating");
  const mood = params.get("mood");

  const [passes, errors] = await validate(
    { date, sport, study, eating, mood },
    morningValidationRules
  );

  if (!passes) {
    await session.set("errors", errors);
  }

  if (!user) {
    response.status = 401;
  }

  const existingReportRes = await executeQuery(
    "SELECT * FROM reports WHERE user_id = $1 AND date = $2 AND is_Morning = false",
    user.id,
    date
  );

  await executeQuery(
    "INSERT INTO reports (date, sport, study, eating, mood, is_Morning, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7);",
    date,
    sport,
    study,
    eating,
    mood,
    false,
    user.id
  );

  if (existingReportRes && existingReportRes.rowCount > 0) {
    const existingReport = existingReportRes.rowsOfObjects()[0];
    await executeQuery("DELETE FROM reports WHERE id = $1", existingReport.id);
  }

  response.redirect("/behavior/reporting");
};

const reportMorning = async ({ request, response, session }) => {
  const user = await session.get("user");
  const body = request.body();
  const params = await body.value;

  const date = params.get("dateInput");
  const sleep = params.get("sleep");
  const quality = params.get("quality");
  const mood = params.get("mood");

  const [passes, errors] = await validate(
    { date, sleep, quality, mood },
    morningValidationRules
  );

  if (!passes) {
    await session.set("errors", errors);
  }

  if (!user) {
    response.status = 401;
  }

  const existingReportRes = await executeQuery(
    "SELECT * FROM reports WHERE user_id = $1 AND date = $2 AND is_Morning = true",
    user.id,
    date
  );

  await executeQuery(
    "INSERT INTO reports (date, sleep, quality, mood, is_Morning, user_id ) VALUES ($1, $2, $3, $4, $5, $6);",
    date,
    sleep,
    quality,
    mood,
    true,
    user.id
  );

  if (existingReportRes && existingReportRes.rowCount > 0) {
    const existingReport = existingReportRes.rowsOfObjects()[0];
    await executeQuery("DELETE FROM reports WHERE id = $1", existingReport.id);
  }

  response.redirect("/behavior/reporting");
};

export { reportMorning, reportEvening };
