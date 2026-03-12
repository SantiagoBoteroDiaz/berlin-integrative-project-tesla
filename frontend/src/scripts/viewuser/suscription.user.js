import { bntCar, bntBike, containerBike, containerCar , hola } from "../doom.js"


function bntSubcribeCar() {
    bntCar.addEventListener('click', e => {
        e.preventDefault();

        containerCar.innerHTML = `
            <input 
            id="plate_car"
            type="text"
            placeholder="ABC123"
            oninput="this.value = this.value.toUpperCase()"
            class="w-full mb-6 bg-slate-800 border border-slate-700 rounded-xl p-3 
            text-center text-lg tracking-widest uppercase
            focus:outline-none focus:border-blue-500">
        `;

    });

};

function bntSubcribeBike () {
    bntBike.addEventListener(`click`, e => {
        
        e.preventDefault()

        containerBike.innerHTML = `
            <input 
            id="plate_bike"
            type="text"
            placeholder="ABC12D"
            oninput="this.value = this.value.toUpperCase()"
            class="w-full mb-6 bg-slate-800 border border-slate-700 rounded-xl p-3 
            text-center text-lg tracking-widest uppercase
            focus:outline-none focus:border-green-500">

            
        `;
    });
};


export function bntsSuscriptions(){
    if(!bntCar || !bntBike) return;
    bntSubcribeCar();
    bntSubcribeBike();
};