const modal = document.getElementById("timezoneModal");
const timezoneTxt = document.getElementById("timeZone_txt");
const modalBtn = document.getElementById("timzone_modal_trigger");
const prevBtn = document.getElementById("prevBtn");
const next_prev_btn = document.getElementById("next_prev_btn");
const tableContainer = document.getElementById("table-container");
const table = document.getElementById("table");
const form = document.getElementById("form");
const timezone_input = document.getElementById("timezone_input");
const date_input = document.getElementById("date_input");
const time_input = document.getElementById("time_input");

const calendar = document.getElementById("calendar");
const currentDateElem = document.getElementById("currentDate");
const weekdaysElem = document.querySelector(".weekdays");
const daysElem = document.querySelector(".days");
const calTime_prevBtn = document.getElementById("calTime_prevBtn");
const calTime_nextBtn = document.getElementById("calTime_nextBtn");
const calTime_date = document.getElementById("calTime_date");
const amTimeSlots = document.getElementById("amTimeSlots");
const pmTimeSlots = document.getElementById("pmTimeSlots");

let selected_timezone = {};
let selected_time_date = {};
let tablePage = 1;
const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const timezones = [
  { label_id: "pacific_time_label", label: "Pacific Time", offset: -7 },
  { label_id: "mountain_time_label", label: "Mountain Time", offset: -6 },
  { label_id: "est_time_label", label: "Eastern Time", offset: -4 },
  { label_id: "atlantic_time_label", label: "Atlantic Time", offset: -3 },
  { label_id: "hongkong_time_label", label: "Hong Kong Time", offset: 8 },
  { label_id: "jakarta_time_label", label: "Jakarta Time", offset: 7 },
  { label_id: "kabul_time_lable", label: "Kabul Time", offset: 4.5 },
  { label_id: "katmandu_time_label", label: "Katmandu Time", offset: 5.75 },
  { label_id: "berlin_time_label", label: "Berlin Time", offset: 2 },
  { label_id: "helsinki_time_label", label: "Helsinki Time", offset: 3 },
  { label_id: "dublin_time_label", label: "Dublin Time", offset: 1 },
  { label_id: "samara_time_label", label: "Samara Time", offset: 4 },
  { label_id: "bogota_time_label", label: "Bogota Time", offset: -5 },
  { label_id: "campo_time_label", label: "Campo Time", offset: -4 },
  { label_id: "caracas_time_label", label: "Caracas Time", offset: -4.5 },
  { label_id: "lima_time_label", label: "Lima Time", offset: -5 },
];

function updateTime() {
  const utcTime = Date.now(); // Get the current UTC time
  const isTimeIn24hour = document.getElementById(
    "flexSwitchCheckDefault"
  ).checked;

  timezones.forEach((timezone) => {
    const timezoneOffset = timezone.offset * 60 * 60 * 1000; // Convert hours to milliseconds
    const timezoneTime = new Date(utcTime + timezoneOffset); // Add offset to UTC time
    let formattedTime;
    if (isTimeIn24hour) {
      formattedTime = timezoneTime.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "UTC",
      });
    } else {
      formattedTime = timezoneTime.toLocaleTimeString("en-US", {
        hour12: true,
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "UTC",
      });
    }
    const element = document.getElementById(
      timezone.label_id.replace(/\s/g, "")
    );

    if (element) {
      element.textContent = `${timezone.label} ${formattedTime}`;
    }
  });
}

const timeZoneSelect = async (timezone_labelID) => {
  /* ---- to hide modal ------ */
  modal.removeAttribute("role");
  modal.removeAttribute("aria-modal");
  modal.setAttribute("aria-hidden", true);
  modal.classList.remove("show");
  modal.style.display = "none";

  const backDrops = document.getElementsByClassName("modal-backdrop");
  for (let i = 0; i < backDrops.length; i++) {
    const backDrop = backDrops[i];
    backDrop.remove();
  }
  const body = document.getElementsByTagName("body")[0];
  body.classList.remove("modal-open");
  body.style.overflow = "";
  body.style.paddingRight = "";

  selected_timezone = timezones.find(
    (zone) => zone.label_id === timezone_labelID
  );
  timezoneTxt.innerHTML = `${selected_timezone.label} GMT (${selected_timezone.offset}:00)`;
  modalBtn.innerHTML = "Change";

  const date = new Date();
  const startDate = date.toISOString().split("T")[0];
  date.setDate(date.getDay() + 6);
  const endDate = date.toISOString().split("T")[0];
  tablePage = 1;
  renderTable(startDate, endDate, selected_timezone.label);
  form.style.display = "none";
  calendar.classList.remove("hidden");
  calTime_date.classList.add("hidden");
  const prevActiveDate = document.getElementById("active_date");
  if (prevActiveDate) {
    prevActiveDate.id = "";
  }
};

const paginateTable = (txt) => {
  const date = new Date();
  let startDate;
  let endDate;
  if (txt === "next") {
    tablePage += 1;
  }
  if (txt === "prev") {
    tablePage -= 1;
  }

  if (tablePage <= 1) {
    prevBtn.style.display = "none";
  } else {
    prevBtn.style.display = "block";
  }

  date.setDate(date.getDay() + (tablePage - 1) * 7);
  startDate = date.toISOString().split("T")[0];

  date.setDate(date.getDay() + tablePage * 7 - 1);
  endDate = date.toISOString().split("T")[0];
  renderTable(startDate, endDate, selected_timezone.label);
};

const renderTable = async (startDate, endDate, timezone) => {
  try {
    const tableHead = table.querySelector("thead");
    const tableBody = table.querySelector("tbody");
    tableHead.innerHTML = "";
    tableBody.innerHTML = "";
    const res = await fetch(
      `/schedule?startDate=${startDate}&endDate=${endDate}&timezone=${timezone}`
    );
    const timingSlots = await res.json();
    const tableAllDates = Object.keys(timingSlots?.data); // ["", "", ...]
    const timesArr = []; // [["", ""], [], []....]
    let largeTArr_length = 0; //number 5,6,7...

    /* ----------- table header row --------- */
    const tableHead_tr = document.createElement("tr");
    tableAllDates.map((t_slot) => {
      if (timingSlots?.data[t_slot].length) {
        timesArr.push(timingSlots?.data[t_slot]);
        const date = new Date(t_slot);
        const th = document.createElement("th");
        const p = document.createElement("p");
        const h6 = document.createElement("h6");

        h6.innerHTML = daysOfWeek[date.getDay()];
        p.innerHTML = date.toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
        });
        th.appendChild(h6);
        th.appendChild(p);
        tableHead_tr.appendChild(th);

        if (largeTArr_length < timingSlots?.data[t_slot].length) {
          largeTArr_length = timingSlots?.data[t_slot].length;
        }
      }
    });
    tableHead.appendChild(tableHead_tr);

    /* ----------- table column rows --------- */
    if (timesArr.length && largeTArr_length) {
      for (let i = 0; i < largeTArr_length; i++) {
        const tr = document.createElement("tr");
        timesArr.map((tArr, index) => {
          const td = document.createElement("td");
          if (tArr[i]) {
            td.innerHTML = tArr[i];
            td.style.cursor = "pointer";
            td.onclick = () => {
              handleTimeSelect(tArr[i], tableAllDates[index]);
            };
          }
          tr.appendChild(td);
        });
        tableBody.appendChild(tr);
      }
    }

    table.innerHTML = "";
    table.appendChild(tableHead);
    table.appendChild(tableBody);
    tableContainer.style.display = "block";
  } catch (error) {
    console.log(error);
  }
};

const handleTimeSelect = (time, date) => {
  try {
    selected_time_date = {
      time,
      date,
    };
    table.style.display = "none";
    form.style.display = "block";
    next_prev_btn.style.visibility = "hidden";
    timezone_input.value = selected_timezone.label;
    date_input.value = selected_time_date.date;
    time_input.value = selected_time_date.time;
  } catch (error) {
    console.log(error);
  }
};

const handleSubmit = async (e) => {
  try {
    e.preventDefault();

    console.log(e);
  } catch (error) {
    console.log(error);
  }
};
/* ------------- calendar time functions ----------- */
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
function renderCalendar(month, year) {
  currentDateElem.textContent = months[month] + " " + year;

  weekdaysElem.innerHTML = "";
  daysOfWeek.forEach(function (day) {
    const div = document.createElement("div");
    div.textContent = day.slice(0, 3);
    weekdaysElem.appendChild(div);
  });

  daysElem.innerHTML = "";
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  for (let i = 0; i < firstDayOfMonth; i++) {
    const div = document.createElement("div");
    div.textContent = "";
    daysElem.appendChild(div);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const div = document.createElement("div");
    div.textContent = i;
    div.addEventListener("click", function () {
      selectDate(i, month, year, div);
    });
    if (new Date(year, month, i) < today) {
      div.classList.add("disabled");
      div.removeEventListener("click", function () {});
    } else {
      div.classList.add("selectable");
    }
    daysElem.appendChild(div);
  }

  // Disable previous button if current month is the current month
  if (
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear()
  ) {
    calTime_prevBtn.disabled = true;
  } else {
    calTime_prevBtn.disabled = false;
  }
}
const timeSlotTravers = (time, isAm, date) => {
  const button = document.createElement("button");
  button.textContent = time;
  button.classList.add("mb-2");
  button.onclick = () => {
    handleTimeSelect(time, date);
    calendar.classList.add("hidden");
  };
  if (isAm) {
    amTimeSlots.appendChild(button);
  } else {
    pmTimeSlots.appendChild(button);
  }
};

const selectDate = async (day, month, year, div) => {
  const selectedDate = new Date(Date.UTC(year, month, day))
    .toISOString()
    .split("T")[0];

  const response = await fetch(
    `/schedule?date=${selectedDate}&timezone=${selected_timezone.label}`
  );
  const result = await response.json();

  calTime_date.classList.remove("hidden");
  calTime_date.querySelector("span").innerHTML = `${months[month]}, ${year}`;

  amTimeSlots.innerHTML = "";
  pmTimeSlots.innerHTML = "";
  result.data.amTimes.map((time) => timeSlotTravers(time, true, selectedDate));
  result.data.pmTimes.map((time) => timeSlotTravers(time, false, selectedDate));

  const prevActiveDate = document.getElementById("active_date");
  if (prevActiveDate) {
    prevActiveDate.id = "";
  }
  div.id = "active_date";
};

document.addEventListener("DOMContentLoaded", function () {
  // Initial call to updateTime
  updateTime();
  setInterval(updateTime, 1000);
  renderCalendar(currentMonth, currentYear);

  calTime_prevBtn.addEventListener("click", function () {
    if (currentMonth === 0) {
      currentMonth = 11;
      currentYear--;
    } else {
      currentMonth--;
    }
    renderCalendar(currentMonth, currentYear);
    calTime_date.classList.add("hidden");
  });

  calTime_nextBtn.addEventListener("click", function () {
    if (currentMonth === 11) {
      currentMonth = 0;
      currentYear++;
    } else {
      currentMonth++;
    }
    renderCalendar(currentMonth, currentYear);
    calTime_date.classList.add("hidden");
  });
});
