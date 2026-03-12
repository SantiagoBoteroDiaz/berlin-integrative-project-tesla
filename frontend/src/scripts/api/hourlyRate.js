const API = "https://berlin-integrative-project-tesla-production.up.railway.app/vehicle/hourlyRate" 

export async function allSuscriptions() {
    const res = await fetch(API);
    return res.json() ;     
}; 
