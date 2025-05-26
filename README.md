# PM Weather

**PM Weather** is a lightweight desktop application that pulls and displays weather information from Openweather API.</br>
It has robust location detection using openweather geocoding API ensuring only valid cities are accepted.</br>
It's serverless and stores user data locally using SQLite.</br>
Built with **React + Vite** and wrapped in **Electron**, it runs as a native Windows app without installation required (portable).

> **Author**: Ismael Coulibaly (aka **Hy-5**)

---

## 🚀 Getting Started

### Method 1 — Grab the latest release (easiest)

1. Download the newest ZIP from the **[Releases](../../releases)** tab on GitHub.
2. Unzip it anywhere you like.
3. Open the `PM_Weather` folder and double-click **`PM_Weather.exe`**.
   Done.

### Method 2 — Build from source (assuming VS Code workflow)

| Step | What to do |
|------|------------|
| 1 | **Install Node.js** (tested with node v22.14.0 and npm v11.3.0). |
| 2 | Open the project folder in **VS Code** (or whatever editor you prefer). |
| 3 | In the terminal, run `npm install` to install all dependencies. |
| 4a | Either `npm run dbuild` &nbsp;→ builds _and_ launches the desktop app. |
| 4b | Or `npm run dist` &nbsp;→ creates a production build plus both an installer and portable `.exe`. Then go in the application project folder, and in the release folder, you can either use the installer (`PM_Weather Setup 1.0.0.exe`) or the portable version (inside the `win-unpacked` folder, double-click on `PM_Weather.exe`). |

---

## 🔧 Tech Stack

- **React + Vite** – front-end scaffolding  
- **Electron** – cross-platform desktop shell (currently packaged for Windows)

---

## 📌 Roadmap / To-Dos

- [ ] macOS & Linux builds  
- [ ] UI rework
- [ ] Location based landmark picture
- [ ] Performance improvements
- [ ] Serverless web-version deployment

_Your feature ideas are welcome—open an issue or start a discussion._

---

## 📜 License

--WIP--

---

### Contact

- Portfolio: <a href="https://ismco.me/" target="_blank">Ismco</a>
- GitHub: **[@Hy-5](https://github.com/Hy-5)**