# DevQuest

Plataforma colaborativa de questões para estudantes de **ADS** e **Ciência da Computação**.  
Tema visual cyberpunk com mini-game de fundo jogável.

---

## Módulos

| Módulo | Curso | Conteúdo |
|---|---|---|
| Frontend | ADS | HTML, CSS, React, JavaScript |
| UX / UI Design | ADS | Heurísticas, Figma, experiência do usuário |
| Engenharia de Software | ADS | Ciclo de vida, metodologias ágeis, qualidade |
| Back End | ADS | Node.js, APIs, bancos de dados |
| Estruturas de Dados | ADS | Arrays, Listas, Complexidade |
| Design Thinking | CC | Empatia, Ideação, Prototipagem |
| Lógica | CC | Algoritmos, pensamento computacional |
| Estruturas CC | CC | Pilhas, Filas, Big O |
| Modo Infernus | MIX | Engenharia + Backend + Estruturas — 3 vidas |

---

## Estrutura do projeto

```
Quiz_Interativo/
├── index.html               # Landing page — cyber theme + mini-game de fundo
├── pages/                   # Páginas de quiz (uma por módulo)
│   ├── frontend.html
│   ├── backend.html
│   ├── engenharia.html
│   ├── estruturas.html
│   ├── ux.html
│   ├── logica.html
│   ├── designthinking.html
│   ├── estruturascc.html
│   └── infernus.html        # Modo especial: 3 vidas, matérias misturadas
├── assets/
│   ├── css/cyber.css        # Tema cyberpunk: Orbitron, neon glow, scanlines, clip-path
│   ├── js/quiz-engine.js    # Lógica de quiz compartilhada (carrega via QUIZ_CONFIG)
│   ├── js/mascot.js         # Mascote interativo (gato / pantera)
│   ├── audio/               # Sons do mascote (miado1-5.mp3, onca1-3.mp3)
│   └── data/perguntas.json  # Banco de questões
├── photoeng/                # Imagens usadas nas questões de Engenharia
├── back/                    # API Flask opcional (MongoDB Atlas)
│   ├── app.py
│   ├── requirements.txt
│   └── Procfile
└── README.md
```

---

## Como rodar

O projeto usa `fetch()` para carregar o JSON de questões — **não abre direto via `file://`**.  
É necessário um servidor local:

**Python 3:**
```bash
cd Quiz_Interativo
python -m http.server 3000
```
Acesse: `http://localhost:3000`

**Node.js:**
```bash
npx serve Quiz_Interativo
```

**VS Code:** extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) → *Go Live*

---

## Mini-game (marca d'água)

A página inicial tem um endless runner rodando como fundo animado atrás do conteúdo.

| Controle | Ação |
|---|---|
| `SPACE` ou `↑` | Pular |
| Toque / clique no rodapé | Pular (mobile) |

- Personagem neon purple corre no rodapé da tela
- Obstáculos vermelhos com spike — desvie para não morrer
- Moedas amarelas — colete para ganhar +60 pts
- Velocidade aumenta com o score
- Prédios pixel art em parallax no fundo
- Game over → toque/space para reiniciar

---

## Como adicionar questões

Edite `assets/data/perguntas.json`. Cada módulo é uma chave com um array de questões:

```json
{
  "frontend": [
    {
      "titulo": "Título da questão",
      "descricao": "Enunciado completo...",
      "codigo": "// trecho de código (opcional)",
      "afirmacoes": [
        { "id": "I",  "texto": "Afirmação um" },
        { "id": "II", "texto": "Afirmação dois" }
      ],
      "opcoes": ["Opção A", "Opção B", "Opção C", "Opção D"],
      "resposta": "Opção A"
    }
  ]
}
```

Campos opcionais: `codigo`, `afirmacoes`, `imagem` (caminho relativo à raiz do projeto).

---

## Como adicionar um novo módulo

1. Copie qualquer arquivo de `pages/` como base
2. Ajuste o bloco de configuração no `<script>`:

```js
window.QUIZ_CONFIG = {
  subject:   'nomedomodulo',   // chave no perguntas.json
  accent:    '#00ffcc',        // cor neon da página
  accentRgb: '0, 255, 204',    // mesma cor em r, g, b
  jsonPath:  '../assets/data/perguntas.json'
};
```

3. Adicione um card no `index.html` com `--card-accent` e `--card-accent-rgb` correspondentes

---

## Backend (opcional)

A pasta `back/` tem uma API Flask que serve as questões via MongoDB Atlas.

```bash
cd back
pip install -r requirements.txt
MONGO_URI="sua_uri_aqui" python app.py
```

Para usar no frontend, troque o `jsonPath` no `QUIZ_CONFIG` pela URL da API.

---

## Tecnologias

- HTML5 · CSS3 · JavaScript (vanilla, sem frameworks)
- [Orbitron](https://fonts.google.com/specimen/Orbitron) · [Rajdhani](https://fonts.google.com/specimen/Rajdhani) · [Share Tech Mono](https://fonts.google.com/specimen/Share+Tech+Mono)
- [highlight.js](https://highlightjs.org/) — syntax highlighting nas questões de código
- Canvas API — mini-game endless runner
- Flask + PyMongo — backend opcional

---

Feito por **Vinicius Paiva** — [GitHub](https://github.com/ViniciusPaiva21/Quiz_Interativo)

Colaboração **Moreira** - https://github.com/rychardchagas
