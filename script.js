// Debug: Confirm script loaded
console.log("script.js loaded successfully!");

let audioContext = null;
let hasUnlocked = false;

async function unlockAndScreech() {
  console.log("unlockAndScreech called!");  // Debug: click detected

  const status = document.getElementById('status');
  const btn = document.getElementById('unlockBtn');

  if (!status || !btn) {
    console.error("Status or button element not found!");
    return;
  }

  status.textContent = "Unlocking audio... hold on!";

  if (!hasUnlocked) {
    try {
      // Create and resume AudioContext on user gesture (required for Safari/Chrome/Edge)
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      console.log("AudioContext resumed!");
      hasUnlocked = true;
      status.textContent = "Unlocked! Click again for the full screech...";
      btn.textContent = "NOW PLAY THE DIAL-UP SCREECH!!! 📞🔊";
      return;  // First click unlocks only
    } catch (err) {
      console.error("AudioContext unlock failed:", err);
      status.textContent = "Unlock failed — see console for details. Try refresh.";
      return;
    }
  }

  // Second+ click: play the sound
  const dialup = document.getElementById('dialupSound');
  if (!dialup) {
    console.error("Audio element not found!");
    status.textContent = "Audio element missing!";
    return;
  }

  // No muting here! We want sound :)
  dialup.currentTime = 0;

  try {
    await dialup.play();
    console.log("Dial-up playing!");
    status.textContent = "EEEE-ERRRR-KSSSHHH... connecting... 💾🌐";
    btn.style.display = 'none';  // Hide button after success
  } catch (err) {
    console.error("Play failed:", err);
    status.textContent = "Play blocked — check console. Network/adblock/strict policy?";
  }
}

// Attach the event listener once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('unlockBtn').addEventListener('click', unlockAndScreech);
});

// Toast notification (unused for now, but kept)
function showToast() {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.classList.remove("show");
  void toast.offsetWidth; // trigger reflow
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Live date & time (unused for now, but kept)
function updateDateTime() {
  const now = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "3-digit",
    timeZoneName: "short",
    hour12: true
  };

  const el = document.getElementById("datetime");
  if (el) {
    el.textContent = now.toLocaleString("en-US", options);
  }
}

updateDateTime();
setInterval(updateDateTime, 1000);