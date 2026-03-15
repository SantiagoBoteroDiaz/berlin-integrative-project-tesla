import { bntCar, bntBike, containerBike, containerCar } from "../doom.js"
import { newplan } from "../api/planSuscription.api.js";


function bntSubcribeCar() {
    bntCar.addEventListener('click', e => {
        e.preventDefault();

       containerCar.innerHTML = `
    <div class="relative mb-5">
        <input
            id="plate_car"
            type="text"
            autocomplete="off"
            placeholder="Ej: LBM623"
            oninput="this.value = this.value.toUpperCase()"
            class="
                w-full
                bg-slate-900/60
                border border-slate-700
                focus:border-blue-500
                focus:ring-2 focus:ring-blue-500/30
                text-center
                tracking-[0.35em]
                text-slate-200
                placeholder-slate-500
                text-sm
                py-4
                rounded-2xl
                outline-none
                transition
                backdrop-blur-md
            "
        >
    </div>

    <p id="message_car"
        class="text-center text-sm font-semibold text-red-400 mb-4 opacity-0 transition">
    </p>

    <button
        id="subscribe_confirm_car"
        class="
            w-full
            py-3
            rounded-2xl
            font-semibold
            bg-gradient-to-r from-blue-500 to-blue-600
            hover:from-blue-600 hover:to-blue-700
            active:scale-[.98]
            transition
            shadow-lg shadow-blue-900/30
        ">
        Confirm subscription
    </button>
`;
        bntCar.style.display = "none";

        const bntConfirm = document.getElementById("subscribe_confirm_car");
        bntConfirm.addEventListener('click', newSubCar);

    });

};

async function newSubCar(e) {
    e.preventDefault();

    const plate = document.getElementById("plate_car").value.trim().toUpperCase();
    const planType = "Car Monthly Plan";
    const amount = 221000;

    if (!plate) {
        const p = document.getElementById("message_car");
        p.textContent = "Enter Plate";
        p.classList.remove("opacity-0");
        return;
    }

    try {

        const result = await newplan(plate, planType, amount);



        window.location.href = result.response.sandboxInitPoint;

    } catch (error) {
        console.error(error);
        alert("Error creating subscription");
    }
}


function bntSubcribeBike() {
    bntBike.addEventListener(`click`, e => {

        e.preventDefault()

      containerBike.innerHTML = `
    <div class="relative mb-5">
        <input
            id="plate_bike"
            type="text"
            autocomplete="off"
            placeholder="Ej: AKJ12B"
            oninput="this.value = this.value.toUpperCase()"
            class="
                w-full
                bg-slate-900/60
                border border-slate-700
                focus:border-blue-500
                focus:ring-2 focus:ring-blue-500/30
                text-center
                tracking-[0.35em]
                text-slate-200
                placeholder-slate-500
                text-sm
                py-4
                rounded-2xl
                outline-none
                transition
                backdrop-blur-md
            "
        >
    </div>
    
    
    <p id="message_bike"
        class="text-center text-sm font-semibold text-red-400 mb-4 opacity-0 transition">
    </p>

    <button
        id="subscribe_confirm_bike"
        class="
            w-full
            py-3
            rounded-2xl
            font-semibold
            bg-gradient-to-r from-emerald-500 to-green-500
            hover:from-emerald-600 hover:to-green-600
            active:scale-[.98]
            transition
            shadow-lg shadow-emerald-900/30
        ">
        Confirm subscription
    </button>
`;
        bntBike.style.display = "none";

        const bntConfirm = document.getElementById("subscribe_confirm_bike");
        bntConfirm.addEventListener('click', newSubBike);

    });
};


async function newSubBike(e) {
    e.preventDefault();

    const plate = document.getElementById("plate_bike").value.trim().toUpperCase();
    const planType = "Motorcycle Monthly Plan";
    const amount = 152000;

    if (!plate) {
        const p = document.getElementById("message_bike");
        p.textContent = "Enter Plate";
        p.classList.remove("opacity-0");
        return;
    };

    try {

        const result = await newplan(plate, planType, amount);

        
        
        window.location.href = result.response.sandboxInitPoint;

        

    } catch (error) {
        console.error(error);
        alert("Error creating subscription");
    }

};


export function bntsSuscriptions() {
    if (!bntCar || !bntBike) return;
    bntSubcribeCar();
    bntSubcribeBike();
};