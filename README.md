# OS Resource & Process Management Simulator
### Operating Systems Project — Review 2 Mid-Progress

**Team Members:**
- **Yash Gupta** (24BCE0759) — Module 1: Process & Resource Management
- **Shaunak Dutta** (24BCE2058) — Module 2: Deadlock & Algorithm Suite
- **Sapandeep Kour** (24BCE0960) — Module 3: Frontend & Visualization Dashboard

**Faculty Guide:** Prof. Sujitra J (SCOPE)

---

## 🚀 How to Run the Simulator

1. **Direct Browser Execution (No Installation Required):**
   - Simply double-click [`index.html`](file:///C:/Users/Yash%20Gupta/.gemini/antigravity-ide/scratch/os-resource-simulator/index.html) or right-click and open with Chrome, Edge, Brave, or Firefox.
   - It is 100% self-contained (HTML5, Vanilla CSS, Modern JavaScript) with zero external dependencies.

2. **Or run with a lightweight local server (optional):**
   ```bash
   # From this directory:
   npx serve .
   # or
   python -m http.server 3000
   ```

---

## 🎯 How to Demonstrate to Faculty in Review 2

1. **Open the Simulator:**
   - Notice the top header with the project title, team badges, and live status.
   - The textbook preset (Silberschatz 5 processes, 3 resources) is loaded by default.

2. **Show the Safe Sequence:**
   - Click **"Run Banker's Safety Check"**.
   - Point out the glowing **SAFE STATE** badge and the safe execution sequence pipeline:
     `P1 ➔ P3 ➔ P4 ➔ P0 ➔ P2` (or `P1 ➔ P3 ➔ P0 ➔ P2 ➔ P4`).

3. **Demonstrate Step-by-Step Visualization:**
   - Click **"Step-by-Step Visualizer"**.
   - Click **"Next Step ▶"** or **"Auto Play ⏩"**.
   - Show your faculty how the **Work Vector** updates as each process finishes and how the explanation box displays the mathematical reason why each process was chosen (`Need <= Work`).

4. **Demonstrate Resource Request & Rollback:**
   - Click **"Simulate Resource Request"** (or use the inline form in the right panel).
   - Test a safe request: Choose **P1**, enter `[1, 0, 2]`, click Evaluate $\rightarrow$ **GRANTED**.
   - Test an unsafe request: Choose **P4**, enter `[3, 3, 0]`, click Evaluate $\rightarrow$ **DENIED & ROLLED BACK** with explanation!

5. **Demonstrate Deadlock Detection:**
   - Click the preset **"Deadlock Detected"**.
   - Click **"Run Deadlock Detection"**.
   - Show how the algorithm isolates and highlights the deadlocked processes.

6. **Show Review 2 Mid-Progress Documentation & Report:**
   - Click **"Review 2 Report & Viva Guide"** in the top navigation.
   - You can show the completed modules, test cases, and viva Q&A directly on screen, or click **"Print / Save as PDF"**!

---

## 📂 Project Structure

- [`index.html`](file:///C:/Users/Yash%20Gupta/.gemini/antigravity-ide/scratch/os-resource-simulator/index.html): Main interactive web dashboard.
- [`style.css`](file:///C:/Users/Yash%20Gupta/.gemini/antigravity-ide/scratch/os-resource-simulator/style.css): Modern dark-mode glassmorphic design system.
- [`simulator.js`](file:///C:/Users/Yash%20Gupta/.gemini/antigravity-ide/scratch/os-resource-simulator/simulator.js): Core engine implementing Module 1, Module 2, and Module 3 logic.
- [`REVIEW_2_MID_PROGRESS_REPORT.md`](file:///C:/Users/Yash%20Gupta/.gemini/antigravity-ide/scratch/os-resource-simulator/REVIEW_2_MID_PROGRESS_REPORT.md): Ready-to-submit Word report text with full details, test tables, and viva answers.
