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

//  "plate": "JCR171",
//       "vehicle_type": "car",
//       "plan": "Car Monthly Plan",
//       "start_date": "2026-03-12T01:13:35.664Z",
//       "end_date": "2026-04-11T01:13:35.664Z",
//       "active": true 

//  "plate": "BDA211",
//       "vehicle_type": "car",
//       "entry_time": "2026-03-11T05:02:55.002Z",
//       "exit_time": "2026-03-11T05:03:25.302Z",
//       "status": "FINISHED",
//       "status_payment": "PAID"