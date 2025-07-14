function calculateWage() {
    const startHours = parseInt(document.getElementById("startHours").value);
    const startMinutes = parseInt(document.getElementById("startMinutes").value);
    const startAmPm = document.getElementById("startAmPm").value;

    const endHours = parseInt(document.getElementById("endHours").value);
    const endMinutes = parseInt(document.getElementById("endMinutes").value);
    const endAmPm = document.getElementById("endAmPm").value;

    const lunchMinutes = parseInt(document.getElementById("lunchMinutes").value);

    const mealPenalties = parseInt(document.getElementById("mealPenalties").value);  //Get meal penalties

    let basicRate = parseFloat(document.getElementById("baseRate").value);
    if (isNaN(basicRate)) {
        basicRate = 216;
    }

    let adjustedRate = basicRate; // Use a separate variable for adjustments

    // Adjustments for Wet, Snow, and Smoke
    if (document.getElementById("wet").checked) {
        adjustedRate += 14;
    }

    if (document.getElementById("smoke").checked) {
        adjustedRate += 14;
    }

    // Adjustments for Makeup, Beard, and Hair Goods
    if (document.getElementById("makeup").checked) {
        adjustedRate += 19;
    }
    if (document.getElementById("beard").checked) {
        adjustedRate += 19;
    }
    if (document.getElementById("hairGoods").checked) {
        adjustedRate += 19;
    }

    let startTimeMinutes = convertTo24Hour(startHours, startMinutes, startAmPm);
    let endTimeMinutes = convertTo24Hour(endHours, endMinutes, endAmPm);

    // Check if start and end times are the same, assume next day
    if (endTimeMinutes === startTimeMinutes) {
        endTimeMinutes += 1440; // Add 24 hours in minutes
    } else if (endTimeMinutes < startTimeMinutes) {
        endTimeMinutes += 1440;
    }

    let totalMinutes = endTimeMinutes - startTimeMinutes; // Do not subtract lunch here

    let totalWage = adjustedRate; // Initialize totalWage with adjustedRate

    let totalMinutesForOvertime = totalMinutes - lunchMinutes; // Subtract lunch for overtime calculation
    if (totalMinutesForOvertime > 480) { // Overtime - Use totalMinutesForOvertime here
        let overtimePay = 0;
        let doubleTimePay = 0;

        if (totalMinutesForOvertime <= 600) { // 8 to 10 hours (time and a half)
            overtimePay = (totalMinutesForOvertime - 480) / 60 * (adjustedRate / 8 * 1.5);
        } else { // 10 hours and above (double time after 10)
            overtimePay = 2 * (adjustedRate / 8 * 1.5);  // 2 hours (8 to 10) at time and a half
            doubleTimePay = (totalMinutesForOvertime - 600) / 60 * (adjustedRate / 8 * 2);
        }

        // 16-hour bonus calculation
        let sixteenHourBonus = 0;
        if (totalMinutes > 960) { // 16 hours
            const bonusHours = Math.ceil(totalMinutes / 60) - 16;
            sixteenHourBonus = bonusHours * adjustedRate;
        }

        totalWage += overtimePay + doubleTimePay + sixteenHourBonus;
    }

    // Meal Penalty Calculation
    if (!isNaN(mealPenalties) && mealPenalties > 0) {
        let mealPenaltyCost = 0;
        if (mealPenalties >= 1) {
            mealPenaltyCost += 7.25; // First penalty
        }
        if (mealPenalties >= 2) {
            mealPenaltyCost += 10.00; // Second penalty
        }
        if (mealPenalties >= 3) {
            mealPenaltyCost += (mealPenalties - 2) * 12.50; // Third and subsequent penalties
        }
        totalWage += mealPenaltyCost;
    }

    document.getElementById("result").textContent = `Wage: $${totalWage.toFixed(2)}`;
}// end of calculateWage

function convertTo24Hour(hours, minutes, amPm) {
    let totalMinutes = hours * 60 + minutes;
    if (amPm === "pm" && hours !== 12) {
        totalMinutes += 12 * 60;
    } else if (amPm === "am" && hours === 12) {
        totalMinutes -= 12 * 60;
    }
    return totalMinutes;
}

function populateMinutes(elementId) {
    const minutesSelect = document.getElementById(elementId);
    for (let i = 0; i < 60; i++) {
        const minuteValue = i < 10 ? "0" + i : i;
        const option = document.createElement("option");
        option.value = i;
        option.text = minuteValue;
        minutesSelect.appendChild(option);
    }
}

function populateHours(elementId) {
    const hoursSelect = document.getElementById(elementId);
    for (let i = 1; i <= 12; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.text = i;
        hoursSelect.appendChild(option);
    }
}

function populateLunchOptions() {
    const lunchSelect = document.getElementById("lunchMinutes");
    for (let i = 0; i <= 60; i += 30) {  // Loop through 30, 45, 60
        const option = document.createElement("option");
        option.value = i;
        option.text = i;
        lunchSelect.appendChild(option);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    populateHours('startHours');
    populateMinutes('startMinutes');
    populateHours('endHours');
    populateMinutes('endMinutes');
    populateLunchOptions();

    document.getElementById('calculateBtn').addEventListener('click', calculateWage);
});