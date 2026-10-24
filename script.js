
"use strict";

// Элементы музыкального плеера
const audio = document.querySelector("#song");
const placeholder = document.querySelector("#audio-placeholder");
const controls = document.querySelector("#controls");
const volumeRow = document.querySelector("#volume-row");
const playButton = document.querySelector("#play-button");
const seek = document.querySelector("#seek");
const volume = document.querySelector("#volume");
const currentTimeLabel = document.querySelector("#current-time");
const durationLabel = document.querySelector("#duration");
const playerMessage = document.querySelector("#player-message");
const musicCard = document.querySelector(".music-card");

// Элементы текста песни
const lyricsCard = document.querySelector("#lyrics-card");
const lyricsContainer = document.querySelector("#lyrics-lines");
const lyricsStatus = document.querySelector("#lyrics-status");

// Элементы видео
const video = document.querySelector("#video");
const videoPlaceholder = document.querySelector("#video-placeholder");

// --------------------------------------------------
// ЗАМЕНИ ДЕМОНСТРАЦИОННЫЕ СТРОКИ СВОИМ ТЕКСТОМ.
// time — секунды от начала песни.
// --------------------------------------------------

const lyrics = [
  { time: 0, text: "Сейчас я вам поведаю историю живую —" },
  { time: 9, text: "Про Кешу нашу добрую, немного озорную." },
  { time: 15, text: "Она умеет рассмешить, И может удивлять," },
  { time: 21, text: "И если рядом Кеша не хочется скучать." },
  { time: 29, text: "У Кеши день рождения, спешу вам рассказать" },
  { time: 34, text: "Сегодня нашу Кешу я буду поздравлять." },
  { time: 39, text: "Пусть будет настроение, И счастья через край," },
  { time: 44, text: "Пусть сбудутся желанья — Ты только пожелай!" },

    { time: 52, text: "А наша Кеша любит, пельмешки полепить" },
  { time: 57, text: "Из теста что-то новое руками сотворить." },
  { time: 62, text: "Всё делает с любовью, с улыбкой на лице" },
  { time: 67, text: "Ведь Кеша лепит счастье на кухонном столе." },

    { time: 72, text: "Она умеет ручками картины вышивать" },
  { time: 77, text: "И милую мочалку для вас крючком связать" },
  { time: 82, text: "Рученьки золотые у Кеши неспроста —" },
  { time: 87, text: "Ведь в каждом её деле живёт своя мечта." },

      { time: 95, text: "А после дня рабочего, когда домой идёт," },
  { time: 100, text: "Утят она накормит и яблок соберёт." },
  { time: 105, text: "Ведь сердце нашей Кеши не знает пустоты —" },
  { time: 110, text: "Родным несёт гостинцы, утятам — доброты." },

    { time: 115, text: "А Кеша наша может приятно удивлять," },
  { time: 120, text: "Совсем вот неожиданно в кино тебя позвать." },
  { time: 125, text: "И мир вокруг становится прекрасней и светлей," },
  { time: 130, text: "В такие вот мгновения жить хочется сильней." },

       { time: 138, text: "Могу я очень долго о Кеше рассуждать" },
  { time: 143, text: "Немало интересного успел о ней узнать." },
  { time: 148, text: "Но сколько ни пытаюсь я подобрать слова —" },
  { time: 154, text: "При встрече с нашей Кешей кружится голова." },

    { time: 159, text: "Вот песенка кончается, и хочется ещё" },
  { time: 163, text: "Сказать тебе тихонечко от сердца своего." },
  { time: 170, text: "Пусть будут рядом люди, с которыми легко," },
  { time: 179, text: "И на душе, Марина, тебе будет тепло." }
];

// Перевод секунд в формат 0:00
function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${remainder}`;
}

// Создание строк песни из массива выше
function renderLyrics() {
  lyricsContainer.replaceChildren();

  lyrics.forEach((line, index) => {
    const paragraph = document.createElement("p");

    paragraph.className = "lyric-line";
    paragraph.textContent = line.text;
    paragraph.dataset.index = index;

    lyricsContainer.appendChild(paragraph);
  });

  highlightLyric(0);
}

// Подсветка строки, соответствующей текущему времени песни

let lastActiveLyricIndex = -1;

// Подсветка и плавная прокрутка текста песни
function highlightLyric(time) {
  const lines = lyricsContainer.querySelectorAll(".lyric-line");
  if (!lines.length) return;

  let activeIndex = 0;

  lyrics.forEach((line, index) => {
    if (time >= line.time) {
      activeIndex = index;
    }
  });

  lines.forEach((line, index) => {
    line.classList.toggle("active", index === activeIndex);
  });

  // Прокручиваем только при переходе к новой строке
  if (activeIndex !== lastActiveLyricIndex) {
    lastActiveLyricIndex = activeIndex;

    const activeLine = lines[activeIndex];
    const targetTop =
      activeLine.offsetTop -
      (lyricsContainer.clientHeight - activeLine.offsetHeight) / 2;

    if (!manualScrolling) {
  scrollToActiveLyric(activeLine);
}
  }
}


let manualScrollTimer = null;
let manualScrolling = false;

// Пользователь начал прокручивать текст вручную
lyricsContainer.addEventListener("scroll", () => {
  if (isAutoScrolling) return;

  manualScrolling = true;
  clearTimeout(manualScrollTimer);

  manualScrollTimer = setTimeout(() => {
    manualScrolling = false;
    highlightLyric(audio.currentTime);
  }, 3000);
});

// Различаем автоматическую и ручную прокрутку
let isAutoScrolling = false;
let autoScrollTimer = null;

function scrollToActiveLyric(line) {
  if (!line) return;

  const targetTop =
    line.offsetTop -
    (lyricsContainer.clientHeight - line.offsetHeight) / 2;

  isAutoScrolling = true;

  lyricsContainer.scrollTo({
    top: Math.max(0, targetTop),
    behavior: "smooth"
  });

  clearTimeout(autoScrollTimer);
  autoScrollTimer = setTimeout(() => {
    isAutoScrolling = false;
  }, 700);
}



// Настройка аудио
function setupAudio() {
  audio.volume = Number(volume.value);

  audio.addEventListener("loadedmetadata", () => {
    placeholder.hidden = true;
    controls.hidden = false;
    volumeRow.hidden = false;

    durationLabel.textContent = formatTime(audio.duration);
    playerMessage.textContent = "";
  });

  audio.addEventListener("timeupdate", () => {
    currentTimeLabel.textContent = formatTime(audio.currentTime);

    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      seek.value = (audio.currentTime / audio.duration) * 100;
    }

    highlightLyric(audio.currentTime);
  });

  audio.addEventListener("play", () => {
    playButton.textContent = "Ⅱ";
    playButton.setAttribute("aria-label", "Пауза");

    musicCard.classList.add("is-playing");
    lyricsStatus.textContent = "мелодия звучит";
  });

  audio.addEventListener("pause", () => {
    playButton.textContent = "▶";
    playButton.setAttribute("aria-label", "Воспроизвести песню");

    musicCard.classList.remove("is-playing");
    lyricsStatus.textContent = "пауза";
  });

  audio.addEventListener("ended", () => {
    musicCard.classList.remove("is-playing");
    lyricsStatus.textContent = "мелодия завершилась";
    seek.value = 100;
  });

  audio.addEventListener("error", () => {
    // Если файла нет, остаётся красивая заглушка.
    placeholder.hidden = false;
    controls.hidden = true;
    volumeRow.hidden = true;
  });

  audio.load();
}

// Воспроизведение и пауза
async function togglePlayback() {
  if (audio.readyState === 0 || audio.error) {
    playerMessage.textContent =
      "Добавь свою запись в папку assets под именем song.mp3.";
    return;
  }

  try {
    if (audio.paused) {
      await audio.play();
      playerMessage.textContent = "";
    } else {
      audio.pause();
    }
  } catch (error) {
    playerMessage.textContent =
      "Не удалось запустить песню. Проверь аудиофайл.";
  }
}

// Кнопка на первом экране ведёт к плееру
document.querySelector("#enter-button").addEventListener("click", () => {
  document.querySelector("#music").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

// Управление воспроизведением
playButton.addEventListener("click", togglePlayback);

// Перемотка песни
seek.addEventListener("input", () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime = (Number(seek.value) / 100) * audio.duration;
  }
});

// Громкость
volume.addEventListener("input", () => {
  audio.volume = Number(volume.value);
});



// Возврат к началу
document.querySelector("#back-to-top").addEventListener("click", () => {
  document.querySelector("#home").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});



// Инициализация
renderLyrics();
setupAudio();




/* Перелистывание стихотворений */
const poemsTrack = document.querySelector("#poems-track");
const poemsViewport = document.querySelector(".poems-viewport");
const poemSlides = document.querySelectorAll(".poem-slide");
const poemDots = document.querySelectorAll(".poem-dot");
const poemPrev = document.querySelector("#poem-prev");
const poemNext = document.querySelector("#poem-next");

let currentPoem = 0;
let touchStartX = 0;
let touchEndX = 0;

function showPoem(index) {
  currentPoem = (index + poemSlides.length) % poemSlides.length;

  poemsTrack.style.transform = `translateX(-${currentPoem * 100}%)`;

  poemDots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentPoem);
    dot.setAttribute("aria-current",
      i === currentPoem ? "true" : "false");
  });
}

poemPrev.addEventListener("click", () => {
  showPoem(currentPoem - 1);
});

poemNext.addEventListener("click", () => {
  showPoem(currentPoem + 1);
});

poemDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    showPoem(Number(dot.dataset.index));
  });
});

// Перелистывание пальцем на телефоне
poemsViewport.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].screenX;
}, { passive: true });

poemsViewport.addEventListener("touchend", (event) => {
  touchEndX = event.changedTouches[0].screenX;
  const distance = touchEndX - touchStartX;

  if (Math.abs(distance) > 45) {
    showPoem(currentPoem + (distance < 0 ? 1 : -1));
  }
}, { passive: true });

showPoem(0);

