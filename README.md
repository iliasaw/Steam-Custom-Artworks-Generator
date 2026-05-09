# Steam Custom Artworks Generator

![Preview](https://i.imgur.com/WvjTYmr.png)

A pixel-perfect visual tool to generate consistent, professional library artworks for your Steam collection. It automates fetching data and images while giving you full control over positioning and batch exporting.

## 🚀 Key Features

*   **Pixel-Perfect Templates**: Matches original Steam designs for Grid, Horizontal (P), and Hero artworks.
*   **Smart Truncation**: JavaScript-based text clamping ensures game titles always fit perfectly with `...` without visual glitches.
*   **Dual Data Sources**: Fetches backgrounds from **SteamGridDB** and official **Steam CDN** (library_hero, header, etc.).
*   **Age-Gate Bypass**: Automatically handles 18+ restricted games using internal cookie handling.
*   **Manual Override**: Built-in support for games without store pages, DLCs, or regional exclusives.
*   **Interactive Drag & Drop**: Adjust background positioning manually for every artwork.
*   **Batch Export**: Add multiple games to a queue and export them as a single ZIP or save directly to your Steam directory.

## 🛠️ Tech Stack

*   **Backend**: Node.js (Proxy server to bypass CORS and Steam age gates)
*   **Frontend**: HTML5 / Vanilla CSS / JavaScript
*   **Libraries**: [html2canvas](https://html2canvas.hertzen.com/) (rendering), [JSZip](https://stuk.github.io/jszip/) (batching), [Axios](https://axios-http.com/) (proxying).

## 📥 Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/iliasaw/Steam-Custom-Artworks-Generator.git
    cd Steam-Custom-Artworks-Generator
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure API Key:**
    Open `scripts/server.js` and insert your [SteamGridDB API Key](https://www.steamgriddb.com/profile/api):
    ```javascript
    const SGDB_API_KEY = 'your_api_key_here';
    ```

4.  **Start the app:**
    ```bash
    npm start
    ```
    Or simply run `start.bat`.

## 📖 Usage

1.  Navigate to `http://localhost:3200` in your browser.
2.  Paste a **Steam AppID** or **Store URL**.
3.  Choose a background from the generated gallery (SGDB or Steam CDN).
4.  **Drag the image** in the preview to adjust its position.
5.  Click **"+ Add to Queue"** to save your progress.
6.  Once finished, use **"Download ZIP"** or **"Save to Steam"** in the sidebar.

## 🙌 Contributors

*   **[@SpaceEnergy](https://github.com/SpaceEnergy)** — Original Idea & Design
*   **[@noxygalaxy](https://github.com/noxygalaxy)** — Workflow Automation
*   **[@iliasaw](https://github.com/iliasaw)** — Visual Generator Tool & Backend Proxy

## ⚖️ License

This project is licensed under the MIT License. It is intended for personal use in organizing Steam libraries. All game assets belong to their respective owners.
