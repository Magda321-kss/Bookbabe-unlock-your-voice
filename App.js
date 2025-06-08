// app.js

// IndexedDB setup let db; const request = indexedDB.open("bookbabeDB", 1);

request.onupgradeneeded = function (e) { db = e.target.result; const store = db.createObjectStore("transcripts", { keyPath: "id", }); };

request.onsuccess = function (e) { db = e.target.result; };

request.onerror = function (e) { console.error("IndexedDB error:", e); };

// Saving transcript function saveTranscript(transcript, mode) { const transaction = db.transaction(["transcripts"], "readwrite"); const store = transaction.objectStore("transcripts"); const id = Date.now(); const wordCount = transcript.split(/\s+/).length;

const data = { id, timestamp: new Date(), transcript, mode, wordCount, name: Transcript ${new Date().toLocaleString()}, };

store.add(data); speak("Transcript saved. Would you like to rename it?"); refreshSidebar(); }

// Load and sort transcripts function loadTranscripts(callback) { const transaction = db.transaction(["transcripts"], "readonly"); const store = transaction.objectStore("transcripts"); const request = store.getAll();

request.onsuccess = function (e) { const result = e.target.result; result.sort((a, b) => b.timestamp - a.timestamp); callback(result); }; }

// Refresh sidebar transcript list function refreshSidebar() { loadTranscripts((transcripts) => { const sidebar = document.getElementById("transcriptList"); sidebar.innerHTML = "";

transcripts.forEach((item) => {
  const li = document.createElement("li");
  li.textContent = `${item.name} (${item.wordCount} words)`;
  li.onclick = () => loadTranscriptToMain(item);
  sidebar.appendChild(li);
});

}); }

// Load selected transcript function loadTranscriptToMain(data) { document.getElementById("transcriptOutput").textContent = data.transcript; // Change mic to pen icon document.getElementById("recordButton").classList.add("edit-mode"); document.getElementById("recordButton").title = "Edit Transcript"; }

// TTS function function speak(text) { const utterance = new SpeechSynthesisUtterance(text); utterance.voice = speechSynthesis.getVoices().find((v) => v.name === "Jenny Neural"); speechSynthesis.speak(utterance); }

// Add mode-specific Bianca TTS prompts function biancaPrompt(mode) { switch (mode) { case "quiet": speak("Quiet mode activated. I'm listening."); break; case "math": speak("Math mode. Let’s get solving."); break; case "essay": speak("Essay mode. Ready to write."); break; default: speak("Mode activated."); } }

// Placeholder function for export function exportTranscript(text) { const blob = new Blob([text], { type: "text/plain" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = transcript_${Date.now()}.txt; a.click(); }

// Initialize app window.addEventListener("DOMContentLoaded", () => { refreshSidebar(); biancaPrompt("quiet"); });

