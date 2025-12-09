// --- STORY DATA -------------------------------------------------------------

/**
 * Minimal demo: two stories, short branches, with endings.
 * In a real project, this can be moved to a JSON file or multiple files.
 */
const STORIES = [
  {
    id: "forest-ritual",
    title: "The Forest Ritual",
    tagline: "Follow the lights or turn back before it's too late.",
    mood: "Atmospheric",
    passages: {
      start: {
        text: "Mist hangs low between the trees, and somewhere ahead, a pale blue light flickers like a heartbeat.",
        choices: [
          { label: "Step toward the lights", target: "lights" },
          { label: "Call out into the dark", target: "call" }
        ]
      },
      lights: {
        text: "The lights draw away as you approach, playful and distant, always just out of reach.",
        choices: [
          { label: "Chase them deeper", target: "deeper" },
          { label: "Stop and plant your feet", target: "stand" }
        ]
      },
      call: {
        text: "Your voice disappears into the trees. For a moment there is nothing. Then something answers — not in words, but in a shiver down your spine.",
        choices: [
          { label: "Run back to the path", target: "ending_run" },
          { label: "Wait and listen", target: "wait" }
        ]
      },
      deeper: {
        text: "You break into a run. The forest closes around you, and the lights stop retreating. They form a circle.",
        choices: [
          { label: "Step into the circle", target: "ending_ritual" },
          { label: "Back away slowly", target: "ending_lost" }
        ]
      },
      stand: {
        text: "You refuse to follow. The lights hesitate, then drift closer until they hover just inches from your face.",
        choices: [
          { label: "Reach out your hand", target: "ending_touch" }
        ]
      },
      wait: {
        text: "The chill becomes a presence at your back. You feel it watching, judging which future you belong to.",
        choices: [
          { label: "Walk forward anyway", target: "ending_ritual" },
          { label: "Apologize and leave", target: "ending_run" }
        ]
      },
      // ENDINGS
      ending_ritual: {
        type: "ending",
        text: "Warmth rises from the soil as the lights sink into your skin. For the rest of your life, the forest will know your name.",
        image: "https://images.pexels.com/photos/167404/pexels-photo-167404.jpeg?auto=compress&cs=tinysrgb&w=800",
        video: null
      },
      ending_run: {
        type: "ending",
        text: "You sprint back to the path and don’t slow down until the trees are a memory. You never quite forget what almost answered.",
        image: null,
        video: null
      },
      ending_lost: {
        type: "ending",
        text: "You turn to leave and realize the path is gone. The lights go out, one by one, until the forest is nothing but breath and darkness.",
        image: null,
        video: null
      },
      ending_touch: {
        type: "ending",
        text: "The light collapses into your palm like snow in reverse, vanishing under your skin. From now on, you never truly walk alone.",
        image: null,
        video: null
      }
    }
  },
  {
    id: "midnight-cafe",
    title: "Midnight at the Little Café",
    tagline: "One quiet night, one strange regular, and a choice.",
    mood: "Cozy",
    passages: {
      start: {
        text: "The bell above the café door rings, though no one has touched it. Outside, the street is empty. Inside, a lone regular sits with a mug that never seems to empty.",
        choices: [
          { label: "Bring them a fresh pot", target: "pot" },
          { label: "Pretend you didn’t notice", target: "ignore" }
        ]
      },
      pot: {
        text: "You carry over a fresh pot. They smile like they’ve been waiting for exactly this moment.",
        choices: [
          { label: "Ask how their night is going", target: "chat" },
          { label: "Just pour and leave", target: "pour" }
        ]
      },
      ignore: {
        text: "You keep wiping the same spot on the counter until the mug is somehow full again. The regular raises it to you in silent thanks.",
        choices: [
          { label: "Raise your own cup back", target: "ending_toast" },
          { label: "Look away and lock the till", target: "ending_closed" }
        ]
      },
      chat: {
        text: "They tell you stories about nights that never happened, and yet you remember them anyway.",
        choices: [
          { label: "Ask who they really are", target: "ending_regular" }
        ]
      },
      pour: {
        text: "You pour, they nod, and the café clock above the door quietly ticks backwards by one minute.",
        choices: [
          { label: "Check the clock again", target: "ending_time" }
        ]
      },
      ending_regular: {
        type: "ending",
        text: "They laugh softly. \"I’m just someone who hates to drink alone.\" Somehow, you’re still not sure whether they ever left.",
        image: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800",
        video: null
      },
      ending_time: {
        type: "ending",
        text: "Every time you refill their mug, the night stretches a little longer. Some part of you never quite clocks out.",
        image: null,
        video: null
      },
      ending_toast: {
        type: "ending",
        text: "You raise your own cup. For one heartbeat, you are the only two people in the world who are awake.",
        image: null,
        video: null
      },
      ending_closed: {
        type: "ending",
        text: "You flip the sign to CLOSED. The bell rings one last time behind you, and the café lights go out on their own.",
        image: null,
        video: null
      }
    }
  }
];

// --- STATE ------------------------------------------------------------------

let currentStory = null;
let currentPassageKey = "start";
let soundsEnabled = true;

// --- DOM ELEMENTS -----------------------------------------------------------

const homeView = document.getElementById("homeView");
const storyView = document.getElementById("storyView");
const storiesGrid = document.getElementById("storiesGrid");

const storyTitleEl = document.getElementById("storyTitle");
const storyTaglineEl = document.getElementById("storyTagline");
const storyTextEl = document.getElementById("storyText");
const choicesContainer = document.getElementById("choicesContainer");
const endingMediaEl = document.getElementById("endingMedia");

const backButton = document.getElementById("backButton");
const soundToggle = document.getElementById("soundToggle");
const clickSound = document.getElementById("clickSound");

// --- INIT -------------------------------------------------------------------

renderStoryCards();

backButton.addEventListener("click", () => {
  showHomeView();
});

soundToggle.addEventListener("click", () => {
  soundsEnabled = !soundsEnabled;
  soundToggle.classList.toggle("sound-toggle--muted", !soundsEnabled);
  soundToggle.textContent = soundsEnabled ? "🔈" : "🔇";
});

function playClick() {
  if (!soundsEnabled) return;
  // Small trick to allow rapid clicking
  clickSound.currentTime = 0;
  clickSound.play().catch(() => {});
}

// --- RENDER HOME ------------------------------------------------------------

function renderStoryCards() {
  storiesGrid.innerHTML = "";

  STORIES.forEach(story => {
    const card = document.createElement("article");
    card.className = "story-card";
    card.setAttribute("data-story-id", story.id);

    card.innerHTML = `
      <h3>${story.title}</h3>
      <p>${story.tagline}</p>
      <div class="story-meta">
        <span class="story-chip">${story.mood}</span>
        <span>Tap to begin →</span>
      </div>
    `;

    card.addEventListener("click", () => {
      startStory(story.id);
    });

    storiesGrid.appendChild(card);
  });
}

// --- STORY LOGIC ------------------------------------------------------------

function startStory(storyId) {
  const story = STORIES.find(s => s.id === storyId);
  if (!story) return;

  currentStory = story;
  currentPassageKey = "start";

  storyTitleEl.textContent = story.title;
  storyTaglineEl.textContent = story.tagline;

  showStoryView();
  renderCurrentPassage();
}

function renderCurrentPassage() {
  if (!currentStory) return;

  const passage = currentStory.passages[currentPassageKey];
  if (!passage) return;

  // Reset panel state
  const panel = storyTextEl.parentElement;
  panel.classList.remove("story-panel--ending");
  endingMediaEl.innerHTML = "";

  storyTextEl.textContent = passage.text;
  storyTextEl.style.animation = "none";
  // force reflow
  // eslint-disable-next-line no-unused-expressions
  storyTextEl.offsetHeight;
  storyTextEl.style.animation = "";

  choicesContainer.innerHTML = "";

  if (passage.type === "ending") {
    panel.classList.add("story-panel--ending");
    renderEndingMedia(passage);
    return;
  }

  // Render choices for non-ending passage
  passage.choices?.forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "choice-button";
    btn.innerHTML = `
      <span class="choice-label">${choice.label}</span>
      <span class="choice-icon">↗</span>
    `;
    btn.addEventListener("click", () => {
      playClick();
      currentPassageKey = choice.target;
      renderCurrentPassage();
    });
    choicesContainer.appendChild(btn);
  });
}

function renderEndingMedia(passage) {
  // No choices at an ending
  choicesContainer.innerHTML = "";

  if (passage.image) {
    const img = document.createElement("img");
    img.src = passage.image;
    img.alt = "Ending illustration";
    endingMediaEl.appendChild(img);
  }

  if (passage.video) {
    const video = document.createElement("video");
    video.src = passage.video;
    video.controls = true;
    endingMediaEl.appendChild(video);
  }

  // Add a "Back to start" option for the same story
  const restartBtn = document.createElement("button");
  restartBtn.className = "choice-button";
  restartBtn.innerHTML = `
    <span class="choice-label">Start this story over</span>
    <span class="choice-icon">⟳</span>
  `;
  restartBtn.addEventListener("click", () => {
    playClick();
    currentPassageKey = "start";
    renderCurrentPassage();
  });

  const homeBtn = document.createElement("button");
  homeBtn.className = "choice-button";
  homeBtn.innerHTML = `
    <span class="choice-label">Return to story list</span>
    <span class="choice-icon">⌂</span>
  `;
  homeBtn.addEventListener("click", () => {
    playClick();
    showHomeView();
  });

  choicesContainer.appendChild(restartBtn);
  choicesContainer.appendChild(homeBtn);
}

// --- VIEW SWITCHING ---------------------------------------------------------

function showStoryView() {
  homeView.classList.remove("view--active");
  homeView.classList.add("view--hidden");
  storyView.classList.remove("view--hidden");
  storyView.classList.add("view--active");
}

function showHomeView() {
  storyView.classList.remove("view--active");
  storyView.classList.add("view--hidden");
  homeView.classList.remove("view--hidden");
  homeView.classList.add("view--active");
}
