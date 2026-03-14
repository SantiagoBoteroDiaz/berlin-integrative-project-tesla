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

            <button id="subscribe_confirm_car"  type="button"
                class="bg-blue-500 hover:bg-blue-600 w-full py-3 rounded-xl font-semibold transition">
                Confirm subscription    
            </button>

        `;
        bntCar.style.display = "none";

        const bntConfirm = document.getElementById("subscribe_confirm_car");
        bntConfirm.addEventListener('click', newSubCar);

    });

};

async function newSubCar(e) {
    e.preventDefault()

    const plate = document.getElementById("plate_car").value.trim().toUpperCase();
    const plan = "Car Monthly Plan";
    const amount = 221000;

    if (!plate) {
        alert("Enter plate first");
        return;
    }

   



    window.location.href = sandboxInitPoint;

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

        const bntConfirm = document.getElementById("subscribe_confirm_bike");
        bntConfirm.addEventListener('click', newSubBike);

    });
};


async function newSubBike(e) {
    e.preventDefault()

    const plate = document.getElementById("plate_bike").value.trim().toUpperCase();
    const plan = "Motorcycle Monthly Plan";
    const amount = 152000;

    if (!plate) {
        alert("Enter plate first");
        return;
    }

   



    window.location.href = sandboxInitPoint;

};


export function bntsSuscriptions () {
    if (!bntCar || !bntBike) return;
    bntSubcribeCar();
    bntSubcribeBike();
};