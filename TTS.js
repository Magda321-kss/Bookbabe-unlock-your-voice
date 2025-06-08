let currentVoice = 'Jenny'; // Default: Bianca

const voiceMap = {
  Bianca: 'Microsoft Jenny Online (Natural) - English (United States)',
  Asante: 'Microsoft Aria Online (Natural) - English (United States)',
  'Prof. I': 'Microsoft Guy Online (Natural) - English (United States)'
};

function getSelectedVoiceName(name) {
  return voiceMap[name] || voiceMap.Bianca;
}

function loadVoices() {
  return new Promise((resolve) => {
    const voices = speechSynthesis.getVoices();
    if (voices.length) return resolve(voices);

    // Voice list may not be available immediately on some browsers
    speechSynthesis.onvoiceschanged = () => resolve(speechSynthesis.getVoices());
  });
}

export async function speak(text, voiceLabel = 'Bianca') {
  const voices = await loadVoices();
  const selectedVoiceName = getSelectedVoiceName(voiceLabel);
  const voice = voices.find(v => v.name === selectedVoiceName);

  if (!voice) {
    console.error('Selected voice not found. Using default voice.');
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voice || voices[0];
  utterance.rate = 1;
  utterance.pitch = 1;
  speechSynthesis.cancel(); // Stop any current speech
  speechSynthesis.speak(utterance);
}

export function setVoice(label) {
  if (voiceMap[label]) {
    currentVoice = label;
  }
}

export function speakWithCurrentVoice(text) {
  speak(text, currentVoice);
}
