import { Router } from "../deps.js";
import { register, login, logout } from "./api/auth.js";
import { getMood } from "./api/public.js";
import { reportEvening, reportMorning } from "./api/report.js";
import { getAverages, getAllReports } from "./api/user.js";
import {
  showLogin,
  showRegister,
  showLanding,
} from "./controller/noUserController.js";
import {
  showHome,
  showReportEvening,
  showReportMoning,
} from "./controller/userController.js";

const router = new Router();

router.get("/home", showLanding);

router.get("/behavior/reporting", showHome);
router.get("/behavior/reporting/morning", showReportMoning);
router.get("/behavior/reporting/evening", showReportEvening);
router.post("/behavior/reporting/morning", reportMorning);
router.post("/behavior/reporting/evening", reportEvening);

router.get("/data/reports", getAverages);
router.get("/data/reports/all", getAllReports);

// Public data
router.get("/api/mood", getMood);

// Auth
router.get("/auth/login", showLogin);
router.get("/auth/registration", showRegister);
router.post("/auth/registration", register);
router.post("/auth/login", login);
router.post("/auth/logout", logout);

export { router };
