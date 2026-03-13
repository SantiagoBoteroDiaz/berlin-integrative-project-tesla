const API = "https://berlin-integrative-project-tesla-production.up.railway.app/vehicle/suscription" 

export async function allSuscriptions() {
    const res = await fetch(API);
    return res.json() ;     
}; 

export async function newSub(plate) {
    
    const response = await fetch(API,{
        method : "POST",
        headers : { "Content-Type": "application/json"},
        body : JSON.stringify({
            plate
        })
    });

    const data = await response.json();

    return data;

};