import { response } from "express";

const API = "https://berlin-integrative-project-tesla-production.up.railway.app/vehicle/suscription"

export async function allSuscriptions() {
    const res = await fetch(API,{
        method : "POST",
        headers:{"Content-Type":"application/json"},

    });
    
};

export async function getSuscriptions() {
  const response = await fetch(API);
  
  const data = await response.json();

  return data;
};