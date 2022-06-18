import { executeQuery } from "../../database/database.js";

const getMood = async ({ response }) => {
  const yesterday = new Date().toISOString().split("T")[0];

  let today = new Date();
  today.setDate(today.getDate() + 1);
  today = today.toISOString().split("T")[0];

  let moodToday = null;
  let moodYesterday = null;

  const resToday = await executeQuery(
    "SELECT ROUND(AVG(mood)::numeric,1) AS mood FROM reports WHERE date=$1",
    today
  );

  const resYesterday = await executeQuery(
    "SELECT ROUND(AVG(mood)::numeric,1) AS mood FROM reports WHERE date=$1",
    yesterday
  );

  if (resToday && resToday.rowCount > 0) {
    const obj = resToday.rowsOfObjects()[0];
    moodToday = obj.mood;
  }

  if (resYesterday && resYesterday.rowCount > 0) {
    const obj = resYesterday.rowsOfObjects()[0];
    moodYesterday = obj.mood;
  }

  response.body = { today: moodToday, yesterday: moodYesterday };
};

export { getMood };
