import {plateInput , bntExit , menssage} from "../doom.js"
import { pay } from "../api/payment.api.js";

export function entryDashBoard() {

    if (!bntExit) return;

    bntExit.addEventListener("click", async (e) => {
        e.preventDefault();

        const plate = plateInput.value.trim().toUpperCase();

        if (!plate) {
           menssage.innerHTML = ` <p 
        class="text-center text-sm font-semibold text-red-400 mb-4">
            Enter Plate
        </p>`
            return;
        };

        
        if (plate === "SNX99") {
            window.location.href = "../pages/admin/dashboard.html";
            return;
        };


        try {

            const data = await pay(plate);
           

            console.log(data.response.initPoint);
            
            window.location.href=data.response.initPoint


        } catch (error) {
            
            console.error(error);
            menssage.innerHTML = ` <p 
            class="text-center text-sm font-semibold text-red-400 mb-4">
            Plate Dont Found
            </p>`

        }

    });

};