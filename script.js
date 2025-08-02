const form = document.getElementById('eventForm');
const container = document.getElementById('eventsContainer');
const countdownDisplay = document.getElementById('countdown');

let events = [];

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('eventName').value;
  const date = document.getElementById('eventDate').value;
  const time = document.getElementById('eventTime').value;
  const desc = document.getElementById('eventDesc').value;

  if (!name || !date || !time || !desc) return;

  const dateTime = new Date(`${date}T${time}`);
  if (dateTime <= new Date()) return;

  events.push({ name, dateTime, desc });
  events.sort((a, b) => a.dateTime - b.dateTime);
  updateEventList();
  form.reset();
});

function updateEventList() {
  container.innerHTML = '';
  let nextEventIndex = -1;

  events.forEach((event, index) => {
    const now = new Date();
    if (event.dateTime > now && nextEventIndex === -1) {
      nextEventIndex = index;
    }
  });

  events.forEach((event, index) => {
    const card = document.createElement('div');
    card.className = 'event-card';
    if (index === nextEventIndex) {
      card.classList.add('next-event');
    }

    const title = document.createElement('h3');
    title.textContent = event.name;

    const date = document.createElement('p');
    date.textContent = event.dateTime.toLocaleString();

    const desc = document.createElement('p');
    desc.textContent = event.desc;

    card.appendChild(title);
    card.appendChild(date);
    card.appendChild(desc);
    container.appendChild(card);
  });

  if (nextEventIndex !== -1) {
    startCountdown(events[nextEventIndex].dateTime);
  } else {
    countdownDisplay.textContent = '--:--:--';
  }
}

let countdownInterval;

function startCountdown(targetTime) {
  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    const now = new Date();
    const diff = targetTime - now;

    if (diff <= 0) {
      clearInterval(countdownInterval);
      countdownDisplay.textContent = "00:00:00";
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    const seconds = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');

    countdownDisplay.textContent = `${hours}:${minutes}:${seconds}`;
  }, 1000);
}
