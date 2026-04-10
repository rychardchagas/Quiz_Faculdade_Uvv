/**
 * DevQuest Quiz Engine
 * Shared logic for all standard quiz pages.
 *
 * Usage — before including this script, set:
 *   window.QUIZ_CONFIG = {
 *     subject:   'frontend',          // key in perguntas.json
 *     accent:    '#bf00ff',           // neon color for this page
 *     accentRgb: '191, 0, 255',       // same color as "r, g, b"
 *     jsonPath:  '../assets/data/perguntas.json',
 *     imageBase: '../'                // optional prefix for q.imagem paths
 *   };
 */
(function () {
  'use strict';

  const cfg = window.QUIZ_CONFIG || {};
  const subject   = cfg.subject   || 'frontend';
  const accent    = cfg.accent    || '#00f0ff';
  const accentRgb = cfg.accentRgb || '0, 240, 255';
  const jsonPath  = cfg.jsonPath  || '../assets/data/perguntas.json';
  const imageBase = cfg.imageBase || '';

  // Apply CSS accent variables to :root
  document.documentElement.style.setProperty('--accent',     accent);
  document.documentElement.style.setProperty('--accent-rgb', accentRgb);

  let questions       = [];
  let currentQuestion = 0;
  let score           = 0;

  /* ── Utilities ─────────────────────────────────────────── */

  function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g,  '&amp;')
      .replace(/</g,  '&lt;')
      .replace(/>/g,  '&gt;')
      .replace(/"/g,  '&quot;')
      .replace(/'/g,  '&#039;');
  }

  /* ── Load ───────────────────────────────────────────────── */

  async function loadQuestions() {
    try {
      const res = await fetch(jsonPath);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      questions = shuffleArray(data[subject] || []);

      const loadingEl = document.getElementById('loading');
      const containerEl = document.getElementById('quiz-container');

      if (questions.length === 0) {
        loadingEl.textContent = 'Nenhuma pergunta encontrada para este módulo.';
        return;
      }
      loadingEl.classList.add('hidden');
      containerEl.classList.remove('hidden');
      showQuestion();
    } catch (err) {
      console.error('[QuizEngine]', err);
      const loadingEl = document.getElementById('loading');
      if (loadingEl) loadingEl.textContent = `Erro ao carregar: ${err.message}`;
    }
  }

  /* ── Render ─────────────────────────────────────────────── */

  function showQuestion() {
    const area   = document.getElementById('question-area');
    const nextBtn = document.getElementById('next-btn');
    const q      = questions[currentQuestion];

    nextBtn.classList.add('hidden');

    // Build HTML
    let html = `
      <div class="question-counter">Questão ${currentQuestion + 1} / ${questions.length}</div>
      <h2 class="question-title">${escapeHtml(q.titulo)}</h2>
    `;

    if (q.descricao) {
      html += `<p class="question-desc">${escapeHtml(q.descricao)}</p>`;
    }

    if (q.imagem) {
      html += `
        <div style="margin:1.25rem 0;border:1px solid var(--border-glow);overflow:hidden;">
          <img src="${imageBase}${escapeHtml(q.imagem)}"
               alt="Imagem da questão"
               style="width:100%;height:auto;display:block;"
               loading="lazy">
        </div>
      `;
    }

    if (q.codigo) {
      html += `
        <div class="code-container">
          <div class="code-header">
            <span class="code-dot red"></span>
            <span class="code-dot yellow"></span>
            <span class="code-dot green"></span>
            <span class="code-label">// code</span>
          </div>
          <pre><code>${escapeHtml(q.codigo)}</code></pre>
        </div>
      `;
    }

    if (Array.isArray(q.afirmacoes) && q.afirmacoes.length > 0) {
      html += `<p class="affirmation-label">// analise as afirmações:</p>`;
      html += q.afirmacoes.map(item => `
        <div class="affirmation-item">
          <span class="affirmation-id">${escapeHtml(item.id)}</span>
          <span class="affirmation-text">${escapeHtml(item.texto)}</span>
        </div>
      `).join('');
    }

    html += `<div class="options-list" id="options-box"></div>`;
    area.innerHTML = html;

    // Highlight code blocks
    area.querySelectorAll('pre code').forEach(block => {
      if (window.hljs) hljs.highlightElement(block);
    });

    // Render options
    const optionsBox    = document.getElementById('options-box');
    const letters       = ['A', 'B', 'C', 'D', 'E', 'F'];
    const shuffledOpts  = shuffleArray(q.opcoes || []);

    shuffledOpts.forEach((text, i) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = `
        <span class="option-letter">${letters[i]})</span>
        <span class="option-text">${escapeHtml(String(text))}</span>
      `;
      btn.addEventListener('click', () => checkAnswer(btn, String(text), q.resposta));
      optionsBox.appendChild(btn);
    });
  }

  /* ── Check answer ───────────────────────────────────────── */

  function checkAnswer(selectedBtn, selectedText, correctText) {
    const allBtns = document.querySelectorAll('#options-box .option-btn');
    const nextBtn = document.getElementById('next-btn');
    const isCorrect =
      selectedText.trim().toLowerCase() === correctText.trim().toLowerCase();

    allBtns.forEach(b => { b.disabled = true; });

    if (isCorrect) {
      selectedBtn.classList.add('correct-answer');
      score++;
    } else {
      selectedBtn.classList.add('wrong-answer');
      // Reveal correct
      allBtns.forEach(b => {
        const t = b.querySelector('.option-text');
        if (t && t.innerText.trim().toLowerCase() === correctText.trim().toLowerCase()) {
          b.classList.add('correct-answer');
        }
      });
    }

    nextBtn.classList.remove('hidden');
  }

  /* ── Next / Results ─────────────────────────────────────── */

  function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      showQuestion();
    } else {
      showResults();
    }
  }

  function showResults() {
    document.getElementById('quiz-container').classList.add('hidden');
    const finalScreen = document.getElementById('final-screen');
    finalScreen.classList.remove('hidden');
    const scoreEl = document.getElementById('score-text');
    if (scoreEl) scoreEl.textContent = `${score} de ${questions.length}`;
  }

  /* ── Expose globals ─────────────────────────────────────── */
  window.nextQuestion  = nextQuestion;

  /* ── Auto-init on DOM ready ─────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadQuestions);
  } else {
    loadQuestions();
  }

})();
