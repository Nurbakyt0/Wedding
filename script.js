const CONFIG = {
  eventType: "Үйлену той",
  mainTitle: "Аян & Айгерім",
  subtitle: "Құрметті ағайын-туыс, бауырлар, құда-жекжат, дос-жаран!",
  date: "2026-08-15",
  time: "18:00",
  venueName: "Grand Hall мейрамханасы",
  venueAddress: "Астана қаласы, Мәңгілік Ел даңғылы 25",
  mapLink: "https://go.2gis.com/",
  invitationTextKz: "Сіздерді ұлымыз Аян мен келініміз Айгерімнің шаңырақ көтеру тойына арналған ақ дастарханымыздың қадірлі қонағы болуға шақырамыз.",
  invitationTextRu: "Приглашаем вас разделить с нами радость свадебного торжества Аяна и Айгерим.",
  dressCode: "Ақ, бежевый, алтын түсті киім үлгісі құпталады",
  hosts: "Той иелері: Ерлан және Гүлнар",
  heroImage: "./assets/images/hero.jpg",
  coupleImage: "./assets/images/couple.jpg",
  middleImage: "./assets/images/middle.jpg",
  galleryImages: [
    "./assets/images/gallery1.jpg",
    "./assets/images/gallery2.jpg",
    "./assets/images/gallery3.jpg",
    "./assets/images/gallery4.jpg",
    "./assets/images/gallery5.jpg",
    "./assets/images/gallery6.jpg"
  ],
  musicFile: "./assets/music/music.mp3",
  googleScriptUrl: "https://script.google.com/macros/s/AKfycbyGb447DaJBJbW4ujk38snDHNROIGy1xuXOuug-idXZxVI1JCo0P_YTAvx1CeEY8DI/exec",
  coupleEyebrow: "Махаббат пен қуаныш күні",
  coupleTitle: "Біз үшін қадірлі сәтті бірге бөлісейік",
  coupleText: "Жақындарымыздың ақ батасы мен жылы тілегі бұл күнді одан әрі ерекше етеді.",
  middleQuote: "Ең әдемі күндер жақын адамдармен бірге есте қалады.",
  program: [
    ["17:30", "Қонақтарды қарсы алу"],
    ["18:00", "Тойдың басталуы"],
    ["19:00", "Беташар / Негізгі бөлім"],
    ["20:30", "Ақ тілек"],
    ["21:00", "Би кеші"]
  ]
};

document.addEventListener("DOMContentLoaded", () => {
  initContent();
  initCountdown();
  initMusic();
  initGallery();
  initRSVP();
  initScrollReveal();
  initWelcome();
});

function initContent() {
  document.title = `${CONFIG.mainTitle} | ${CONFIG.eventType}`;

  document.querySelectorAll("[data-text]").forEach((element) => {
    const key = element.dataset.text;
    element.textContent = CONFIG[key] || "";
  });

  document.querySelectorAll("[data-date-display]").forEach((element) => {
    element.textContent = formatDate(CONFIG.date);
  });

  document.querySelectorAll("[data-bg]").forEach((element) => {
    const key = element.dataset.bg;
    setBackgroundImage(element, CONFIG[key]);
  });

  document.querySelectorAll("[data-img]").forEach((image) => {
    const key = image.dataset.img;
    setSafeImage(image, CONFIG[key]);
  });

  const mapLink = document.querySelector("[data-map-link]");
  if (mapLink) {
    mapLink.href = CONFIG.mapLink;
  }

  const programList = document.getElementById("programList");
  if (programList) {
    programList.innerHTML = CONFIG.program.map(([time, title]) => `
      <div class="timeline-item">
        <span class="timeline-time">${time}</span>
        <span>${title}</span>
      </div>
    `).join("");
  }

  document.querySelectorAll("[data-scroll-to]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector(button.dataset.scrollTo);
      target?.scrollIntoView({ behavior: "smooth" });
    });
  });
}

function initCountdown() {
  const counters = {
    days: document.querySelector("[data-count='days']"),
    hours: document.querySelector("[data-count='hours']"),
    minutes: document.querySelector("[data-count='minutes']"),
    seconds: document.querySelector("[data-count='seconds']")
  };
  const message = document.querySelector("[data-countdown-message]");
  const eventDate = new Date(`${CONFIG.date}T${CONFIG.time}:00`);

  function updateCountdown() {
    const distance = eventDate.getTime() - Date.now();

    if (Number.isNaN(eventDate.getTime()) || distance <= 0) {
      Object.values(counters).forEach((counter) => {
        if (counter) counter.textContent = "0";
      });
      if (message) message.hidden = false;
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    counters.days.textContent = days;
    counters.hours.textContent = String(hours).padStart(2, "0");
    counters.minutes.textContent = String(minutes).padStart(2, "0");
    counters.seconds.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function initMusic() {
  const button = document.getElementById("musicButton");
  const audio = new Audio(CONFIG.musicFile);
  audio.loop = true;
  audio.preload = "none";

  async function playMusic() {
    try {
      await audio.play();
      button.classList.add("is-playing");
      button.setAttribute("aria-label", "Pause music");
      button.setAttribute("aria-pressed", "true");
    } catch (error) {
      console.warn("Music playback was blocked or the file is missing.", error);
    }
  }

  function pauseMusic() {
    audio.pause();
    button.classList.remove("is-playing");
    button.setAttribute("aria-label", "Play music");
    button.setAttribute("aria-pressed", "false");
  }

  button.addEventListener("click", () => {
    if (audio.paused) {
      playMusic();
    } else {
      pauseMusic();
    }
  });

  // Most browsers block autoplay. This starts music only after a real user action.
  const startAfterInteraction = () => {
    playMusic();
    window.removeEventListener("pointerdown", startAfterInteraction);
    window.removeEventListener("keydown", startAfterInteraction);
  };

  window.addEventListener("pointerdown", startAfterInteraction, { once: true });
  window.addEventListener("keydown", startAfterInteraction, { once: true });
}

function initGallery() {
  const galleryGrid = document.getElementById("galleryGrid");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = lightbox?.querySelector("img");
  const closeButton = lightbox?.querySelector(".lightbox-close");

  if (!galleryGrid || !lightbox || !lightboxImage || !closeButton) return;

  galleryGrid.innerHTML = CONFIG.galleryImages.map((src, index) => `
    <button class="gallery-item" type="button" data-gallery-src="${src}" aria-label="Open gallery image ${index + 1}">
      <img src="${src}" alt="Gallery image ${index + 1}" loading="lazy">
    </button>
  `).join("");

  galleryGrid.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => image.classList.add("is-missing"));
  });

  galleryGrid.addEventListener("click", (event) => {
    const item = event.target.closest("[data-gallery-src]");
    if (!item) return;
    const image = item.querySelector("img");
    if (image?.classList.contains("is-missing")) return;

    lightboxImage.src = item.dataset.gallerySrc;
    lightboxImage.alt = image?.alt || "Gallery image";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
  });

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
  }

  closeButton.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
  });
}

function initRSVP() {
  const form = document.getElementById("rsvpForm");
  const message = document.getElementById("formMessage");

  if (!form || !message) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    message.textContent = "";

    const values = new FormData(form);
    const payload = {
      eventType: CONFIG.eventType,
      mainTitle: CONFIG.mainTitle,
      name: values.get("name"),
      phone: values.get("phone"),
      attendance: values.get("attendance"),
      guests: values.get("guests"),
      comment: values.get("comment"),
      submittedAt: new Date().toISOString()
    };

    if (!CONFIG.googleScriptUrl || CONFIG.googleScriptUrl.includes("PASTE_YOUR")) {
      message.textContent = "Demo mode: Google Sheets URL is not connected yet.";
      return;
    }

    try {
      await submitToGoogleSheets(payload);
      message.textContent = "Рақмет! Жауабыңыз қабылданды.";
      form.reset();
    } catch (error) {
      console.error("RSVP submit error:", error);
      message.textContent = "Қате пайда болды. Кейінірек қайталап көріңіз.";
    }
  });
}

async function submitToGoogleSheets(formData) {
  // Copy the Web App URL from Google Apps Script deployment into CONFIG.googleScriptUrl.
  // text/plain avoids unnecessary CORS preflight and works well with Apps Script doPost(e).
  const response = await fetch(CONFIG.googleScriptUrl, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(formData)
  });

  if (!response.ok) {
    throw new Error(`Google Sheets request failed: ${response.status}`);
  }

  return response.json().catch(() => ({ status: "success" }));
}

function initScrollReveal() {
  const elements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  elements.forEach((element) => observer.observe(element));
}

function initWelcome() {
  const welcomeScreen = document.getElementById("welcomeScreen");
  window.setTimeout(() => {
    welcomeScreen?.classList.add("is-hidden");
  }, 1300);
}

function setSafeImage(image, src) {
  image.src = src;
  image.addEventListener("error", () => image.classList.add("is-missing"));
}

function setBackgroundImage(element, src) {
  if (!src) return;

  const testImage = new Image();
  testImage.onload = () => {
    element.style.backgroundImage = `url("${src}")`;
  };
  testImage.onerror = () => {
    element.classList.add("is-missing");
  };
  testImage.src = src;
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat("kk-KZ", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}
