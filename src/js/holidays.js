// var loadingOverlay = document.getElementById("loading-overlay");
// var emptyState = document.querySelector("empty-state");

// async function getHolidays(year, countryCode) {
//   loadingOverlay.classList.remove("hidden");

//   var response = await fetch(
//     `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`,
//   );

//   if (response.ok == true) {
//     loadingOverlay.classList.add("hidden");
//     emptyState.style.display = "none";

//     var holidaysData = await response.json();

//     console.log(holidaysData);
//   }
// }
