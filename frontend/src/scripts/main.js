import { bntsSuscriptions } from "./viewuser/suscription.user.js";
import { renderHourlyRate } from "./viewadmin/renderAllHourlyRate.js";
import { renderSuscriptions } from "./viewadmin/renderAllSuscription.js";
import {entryDashBoard} from "./viewuser/vehicleExit.js"
import { renderDashboard } from "./viewadmin/dashboard.admin.js";
// ViewUser

entryDashBoard();
bntsSuscriptions(); 
renderHourlyRate(); 
renderSuscriptions(); 
renderDashboard();


