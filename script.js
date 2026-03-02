const girls = ["Aruzhan", "Aigerim", "Madina", "Dana"];

const memories = [
  {
    img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
    text: "You make every day brighter."
  },
  {
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80",
    text: "Grace, strength, and kindness in one heart."
  },
  {
    img: "https://images.unsplash.com/photo-1521146764736-56c929d59c83?auto=format&fit=crop&w=1200&q=80",
    text: "Today we celebrate you."
  }
];

const choose = document.getElementById("choose");
const carousel = document.getElementById("carousel");
const letterStage = document.getElementById("letterStage");
const nameList = document.getElementById("nameList");
const greeting = document.getElementById("greeting");
const carouselTrack = document.getElementById("carouselTrack");
const envelope = document.getElementById("envelope");
const invitePaper = document.getElementById("invitePaper");
const inviteGreeting = document.getElementById("inviteGreeting");
const bgMusic = document.getElementById("bgMusic");

let selectedName = "";

function show(section) {
  [choose, carousel, letterStage].forEach((item) => item.classList.add("hidden"));
  section.classList.remove("hidden");
}

function startMusic() {
  bgMusic.volume = 0.35;
  bgMusic.play().catch(() => {});
}

function renderNames() {
  girls.forEach((name) => {
    const button = document.createElement("button");
    button.className = "name-btn";
    button.textContent = name;
    button.addEventListener("click", () => startFlow(name));
    nameList.appendChild(button);
  });
}

function createMemoryCard(memory, idx) {
  const card = document.createElement("article");
  card.className = `memory ${idx % 2 === 0 ? "left" : "right"}`;
  card.innerHTML = `<img src="${memory.img}" alt="Memory" /><p>${memory.text}</p>`;
  return card;
}

function runCarousel() {
  carouselTrack.innerHTML = "";
  const cards = memories.map(createMemoryCard);
  cards.forEach((card) => carouselTrack.appendChild(card));

  let index = 0;
  const timer = setInterval(() => {
    cards[index].classList.add("show");
    index += 1;

    if (index === cards.length) {
      clearInterval(timer);
      setTimeout(() => {
        show(letterStage);
      }, 1400);
    }
  }, 1700);

  cards[0].classList.add("show");
  index = 1;
}

function startFlow(name) {
  selectedName = name;
  greeting.textContent = `${name}, this is for you`;
  inviteGreeting.textContent = `Dear ${name},`;
  envelope.classList.remove("open");
  invitePaper.classList.add("hidden");
  invitePaper.classList.remove("show");
  startMusic();
  show(carousel);
  runCarousel();
}

envelope.addEventListener("click", () => {
  envelope.classList.add("open");
  setTimeout(() => {
    invitePaper.classList.remove("hidden");
    invitePaper.classList.add("show");
  }, 450);
});

renderNames();
