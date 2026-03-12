import { bntCar, bntBike, containerBike, containerCar } from "../doom.js"


function bntSubcribeCar () {
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

            <button id="subscribe_confirm_car"  type="submit"
                class="bg-blue-500 hover:bg-blue-600 w-full py-3 rounded-xl font-semibold transition">
                Confirm subscription    
            </button>

        `;
        bntCar.style.display = "none";

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

            <button id="subscribe_confirm_bike" type="submit"
                class="bg-green-500 hover:bg-green-600 w-full py-3 rounded-xl font-semibold transition">
                Confirm subscription   
            </button>
            
        `;
        bntBike.style.display = "none";

    });
};


export function bntsSuscriptions () {
    if (!bntCar || !bntBike) return;
    bntSubcribeCar();
    bntSubcribeBike();
};