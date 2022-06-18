import { executeQuery } from "../../database/database.js";

const getAllReports = async ({ response, session }) => {
  const user = await session.get("user");

  if (!user) {
    response.status = 401;
  }

  const res = await executeQuery(
    `SELECT *, 
    extract('isoyear' from date) as year,
    extract('month' from date) as month,
    extract('week' from date) as week
    FROM reports WHERE user_id = $1`,
    user.id
  );

  const reports = res && res.rowCount > 0 ? res.rowsOfObjects() : [];
  response.body = reports;
};

const getAverages = async ({ request, response, session }) => {
  const user = await session.get("user");
  let year = request.url.searchParams.get("year");
  let month = request.url.searchParams.get("month");
  let week = request.url.searchParams.get("week");

  week = week ? Number(week) : null;
  month = month ? Number(month) : null;

  if (!user) {
    response.status = 401;
  }

  const res = await executeQuery(
    `SELECT 
    ROUND(AVG(sleep)::numeric,1) AS sleep,
    ROUND(AVG(quality)::numeric,1) AS quality,
    ROUND(AVG(mood)::numeric,1) AS mood,
    ROUND(AVG(sport)::numeric,1) AS sport,
    ROUND(AVG(study)::numeric,1) AS study,
    ROUND(AVG(eating)::numeric,1) AS eating
    FROM (SELECT *, 
    extract('isoyear' from date) as year,
    extract('month' from date) as month,
    extract('week' from date) as week
    FROM reports WHERE user_id = $1) 
    AS reports WHERE ($2::integer IS NULL OR week = $2) AND 
    ($3::integer IS NULL OR month = $3)
    AND year = $4`,
    user.id,
    week,
    month,
    Number(year)
  );

  if (res && res.rowCount > 0) {
    const averages = res.rowsOfObjects()[0];
    response.body = averages;

    return;
  }

  response.body = [];
  return;
};

export { getAllReports, getAverages };
