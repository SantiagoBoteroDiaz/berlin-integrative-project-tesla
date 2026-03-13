import { allSuscriptions } from "../api/hourlyRate.js"; 
import { hourlyContent } from "../doom.js";


export async function hourlyRate() {
    const response = await allSuscriptions() ; 
    console.log(response);
    
    response.result.forEach(suscriptions => {
        hourlyContent.innerHTML += `
                    <tr class="border-t border-slate-800 hover:bg-slate-800">
                        <td class="p-4">${suscriptions.plate}</td>
                        <td class="p-4">${suscriptions.vehicle_type}</td>
                        <td class="p-4">${suscriptions.entry_time}</td>
                        <td class="p-4">${suscriptions.exit_time}</td>
                        <td class="p-4">${suscriptions.status}</td>
                    </tr>
        `
    });
} 

export async function renderHourlyRate() {
    if(!hourlyContent) return; 
    hourlyRate(); 
}

