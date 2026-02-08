const BASE_URL = "https://latest.currency-api.pages.dev/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateExchangeRate = async() => {
    let amount = document.querySelector(".amount input");
    let amountVal = parseFloat(amount.value) || 0;
    if (amountVal <= 0) {
        amountVal = 1;
        amount.value = "1";
    }

    const from = fromCurr.value.toLowerCase();
    const to = toCurr.value.toLowerCase();
    const URL = `${BASE_URL}/${from}.json`;

    try {
        let response = await fetch(URL);
        if (!response.ok) throw new Error("Failed to fetch rates");
        let data = await response.json();
        const rates = data[from];
        if (!rates || rates[to] === undefined) throw new Error("Rate not found");
        let rate = rates[to];

        let finalAmount = (amountVal * rate).toFixed(2);
        msg.innerText = `${amountVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } catch (err) {
        msg.innerText = "Could not fetch exchange rate. Try again.";
        console.error(err);
    }
};

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

btn.addEventListener("click", async(evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

window.addEventListener("load", () => {
    updateExchangeRate();
});