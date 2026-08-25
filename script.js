// ===== CONFIGURAÇÕES PRINCIPAIS =====
const weddingDate = new Date("2026-10-05T17:00:00-03:00");

// ===== MENU MOBILE =====
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
menuToggle?.addEventListener("click", () => nav.classList.toggle("open"));
document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

// ===== CONTAGEM REGRESSIVA =====
function updateCountdown() {
  const now = new Date();
  const diff = weddingDate - now;

  if (diff <= 0) {
    document.querySelector("#days").textContent = "000";
    document.querySelector("#hours").textContent = "00";
    document.querySelector("#minutes").textContent = "00";
    document.querySelector("#seconds").textContent = "00";
    return;
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  document.querySelector("#days").textContent = String(days).padStart(3, "0");
  document.querySelector("#hours").textContent = String(hours).padStart(2, "0");
  document.querySelector("#minutes").textContent = String(minutes).padStart(2, "0");
  document.querySelector("#seconds").textContent = String(seconds).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ===== RSVP =====
// Nesta versão, a confirmação fica salva no navegador do convidado.
// Para receber todas as respostas em um único lugar, depois podemos conectar
// este formulário a Google Sheets, Formspree ou Firebase.
const rsvpForm = document.querySelector("#rsvpForm");
const rsvpMessage = document.querySelector("#rsvpMessage");

rsvpForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = {
    nome: document.querySelector("#nome").value.trim(),
    presenca: document.querySelector("#presenca").value,
    acompanhantes: document.querySelector("#acompanhantes").value || "0",
    restricoes: document.querySelector("#restricoes").value.trim(),
    data: new Date().toLocaleString("pt-BR")
  };

  const respostas = JSON.parse(localStorage.getItem("rsvpSarahJeremias") || "[]");
  respostas.push(data);
  localStorage.setItem("rsvpSarahJeremias", JSON.stringify(respostas));

  rsvpMessage.textContent = "Confirmação registrada com carinho! Obrigada pela resposta. ♡";
  rsvpForm.reset();
  document.querySelector("#acompanhantes").value = "0";
});

// ===== PIX =====
const pix = "(14) 99614-3026";
const copyPix = document.querySelector("#copyPix");
const pixButton = document.querySelector("#pixButton");

async function copyPixKey() {
  try {
    await navigator.clipboard.writeText(pix);
    copyPix.textContent = "COPIADO! ♡";
    setTimeout(() => copyPix.textContent = "COPIAR ♧", 1800);
  } catch {
    window.prompt("Copie a chave PIX:", pix);
  }
}
copyPix.addEventListener("click", copyPixKey);
pixButton.addEventListener("click", copyPixKey);

// ===== NOSSA HISTÓRIA =====
const storyModal = document.querySelector("#storyModal");
document.querySelector("#storyButton").addEventListener("click", () => {
  storyModal.classList.remove("hidden");
});
document.querySelector("#closeStory").addEventListener("click", () => {
  storyModal.classList.add("hidden");
});
storyModal.addEventListener("click", (event) => {
  if (event.target === storyModal) storyModal.classList.add("hidden");
});

// ===== MURAL =====
const messageForm = document.querySelector("#messageForm");
const messages = document.querySelector("#messages");

document.querySelector("#openMessage").addEventListener("click", () => {
  messageForm.classList.toggle("hidden");
  if (!messageForm.classList.contains("hidden")) {
    document.querySelector("#messageName").focus();
  }
});

function loadMessages() {
  const saved = JSON.parse(localStorage.getItem("muralSarahJeremias") || "[]");
  messages.innerHTML = "";

  saved.forEach(item => {
    const card = document.createElement("article");
    card.className = "message-card";

    const name = document.createElement("strong");
    name.textContent = item.nome;

    const text = document.createElement("p");
    text.textContent = item.mensagem;

    card.appendChild(name);
    card.appendChild(text);
    messages.appendChild(card);
  });
}

document.querySelector("#messageForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const item = {
    nome: document.querySelector("#messageName").value.trim(),
    mensagem: document.querySelector("#messageText").value.trim()
  };

  const saved = JSON.parse(localStorage.getItem("muralSarahJeremias") || "[]");
  saved.push(item);
  localStorage.setItem("muralSarahJeremias", JSON.stringify(saved));

  event.target.reset();
  event.target.classList.add("hidden");
  loadMessages();
});

loadMessages();

// ===== MÚSICA =====
// Coloque um arquivo chamado "musica.mp3" na mesma pasta do index.html.
const audio = document.querySelector("#music");
const musicButton = document.querySelector("#musicButton");

musicButton.addEventListener("click", async () => {
  if (audio.paused) {
    try {
      await audio.play();
      musicButton.textContent = "❚❚";
    } catch {
      alert("Adicione o arquivo 'musica.mp3' à mesma pasta do convite para ativar a música.");
    }
  } else {
    audio.pause();
    musicButton.textContent = "▶";
  }
});

audio.addEventListener("ended", () => {
  musicButton.textContent = "▶";
});

// ===== MENU ATIVO AO ROLAR =====
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav a");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove("active"));
      const active = document.querySelector(`.nav a[href="#${entry.target.id}"]`);
      active?.classList.add("active");
    }
  });
}, { rootMargin: "-35% 0px -55% 0px" });

sections.forEach(section => observer.observe(section));
