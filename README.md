# 🛕 Temple Dash — Jungle Run

> An endless-runner browser game built using HTML, CSS, JavaScript, and the HTML Canvas API.

**Temple Dash** is a beginner-friendly, Temple Run-inspired game created to demonstrate frontend development and basic game mechanics. Run through an ancient jungle, switch between three lanes, jump over obstacles, and collect golden coins as the game gradually becomes faster.

## 🎮 Features

- 🌿 Jungle environment with an ancient temple and perspective-based running track
- 🏃 Three-lane player movement
- 🪨 Obstacles, including rocks and fallen logs
- 🦘 Jump mechanics to avoid obstacles
- 🪙 Collectible coins and bonus points
- 📈 Increasing difficulty as the run progresses
- 🏆 Live score, coin counter, and best-run tracking
- 💾 Best score saved using browser `localStorage`
- 📱 Responsive interface with keyboard and touch controls
- ☁️ Ready for static cloud hosting through GitHub Pages

## 🧰 Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Structure of the webpage and game interface |
| CSS3 | Styling, layout, animations, and responsive design |
| JavaScript | Game logic, movement, scoring, and collision detection |
| Canvas API | Drawing the game environment and characters |
| Local Storage | Saving the best score in the browser |
| GitHub Pages | Optional deployment and static web hosting |

## 📁 Project Structure

```text
temple-dash/
├── index.html
├── style.css
├── script.js
└── README.md
```

- **index.html:** Defines the game interface, score display, and start screen.
- **style.css:** Controls the visual theme, layout, typography, and responsiveness.
- **script.js:** Implements movement, jumping, obstacles, coins, scoring, and the game loop.
- **README.md:** Documents the project, controls, setup, and deployment.

## 🕹️ How to Play

**Objective:** Run as far as possible while avoiding obstacles and collecting coins.

| Action | Control |
|---|---|
| Move left | Left Arrow or A |
| Move right | Right Arrow or D |
| Jump | Up Arrow, W, or Space |
| Restart | Run Again button |

On touch devices, swipe left or right to change lanes and swipe up to jump.

## ⚙️ How to Run Locally

1. Download and extract the project ZIP.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` directly in a browser, or use the Live Server extension.
4. Click **Start adventure** to begin playing.

No package installation or build process is required.

## 🧠 How the Game Works

1. **Game loop:** JavaScript uses `requestAnimationFrame()` to update and redraw the game.
2. **Player movement:** The player can switch between three lanes.
3. **Jumping:** Velocity and gravity create a simple jumping motion.
4. **Obstacle generation:** Rocks and logs appear in random lanes.
5. **Collision detection:** The game checks whether the player collides with an obstacle.
6. **Scoring:** Distance increases during gameplay, while collecting coins awards bonus points.
7. **Best score:** Browser local storage retains the highest score on the same browser and device.

## ☁️ Cloud Computing and Deployment

Temple Dash is a static web application. Its HTML, CSS, and JavaScript files can be hosted online without a dedicated backend server.

### Deploy using GitHub Pages

1. Create a repository on GitHub.
2. Upload `index.html`, `style.css`, and `script.js` to the repository.
3. Open **Settings → Pages**.
4. Select deployment from the `main` branch and the root directory.
5. Save the settings and wait for deployment.
6. Open the public URL provided by GitHub Pages.

This demonstrates static website hosting, deployment, and public access over the internet.

**Important:** The game runs in the visitor's browser. A global leaderboard or cloud-synchronised scores would require additional backend or database functionality.

## 🔮 Future Enhancements

- Background music and sound effects
- Pause and resume functionality
- Power-ups and special abilities
- Additional environments and characters
- More obstacle types and difficulty levels
- A global leaderboard using a cloud database
- 3D graphics using Three.js

## 📌 Project Limitations

Temple Dash is a simplified **2D endless-runner game**, not a full 3D recreation of Temple Run. The environment is rendered using the Canvas API rather than a 3D game engine.

## 📜
