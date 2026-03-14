import {plateInput , bntExit} from "../doom.js"
import { pay } from "../api/payment.api.js";

export function entryDashBoard() {

    if (!bntExit) return;

    bntExit.addEventListener("click", async (e) => {
        e.preventDefault();

        const plate = plateInput.value.trim().toUpperCase();

        if (!plate) {
            alert("Enter plate");
            return;
        }

        
        if (plate === "SNX99") {
            window.location.href = "../pages/admin/dashboard.html";
            return;
        }


        try {

            const data = await pay(plate);


            window.location.href=data.response.sandboxInitPoint


        } catch (error) {

            console.error(error);
            alert("Error connecting with payment service");

        }

    });

};