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

