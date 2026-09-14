/**
 * Vee Tools & Quiz Application Engine
 */

// Tool Registry Database
const TOOLS_DB = {
  'jpg-to-png': {
    title: 'JPG to PNG Converter',
    category: 'Image Tools',
    meta: 'Convert JPG images to PNG format instantly in your browser.',
    h1: 'Online JPG to PNG Converter',
    intro: 'Convert JPG photos to PNG format without uploading files to external servers.',
    type: 'image-convert',
    targetFormat: 'image/png',
    ext: 'png',
    faq: [
      { q: 'Is my image uploaded to a server?', a: 'No, all conversions occur locally in your Web Browser.' },
      { q: 'Is this converter free to use?', a: 'Yes, 100% free with no file limits.' }
    ]
  },
  'png-to-jpg': {
    title: 'PNG to JPG Converter',
    category: 'Image Tools',
    meta: 'Convert PNG images to JPG format directly in your browser.',
    h1: 'Online PNG to JPG Converter',
    intro: 'Transform transparent or opaque PNGs into compact JPG images.',
    type: 'image-convert',
    targetFormat: 'image/jpeg',
    ext: 'jpg',
    faq: [{ q: 'Does this convert PNG transparency?', a: 'Transparent backgrounds are filled with solid white.' }]
  },
  'word-counter': {
    title: 'Word & Character Counter',
    category: 'Text Tools',
    meta: 'Count words, characters, sentences, and estimated reading time.',
    h1: 'Word & Character Counter',
    intro: 'Paste your text below to view real-time text analysis statistics.',
    type: 'word-counter',
    faq: [{ q: 'Does this save my text?', a: 'No text is stored or transmitted anywhere.' }]
  },
  'bmi-calculator': {
    title: 'BMI Calculator',
    category: 'Calculators',
    meta: 'Calculate your Body Mass Index (BMI) instantly.',
    h1: 'Body Mass Index (BMI) Calculator',
    intro: 'Determine your BMI score and weight status category.',
    type: 'bmi-calc',
    faq: [{ q: 'What is a healthy BMI range?', a: 'Standard healthy BMI is between 18.5 and 24.9.' }]
  },
  'qr-generator': {
    title: 'QR Code Generator',
    category: 'Generators',
    meta: 'Create custom QR codes for URLs, text, and Wi-Fi instantly.',
    h1: 'Free Online QR Code Generator',
    intro: 'Generate downloadable high-resolution QR codes.',
    type: 'qr-gen',
    faq: [{ q: 'Do these QR codes expire?', a: 'No, generated static QR codes never expire.' }]
  },
  'vee-quiz': {
    title: 'Vee Quiz - General Knowledge & Science',
    category: 'Quizzes',
    meta: 'Test your knowledge across science, tech, history, and sports.',
    h1: 'Interactive Knowledge Quiz',
    intro: 'Select an answer to proceed through the automated evaluation sequence.',
    type: 'quiz-engine',
    faq: [{ q: 'How is the score calculated?', a: 'Each correct answer grants 1 point.' }]
  }
};

// Quiz Question Database
const QUIZ_DATA = [
  { q: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], answer: 1 },
  { q: "What is the chemical symbol for Gold?", options: ["Ag", "Fe", "Au", "Hg"], answer: 2 },
  { q: "Which language runs natively in Web Browsers?", options: ["Java", "C++", "Python", "JavaScript"], answer: 3 },
  { q: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: 3 }
];

// Router Engine
window.addEventListener('DOMContentLoaded', initRouter);
window.addEventListener('hashchange', initRouter);

function initRouter() {
  const hash = window.location.hash.replace('#', '') || 'home';
  const root = document.getElementById('app-root');

  if (hash === 'home') {
    renderHome(root);
  } else if (TOOLS_DB[hash]) {
    renderToolPage(root, hash, TOOLS_DB[hash]);
  } else {
    renderHome(root);
  }
  window.scrollTo(0, 0);
}

// Render Home
function renderHome(container) {
  let html = `
    <section class="hero">
      <h1>Vee Tools & Quiz</h1>
      <p>Free online tools that make everyday tasks easier.</p>
      <input type="text" id="tool-search" class="search-box" placeholder="What do you need help with? (e.g. JPG, BMI, Word Counter)" onkeyup="filterTools()">
    </section>
    <h2>Popular Tools</h2>
    <div class="grid" id="tools-grid">
  `;

  for (const [key, tool] of Object.entries(TOOLS_DB)) {
    html += `
      <a href="#${key}" class="card" data-title="${tool.title.toLowerCase()}">
        <h3>${tool.title}</h3>
        <p>${tool.intro}</p>
      </a>
    `;
  }

  html += `</div>`;
  container.innerHTML = html;
}

function filterTools() {
  const q = document.getElementById('tool-search').value.toLowerCase();
  const cards = document.querySelectorAll('#tools-grid .card');
  cards.forEach(card => {
    const title = card.getAttribute('data-title');
    card.style.display = title.includes(q) ? 'block' : 'none';
  });
}

// Universal Tool Page Layout Renderer
function renderToolPage(container, id, config) {
  let toolUI = '';

  if (config.type === 'image-convert') {
    toolUI = `
      <div class="dropzone" onclick="document.getElementById('img-input').click()">
        <p>Click or Drop Image Here to Convert to ${config.ext.toUpperCase()}</p>
        <input type="file" id="img-input" accept="image/*" style="display:none" onchange="processImage(this.files[0], '${config.targetFormat}', '${config.ext}')">
      </div>
      <div id="image-output"></div>
    `;
  } else if (config.type === 'word-counter') {
    toolUI = `
      <div class="form-group">
        <textarea id="text-input" class="form-control" rows="8" placeholder="Type or paste your text here..." oninput="processText()"></textarea>
      </div>
      <div class="grid" style="grid-template-columns: repeat(3, 1fr);">
        <div class="card"><h3>Words</h3><p id="cnt-words">0</p></div>
        <div class="card"><h3>Characters</h3><p id="cnt-chars">0</p></div>
        <div class="card"><h3>Reading Time</h3><p id="cnt-time">0 min</p></div>
      </div>
    `;
  } else if (config.type === 'bmi-calc') {
    toolUI = `
      <div class="form-group">
        <label>Height (cm)</label>
        <input type="number" id="bmi-h" class="form-control" placeholder="175">
      </div>
      <div class="form-group">
        <label>Weight (kg)</label>
        <input type="number" id="bmi-w" class="form-control" placeholder="70">
      </div>
      <button class="btn" onclick="calculateBMI()">Calculate BMI</button>
      <div id="bmi-result" style="margin-top:1rem; font-weight:bold;"></div>
    `;
  } else if (config.type === 'qr-gen') {
    toolUI = `
      <div class="form-group">
        <label>Text or URL</label>
        <input type="text" id="qr-text" class="form-control" placeholder="https://example.com">
      </div>
      <button class="btn" onclick="generateQR()">Generate QR Code</button>
      <div id="qr-output" style="margin-top:1rem; text-align:center;"></div>
    `;
  } else if (config.type === 'quiz-engine') {
    toolUI = `<div id="quiz-box"></div>`;
    setTimeout(initQuiz, 50);
  }

  let faqHTML = config.faq.map(f => `<h3>${f.q}</h3><p>${f.a}</p>`).join('');

  container.innerHTML = `
    <div class="tool-container">
      <h1>${config.h1}</h1>
      <p style="margin-bottom: 1.5rem; color: var(--text-muted);">${config.intro}</p>
      ${toolUI}
    </div>
    <article class="seo-article">
      <h2>How to Use This Tool</h2>
      <p>Follow the simple steps provided in the interactive container above. Processing is instant and handled locally on your device.</p>
      <h2>Frequently Asked Questions</h2>
      ${faqHTML}
    </article>
  `;
}

// Logic Modules
function processImage(file, mimeType, ext) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (mimeType === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL(mimeType, 0.92);
      document.getElementById('image-output').innerHTML = `
        <p>Conversion Complete!</p>
        <a href="${dataUrl}" download="converted.${ext}" class="btn" style="margin-top:0.5rem">Download ${ext.toUpperCase()}</a>
      `;
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function processText() {
  const val = document.getElementById('text-input').value;
  const words = val.trim() ? val.trim().split(/\s+/).length : 0;
  const chars = val.length;
  const time = Math.ceil(words / 200);
  document.getElementById('cnt-words').innerText = words;
  document.getElementById('cnt-chars').innerText = chars;
  document.getElementById('cnt-time').innerText = `${time} min`;
}

function calculateBMI() {
  const h = parseFloat(document.getElementById('bmi-h').value) / 100;
  const w = parseFloat(document.getElementById('bmi-w').value);
  if (!h || !w) return;
  const bmi = (w / (h * h)).toFixed(1);
  let status = 'Normal weight';
  if (bmi < 18.5) status = 'Underweight';
  if (bmi >= 25) status = 'Overweight';
  if (bmi >= 30) status = 'Obesity';
  document.getElementById('bmi-result').innerText = `Your BMI: ${bmi} (${status})`;
}

function generateQR() {
  const text = document.getElementById('qr-text').value;
  const container = document.getElementById('qr-output');
  container.innerHTML = '';
  if (!text) return;
  new QRCode(container, { text: text, width: 128, height: 128 });
}

let qIdx = 0, qScore = 0;
function initQuiz() {
  qIdx = 0; qScore = 0;
  renderQuestion();
}

function renderQuestion() {
  const box = document.getElementById('quiz-box');
  if (qIdx >= QUIZ_DATA.length) {
    box.innerHTML = `
      <h2>Quiz Complete!</h2>
      <p>Final Score: ${qScore} / ${QUIZ_DATA.length}</p>
      <button class="btn" onclick="initQuiz()" style="margin-top:1rem">Restart Quiz</button>
    `;
    return;
  }
  const q = QUIZ_DATA[qIdx];
  let optionsHTML = q.options.map((opt, i) => 
    `<button class="btn" style="display:block; width:100%; margin-bottom:0.5rem; background:var(--surface); color:var(--text); border:1px solid var(--border);" onclick="checkQuiz(${i})">${opt}</button>`
  ).join('');

  box.innerHTML = `
    <h3>Question ${qIdx + 1} of ${QUIZ_DATA.length}</h3>
    <p style="font-size:1.2rem; margin:1rem 0;">${q.q}</p>
    ${optionsHTML}
  `;
}

function checkQuiz(selected) {
  if (selected === QUIZ_DATA[qIdx].answer) qScore++;
  qIdx++;
  renderQuestion();
}
