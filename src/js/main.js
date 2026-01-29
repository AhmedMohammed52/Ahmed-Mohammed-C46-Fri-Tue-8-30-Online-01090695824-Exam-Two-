var navItem = document.querySelectorAll(".nav-item");
var viewSection = document.querySelectorAll(".view");
var pageTitle = document.getElementById("page-title");
var currentDatetime = document.getElementById("current-datetime");

// Switch Tabs :
navItem.forEach((item, index) => {
  item.addEventListener("click", () => {
    navItem.forEach((ele) => {
      ele.classList.remove("active");
    });
    item.classList.add("active");
    pageTitle.textContent = item.textContent;

    viewSection.forEach((sec) => {
      sec.classList.remove("active");
    });
    viewSection[index].classList.add("active");
  });
});

var dateObj = new Date();

var weekday = dateObj.toLocaleDateString("en-US", {
  weekday: "short",
});

var month = dateObj.toLocaleDateString("en-US", {
  month: "short",
});

var day = dateObj.toLocaleDateString("en-US", {
  day: "2-digit",
});

var time = dateObj.toLocaleTimeString("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

currentDatetime.textContent = `${weekday}, ${month} ${day}, ${time}`;
