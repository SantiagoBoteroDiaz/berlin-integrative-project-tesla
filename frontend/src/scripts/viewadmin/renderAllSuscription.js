import { suscriptionContent } from "../doom.js"; 
import { allSuscriptions } from "../api/suscription.api.js";  

export async function suscription() {
    const response = await allSuscriptions() ; 
    console.log(response);
    
    response.result.forEach(suscriptions => {
        suscriptionContent.innerHTML += `
                    <tr class="border-t border-slate-800 hover:bg-slate-800">
                        <td class="p-4">${suscriptions.plate}</td>
                        <td class="p-4">${suscriptions.vehicle_type}</td>
                        <td class="p-4">${suscriptions.plan}</td>
                        <td class="p-4">${suscriptions.start_date}</td>
                        <td class="p-4">${suscriptions.end_date}</td>
                        <td class="p-4">${suscriptions.active}</td>
                    </tr>
        `
    });
} 

export async function renderSuscriptions() {
    if(!suscriptionContent) return; 
    suscription(); 
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