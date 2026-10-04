# MID-PROGRESS REVIEW (REVIEW 2)
# OS RESOURCE & PROCESS MANAGEMENT SIMULATOR

**Course / Department:** Operating Systems / School of Computer Science and Engineering (SCOPE)  
**Guide / Faculty:** Prof. SUJITRA J  

---

### Team Details & Responsibilities:

| Team Member | Registration No. | Assigned Module | Mid-Progress Status |
| :--- | :--- | :--- | :--- |
| **YASH GUPTA** | **24BCE0759** | **Module 1: Process & Resource Management** | **Completed & Integrated** |
| **SHAUNAK DUTTA** | **24BCE2058** | **Module 2: Deadlock & Algorithm Suite** | **Completed & Integrated** |
| **SAPANDEEP KOUR** | **24BCE0960** | **Module 3: Frontend & Visualization Dashboard** | **Completed & Integrated** |

---

## 1. Project Overview & Background

An operating system manages multiple concurrent processes that compete for finite hardware and software resources, including CPU cycles, physical memory pages, disk storage, and I/O devices. Without algorithmic supervision, concurrent resource requests can lead to **unsafe states** and catastrophic **deadlocks**, wherein processes are blocked indefinitely waiting for resources held by each other.

Theoretical study of deadlock matrices and Banker's Algorithm through static textbook exercises often obscures the dynamic nature of process execution, state rollbacks, and vector transformations. To address this learning gap, our team has built the **OS Resource & Process Management Simulator**—an interactive, real-time simulation platform demonstrating dynamic process lifecycle management, matrix tracking, Banker's Safety Algorithm, safe-sequence generation, resource request evaluation with rollback, and multi-instance deadlock detection.

---

## 2. Problem Statement & Scope

### Problem Statement
In multi-programmed operating systems, granting resource requests without safety verification can drive the system into an unsafe state from which deadlock is unavoidable. The simulator addresses this challenge by providing a computer-aided interactive environment where students and faculty can:
1. Define arbitrary numbers of processes ($P_0, P_1, \dots, P_{n-1}$) and resource types ($R_0, R_1, \dots, R_{m-1}$).
2. Dynamically maintain and edit Allocation, Maximum, Need, and Available matrices.
3. Perform real-time Banker's safety state evaluations and compute valid safe execution sequences.
4. Simulate dynamic resource requests with automatic two-rule validation and rollback upon unsafe conditions.
5. Detect deadlock in multi-instance resource systems.

### Scope of the Mid-Progress Review (Review 2)
- Transition from the theoretical architectural design submitted in **Review 1** to a **working, interactive software prototype**.
- Implementation of the core process and resource management data structures (Module 1).
- Implementation and validation of Banker's Algorithm, Safe-Sequence generator, and Deadlock Detection (Module 2).
- Development of the interactive dashboard, real-time matrix grid, visual execution pipeline, and OS audit log console (Module 3).
- Execution and verification of standardized benchmark test cases.

---

## 3. System Architecture & Integrated Workflow

The system is architected as a modular, client-side, zero-latency reactive application. The three assigned modules interact seamlessly:

```
+-------------------------------------------------------------+
|                      USER INTERFACE                         |
|     (Presets, Inline Matrix Inputs, Stepper Controls)       |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|         MODULE 1: PROCESS & RESOURCE MANAGEMENT             |
|                  (Lead: Yash Gupta)                         |
|  - Process Control Block (PCB): State, Allocation, Max      |
|  - Invariant: Need[i][j] = Max[i][j] - Allocation[i][j]      |
|  - Invariant: Available[j] = Total[j] - SUM(Allocation[i][j])|
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|           MODULE 2: DEADLOCK & ALGORITHM SUITE              |
|                 (Lead: Shaunak Dutta)                       |
|  - Banker's Safety Algorithm: Work & Finish vectors         |
|  - Safe-Sequence Synthesis: <P1, P3, P4, P0, P2>            |
|  - Resource-Request Algorithm: Bound checks & Rollback      |
|  - Multi-Instance Deadlock Detection Algorithm              |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|         MODULE 3: FRONTEND & VISUALIZATION DASHBOARD        |
|                (Lead: Sapandeep Kour)                       |
|  - Live Matrix Table with Instant Reactive Updates          |
|  - Glowing Safe/Unsafe/Deadlock Status Banners              |
|  - Step-by-Step Stepper with Work/Finish Vector Chips       |
|  - OS Execution Audit Log Console                           |
+-------------------------------------------------------------+
```

---

## 4. Detailed Module Implementation (Work Completed in Review 2)

### 4.1 Module 1: Process & Resource Management
**Assigned Member: YASH GUPTA (24BCE0759)**  
**Status: 100% Implemented & Tested**

Yash Gupta developed the state engine and underlying data structures governing processes and system resources:

1. **Process Control Block (PCB) Representation:**
   Each process is maintained as a structured object containing:
   - `id`: Unique integer identifier ($0, 1, 2, \dots$).
   - `name`: Symbolic name (e.g., $P_0, P_1$).
   - `state`: Current process lifecycle state (`Ready`, `Running`, `Waiting`, `Finished`, or `Deadlocked`).
   - `allocation`: 1D array representing currently allocated resource instances.
   - `max`: 1D array representing maximum declared resource claim.
   - `need`: 1D array dynamically computed as $\text{Need}[i][j] = \text{Max}[i][j] - \text{Allocation}[i][j]$.

2. **System Resource Catalog & Availability Engine:**
   - Resources can be assigned custom names (e.g., $A, B, C$ or $\text{CPU}, \text{RAM}, \text{Disk}$).
   - System strictly enforces the resource conservation invariant:
     $$\text{Available}[j] = \text{Total}[j] - \sum_{i=0}^{n-1} \text{Allocation}[i][j]$$
   - Any manual edit to process allocation instantly updates the available vector across the system.

3. **Lifecycle Operations:**
   - **Process Creation (`addProcess`):** Initializes a new process with configurable maximum claims and initial allocations.
   - **Process Deletion / Termination (`deleteProcess`):** Terminates an active process and immediately reclaims its allocated resources into the $\text{Available}$ pool.
   - **Resource Release (`releaseProcessResources`):** Allows a process that has completed its task to release all held resources, transitioning its state to `Finished`.

---

### 4.2 Module 2: Deadlock & Algorithm Suite
**Assigned Member: SHAUNAK DUTTA (24BCE2058)**  
**Status: 100% Implemented & Tested**

Shaunak Dutta implemented the core operating systems algorithms for safe-state analysis, resource-request handling, and deadlock detection:

1. **Banker's Safety Algorithm ($O(m \times n^2)$):**
   - **Data Structures:**
     - $\text{Work}$: Vector of length $m$, initialized to $\text{Available}$.
     - $\text{Finish}$: Boolean array of length $n$, initialized to all `false`.
     - $\text{SafeSequence}$: Ordered list of process names.
   - **Algorithm Logic:**
     - Iterates through processes to find an index $i$ such that:
       $$\text{Finish}[i] == \text{false} \quad \text{and} \quad \text{Need}[i][j] \le \text{Work}[j] \quad (\forall j \in [0, m-1])$$
     - When found, simulates execution and resource reclamation:
       $$\text{Work}[j] = \text{Work}[j] + \text{Allocation}[i][j], \quad \text{Finish}[i] = \text{true}$$
     - Records step-by-step state snapshots (work vector, finish status, explanation) for the visualization stepper.
     - If all processes finish ($\sum \text{Finish}[i] == n$), the system is declared **SAFE** and the valid sequence is returned; otherwise, it is declared **UNSAFE**.

2. **Resource-Request Algorithm:**
   When process $P_i$ issues a request vector $\text{Request}_i$:
   - **Rule 1 (Claim Bound):** Verify $\text{Request}_i[j] \le \text{Need}[i][j]$. If violated, raise an error: process exceeded its maximum claim.
   - **Rule 2 (Availability Bound):** Verify $\text{Request}_i[j] \le \text{Available}[j]$. If violated, process $P_i$ transitions to `Waiting` state.
   - **Tentative Allocation:**
     $$\text{Available} = \text{Available} - \text{Request}_i$$
     $$\text{Allocation}[i] = \text{Allocation}[i] + \text{Request}_i$$
     $$\text{Need}[i] = \text{Need}[i] - \text{Request}_i$$
   - **Safety Evaluation & Rollback:** Run Banker's Safety Algorithm on tentative state. If **SAFE**, grant permanently; if **UNSAFE**, roll back changes and notify user why granting the request is hazardous.

3. **Multi-Instance Deadlock Detection Algorithm:**
   - Evaluates whether processes currently holding resources are in an unresolvable cyclic wait.
   - Identifies the exact subset of deadlocked processes and marks their state as `Deadlocked`.

---

### 4.3 Module 3: Frontend & Visualization Dashboard
**Assigned Member: SAPANDEEP KOUR (24BCE0960)**  
**Status: 100% Implemented & Tested**

Sapandeep Kour developed the user interface, reactive visualization components, and event orchestration:

1. **Dashboard Layout & Design System:**
   - Designed a modern, dark-mode OS theme with glowing visual hierarchy, subtle card backdrops, and responsive grid layouts.
   - Integrated Google Fonts (`Inter` and `Fira Code`) for clear matrix and vector legibility.

2. **Interactive Matrix Table:**
   - Displays Process ID, Process State, Allocation Matrix, Max Matrix, and Need Matrix side by side.
   - All cells are editable inline; changing any value immediately triggers live recalculations of $\text{Need}$, $\text{Available}$, and system safety.

3. **Step-by-Step Visualizer & Stepper:**
   - Allows users and faculty to step forward (`Next Step`), step backward (`Prev Step`), or `Auto Play` the Banker's safety check.
   - Displays live chips for $\text{Work}$ vector and $\text{Finish}$ array alongside a reasoning card detailing the mathematical justification for selecting each process.

4. **Dynamic Safe Sequence Pipeline:**
   - Visualizes the computed safe sequence as an animated flowchart with connecting arrows:  
     $[P_1] \longrightarrow [P_3] \longrightarrow [P_4] \longrightarrow [P_0] \longrightarrow [P_2]$

5. **OS Audit Log Console:**
   - Real-time terminal-style logging window with timestamped entries color-coded by event type: `[SYSTEM]`, `[INFO]`, `[SAFE]`, `[WARN]`, and `[ERROR]`.
   - Supports clearing logs and exporting current simulation state as JSON.

---

## 5. Verification & Test Case Results

The simulator was verified against standard operating systems benchmark scenarios:

### Test Case 1: Classic Silberschatz Safe State
- **Configuration:** 5 Processes ($P_0 - P_4$), 3 Resources ($A=10, B=5, C=7$).
- **Allocation Matrix:**
  - $P_0$: $[0, 1, 0]$
  - $P_1$: $[2, 0, 0]$
  - $P_2$: $[3, 0, 2]$
  - $P_3$: $[2, 1, 1]$
  - $P_4$: $[0, 0, 2]$
- **Max Matrix:**
  - $P_0$: $[7, 5, 3]$
  - $P_1$: $[3, 2, 2]$
  - $P_2$: $[9, 0, 2]$
  - $P_3$: $[2, 2, 2]$
  - $P_4$: $[4, 3, 3]$
- **Calculated Need:**
  - $P_0: [7, 4, 3]$, $P_1: [1, 2, 2]$, $P_2: [6, 0, 0]$, $P_3: [0, 1, 1]$, $P_4: [4, 3, 1]$
- **Calculated Available:** $[3, 3, 2]$
- **Simulator Output:** **SAFE STATE**  
  **Safe Sequence:** $\langle P_1, P_3, P_4, P_0, P_2 \rangle$  
  **Final Work Vector:** $[10, 5, 7]$ (all resources reclaimed).

### Test Case 2: Valid Resource Request Execution
- **Initial State:** Test Case 1 configuration.
- **Action:** Process $P_1$ requests $\text{Request}_1 = [1, 0, 2]$.
- **Evaluation:**
  - Check 1: $[1, 0, 2] \le \text{Need}_1 [1, 2, 2]$ $\implies$ **True**.
  - Check 2: $[1, 0, 2] \le \text{Available} [3, 3, 2]$ $\implies$ **True**.
  - Tentative Available: $[2, 3, 0]$.
  - Safety check succeeds with valid sequence $\langle P_1, P_3, P_4, P_0, P_2 \rangle$.
- **Simulator Output:** **REQUEST GRANTED**. State updated permanently.

### Test Case 3: Unsafe Request Prevention & Rollback
- **Initial State:** Test Case 1 configuration.
- **Action:** Process $P_4$ requests $\text{Request}_4 = [3, 3, 0]$.
- **Evaluation:**
  - Request exceeds available resource $A$ ($3 \le 3$, but $3 > 3$ for $B$ or leaves system with $[0, 0, 2]$).
  - Tentative safety check finds no process with $\text{Need} \le \text{Work}$.
- **Simulator Output:** **REQUEST DENIED & ROLLED BACK**. System remains in safe state, process $P_4$ set to `Waiting`.

### Test Case 4: Deadlock Detection in Multi-Resource System
- **Configuration:** Resources exhausted ($\text{Available} = [0, 0, 0]$), active processes have circular dependencies.
- **Simulator Output:** **DEADLOCK DETECTED**. Correctly isolates and flags deadlocked processes ($P_1, P_2$).

---

## 6. Comparison: Review 1 Commitments vs. Review 2 Progress

| Component / Feature | Review 1 Commitment | Review 2 Achieved Status |
| :--- | :--- | :--- |
| **Process Management** | Planned process structure | Fully implemented with PCB, states, and dynamic operations |
| **Resource Tracking** | Conceptual matrices | Fully implemented with dynamic Available vector and auto-updating Need |
| **Banker's Algorithm** | Theoretical pseudocode | Fully operational $O(m \times n^2)$ safety algorithm |
| **Safe Sequence Generation** | Expected text output | Interactive visual pipeline + step-by-step playback stepper |
| **Resource Request Handling** | Planned safety check | Two-rule bounds checking + tentative allocation + rollback |
| **Deadlock Detection** | Identified as objective | Implemented for multi-instance resource systems |
| **Dashboard Interface** | Wireframe concept | Complete dark-mode glassmorphic web dashboard |
| **Preloaded Test Scenarios** | Not specified | 4 presets included (Textbook Safe, Unsafe, Deadlock, 4x4) |

---

## 7. Remaining Work for Final Review (Review 3)

With the core resource and deadlock simulator fully operational at Review 2, the team will focus on the following enhancements for the Final Review (Review 3):

1. **CPU Scheduling Simulator Module:**
   - Implementation of CPU scheduling algorithms: FCFS, SJF (Preemptive & Non-preemptive), Round Robin, and Priority Scheduling.
   - Dynamic Gantt Chart generation for visual timeline representation.

2. **Memory Management Extension:**
   - Simulation of Page Replacement Algorithms: FIFO, LRU, and Optimal Page Replacement.

3. **Performance Metrics & Analytics:**
   - Calculation of Average Turnaround Time (TAT) and Average Waiting Time (WT).
   - Comparative charts illustrating algorithm efficiencies.

4. **Project Packaging:**
   - Automated test suite and exportable PDF simulation reports.

---

## 8. Viva Defense & Faculty Q&A Guide

### Q1: Why does Banker's Algorithm require processes to state their Maximum resource demand in advance?
**Answer:** Banker's Algorithm is a **deadlock avoidance** algorithm. Unlike deadlock detection (which checks for deadlocks after they happen), avoidance algorithms need to ensure the system never enters an unsafe state. To mathematically guarantee that at least one process can finish and release its resources, the OS must know the worst-case maximum claim of each process before granting requests.

### Q2: What is the fundamental difference between an Unsafe State and a Deadlocked State?
**Answer:** An unsafe state is **not** necessarily a deadlock; rather, it is a state from which the operating system cannot guarantee that a deadlock will not occur. In an unsafe state, if all processes simultaneously demand their remaining maximum needs, a deadlock is guaranteed. In a deadlocked state, processes are already blocked in a circular wait and cannot make progress.

### Q3: What is the computational complexity of Banker's Algorithm?
**Answer:** For $n$ processes and $m$ resource types:
- Checking if $\text{Need}[i] \le \text{Work}$ takes $O(m)$ operations per process.
- In the worst case, we search through $n$ processes in the first iteration, $n-1$ in the second, etc.
- Thus, total time complexity is **$O(m \times n^2)$**. Space complexity is $O(m \times n)$ for matrices and $O(m + n)$ for temporary vectors.

### Q4: How does the system handle resource requests that result in an unsafe state?
**Answer:** The simulator performs a **tentative allocation** by decrementing $\text{Available}$ and $\text{Need}$, and incrementing $\text{Allocation}$. It then runs the Safety Algorithm on this speculative state. If the resulting state is unsafe, the allocation is immediately rolled back to its previous state, and the requesting process is transitioned to the `Waiting` state.

---

**Report Prepared By:**  
- Yash Gupta (24BCE0759)  
- Shaunak Dutta (24BCE2058)  
- Sapandeep Kour (24BCE0960)  

**Date:** March 2025 / Review 2 Evaluation  
**Submitted to:** Prof. Sujitra J, SCOPE, VIT
