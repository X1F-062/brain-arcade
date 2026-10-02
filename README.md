# Beyin Arcade

A retro-inspired brain-training arcade with **30 short games** for memory, attention, speed, cognitive flexibility, and problem-solving. Play a quick daily workout, get immediate feedback, and track your scores as you improve.

> **Language:** The README is in English, but the game's interface is currently in Turkish.

## What’s included

- **30 games across five categories** — six games in each:
  - **Memory:** Sequence Memory, Reverse Sequence, Mega Sequence, Number Memory, Location Memory, and Match the Cards.
  - **Attention:** Odd Emoji, Letter Trap, Number Trap, Arrow Direction, Count the Stars, and Light Hunt.
  - **Speed:** Quick Math, True or False, Which Is Greater?, Odd or Even, Catch the Light, and Reaction.
  - **Flexibility:** Color Conflict, Color or Word, Reverse Arrow, Switch the Rule, Letter and Number, and Don’t Press Red.
  - **Problem-solving:** Missing Number, Hard Sequence, Missing Operator, Chain Calculation, Logic Chain, and Find the Equivalent.
- **A daily workout** with three suggested games, refreshed each day.
- **Progress tracking:** personal bests, recent scores, category progress, daily streaks, and achievement badges.
- **Short rounds and adaptive challenge:** many games adjust their difficulty as you play.
- **Retro pixel-art styling**, responsive layouts, sound effects, and light and dark themes.
- **Keyboard controls** in supported games: `1`–`4` to choose an answer, `←` / `→` for two-choice questions, `Space` for the reaction test, and `Esc` to leave a game.

## Getting started

### Requirements

- [Node.js](https://nodejs.org/) 16 or later
- A modern web browser

No package installation or build step is required. The server uses Node.js built-in modules.

### Run the app

From the project directory, run:

```sh
npm start
```

Alternatively:

- **Windows:** double-click `baslat.bat`.
- **macOS / Linux:** run `sh baslat.sh`.

Open the URL printed in the terminal (normally [http://localhost:3000](http://localhost:3000)). If that port is already in use, the server tries the next available port.

### Run without Node.js

You can serve the static files with Python:

```sh
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000). In this mode, progress is saved only in that browser; the Node.js server is needed to also save progress to a file.

## Progress and local data

Progress is stored in your browser’s local storage. When you run the app with the Node.js server, it is also saved to `data/progress.json` in the project directory, so it can be restored when you open the app through that server again.

The project does not require an account or a cloud service. The pixel fonts are loaded from Google Fonts, so an internet connection may be needed to display them.

## Project structure

```text
.
├── index.html       # App page and metadata
├── css/
│   └── style.css    # Layout, themes, and game styling
├── js/
│   └── app.js       # Games, daily workout, and progress tracking
├── server.js        # Local web server and progress-file API
├── baslat.bat       # Windows launcher
└── baslat.sh        # macOS / Linux launcher
```
