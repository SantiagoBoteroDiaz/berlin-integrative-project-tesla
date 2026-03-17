import { dashboard } from "../api/dashboard.api.js"; 
import{vehiclesParked, revenueToday, plate, totalSuscriptions} from "../doom.js"

export async function dashboardParams() {
    const params = await dashboard(); 
    vehiclesParked.textContent=`${params[0].vehicles_parked}`
    revenueToday.textContent=`${params[0].revenue_today}`
    plate.textContent=`${params[0].last_plate_entered}`
    totalSuscriptions.textContent=`${params[0].active_subscriptions}` 
}

export async function renderDashboard() {
    if(!vehiclesParked, !revenueToday, !plate, !totalSuscriptions) return; 
    dashboardParams(); 
}

