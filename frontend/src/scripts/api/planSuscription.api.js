const API = "https://berlin-integrative-project-tesla-production.up.railway.app/vehicle/payment/subscription"

export async function newplan( plate , planType , amount ) {

    const response = await fetch(API, {
        method : "POST",
        headers : {  "Content-Type": "application/json" },
        body: JSON.stringify({plate, planType, amount})

    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Backend says:", data);
        throw new Error(data.message || "Payment API error");
    };

    return data;
    
};