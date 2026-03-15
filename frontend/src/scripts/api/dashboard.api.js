const API = "https://berlin-integrative-project-tesla-production.up.railway.app/vehicle/dashboard" ; 

export async function dashboard() {
    const res = await fetch(API);
    return res.json() ;     
}; 
