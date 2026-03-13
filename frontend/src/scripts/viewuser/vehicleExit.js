import {plateInput , bntExit} from "../doom.js"

export function entryDashBoard() {

    bntExit.addEventListener("click", (e) => {
        e.preventDefault();

        const plate = plateInput.value

        if (plate === "snx99") {
            window.location.href = "../pages/admin/dashboard.html";
            return;
        }

        alert("Plate not authorized");

    });

};