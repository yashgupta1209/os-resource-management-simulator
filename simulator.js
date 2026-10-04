/**
 * OS RESOURCE & PROCESS MANAGEMENT SIMULATOR
 * Core Logic & Interactive Controller
 *
 * Module 1: Process & Resource Management (Yash Gupta - 24BCE0759)
 * Module 2: Deadlock & Algorithm Suite (Shaunak Dutta - 24BCE2058)
 * Module 3: Frontend & Visualization (Sapandeep Kour - 24BCE0960)
 */

(function () {
  'use strict';

  // --- STATE DEFINITIONS ---
  const state = {
    resources: [
      { name: 'A', total: 10, available: 3 },
      { name: 'B', total: 5,  available: 3 },
      { name: 'C', total: 7,  available: 2 }
    ],
    processes: [
      { id: 0, name: 'P0', state: 'Ready', allocation: [0, 1, 0], max: [7, 5, 3], need: [7, 4, 3] },
      { id: 1, name: 'P1', state: 'Ready', allocation: [2, 0, 0], max: [3, 2, 2], need: [1, 2, 2] },
      { id: 2, name: 'P2', state: 'Ready', allocation: [3, 0, 2], max: [9, 0, 2], need: [6, 0, 0] },
      { id: 3, name: 'P3', state: 'Ready', allocation: [2, 1, 1], max: [2, 2, 2], need: [0, 1, 1] },
      { id: 4, name: 'P4', state: 'Ready', allocation: [0, 0, 2], max: [4, 3, 3], need: [4, 3, 1] }
    ],
    simulationSteps: [],
    currentStepIndex: -1,
    autoPlayTimer: null,
    lastSafetyResult: null
  };

  // --- PRESETS ---
  const PRESETS = {
    'silberschatz': {
      name: "Silberschatz Classic Safe State",
      resources: [
        { name: 'A', total: 10, available: 3 },
        { name: 'B', total: 5,  available: 3 },
        { name: 'C', total: 7,  available: 2 }
      ],
      processes: [
        { id: 0, name: 'P0', state: 'Ready', allocation: [0, 1, 0], max: [7, 5, 3] },
        { id: 1, name: 'P1', state: 'Ready', allocation: [2, 0, 0], max: [3, 2, 2] },
        { id: 2, name: 'P2', state: 'Ready', allocation: [3, 0, 2], max: [9, 0, 2] },
        { id: 3, name: 'P3', state: 'Ready', allocation: [2, 1, 1], max: [2, 2, 2] },
        { id: 4, name: 'P4', state: 'Ready', allocation: [0, 0, 2], max: [4, 3, 3] }
      ]
    },
    'unsafe-demo': {
      name: "Unsafe State Scenario (Deadlock Potential)",
      resources: [
        { name: 'A', total: 10, available: 1 },
        { name: 'B', total: 5,  available: 0 },
        { name: 'C', total: 7,  available: 1 }
      ],
      processes: [
        { id: 0, name: 'P0', state: 'Waiting', allocation: [1, 2, 2], max: [8, 5, 4] },
        { id: 1, name: 'P1', state: 'Waiting', allocation: [3, 1, 1], max: [6, 2, 3] },
        { id: 2, name: 'P2', state: 'Waiting', allocation: [3, 1, 2], max: [7, 3, 3] },
        { id: 3, name: 'P3', state: 'Waiting', allocation: [2, 1, 1], max: [5, 4, 3] }
      ]
    },
    'deadlock-multi': {
      name: "Deadlock Detected (Multi-Instance Cyclic Wait)",
      resources: [
        { name: 'A', total: 7, available: 0 },
        { name: 'B', total: 2, available: 0 },
        { name: 'C', total: 6, available: 0 }
      ],
      processes: [
        { id: 0, name: 'P0', state: 'Deadlocked', allocation: [0, 1, 0], max: [0, 1, 0] },
        { id: 1, name: 'P1', state: 'Deadlocked', allocation: [2, 0, 0], max: [4, 0, 2] },
        { id: 2, name: 'P2', state: 'Deadlocked', allocation: [3, 0, 3], max: [3, 1, 3] },
        { id: 3, name: 'P3', state: 'Deadlocked', allocation: [2, 1, 1], max: [2, 1, 2] },
        { id: 4, name: 'P4', state: 'Deadlocked', allocation: [0, 0, 2], max: [0, 0, 4] }
      ]
    },
    'complex-4x4': {
      name: "4 Processes × 4 Resources (CPU, RAM, Disk, Net)",
      resources: [
        { name: 'CPU',  total: 6, available: 2 },
        { name: 'RAM',  total: 5, available: 1 },
        { name: 'Disk', total: 7, available: 2 },
        { name: 'Net',  total: 6, available: 2 }
      ],
      processes: [
        { id: 0, name: 'P0', state: 'Ready', allocation: [1, 1, 2, 1], max: [2, 2, 4, 2] },
        { id: 1, name: 'P1', state: 'Ready', allocation: [1, 0, 1, 1], max: [2, 1, 2, 2] },
        { id: 2, name: 'P2', state: 'Ready', allocation: [1, 2, 1, 0], max: [3, 2, 3, 1] },
        { id: 3, name: 'P3', state: 'Ready', allocation: [1, 1, 1, 2], max: [1, 2, 2, 3] }
      ]
    },
    'custom': {
      name: "Clean Custom Configuration",
      resources: [
        { name: 'A', total: 5, available: 5 },
        { name: 'B', total: 5, available: 5 },
        { name: 'C', total: 5, available: 5 }
      ],
      processes: [
        { id: 0, name: 'P0', state: 'Ready', allocation: [0, 0, 0], max: [2, 2, 2] },
        { id: 1, name: 'P1', state: 'Ready', allocation: [0, 0, 0], max: [2, 2, 2] }
      ]
    }
  };

  // ==========================================================================
  // MODULE 1: PROCESS & RESOURCE MANAGEMENT (Yash Gupta)
  // ==========================================================================

  /**
   * Recalculates remaining Need for all processes: Need[i][j] = Max[i][j] - Alloc[i][j]
   * And recalculates Available vector: Available[j] = Total[j] - Sum(Alloc[i][j])
   */
  function syncMatricesAndAvailability() {
    const m = state.resources.length;
    const n = state.processes.length;

    // 1. Recalculate Need for each process
    state.processes.forEach(p => {
      p.need = [];
      for (let j = 0; j < m; j++) {
        const allocVal = Number(p.allocation[j] || 0);
        const maxVal = Number(p.max[j] || 0);
        p.need[j] = Math.max(0, maxVal - allocVal);
      }
    });

    // 2. Recalculate Available resources
    for (let j = 0; j < m; j++) {
      let allocatedTotal = 0;
      for (let i = 0; i < n; i++) {
        allocatedTotal += Number(state.processes[i].allocation[j] || 0);
      }
      state.resources[j].available = Math.max(0, state.resources[j].total - allocatedTotal);
    }
  }

  /**
   * Add a new process with default or custom vectors
   */
  function addProcess(name, maxVector, allocVector) {
    const newId = state.processes.length > 0 
      ? Math.max(...state.processes.map(p => p.id)) + 1 
      : 0;
    const procName = name && name.trim() ? name.trim() : `P${newId}`;
    const m = state.resources.length;

    const alloc = [];
    const max = [];
    for (let j = 0; j < m; j++) {
      alloc.push(allocVector && allocVector[j] !== undefined ? Number(allocVector[j]) : 0);
      max.push(maxVector && maxVector[j] !== undefined ? Number(maxVector[j]) : (alloc[j] + 1));
    }

    state.processes.push({
      id: newId,
      name: procName,
      state: 'Ready',
      allocation: alloc,
      max: max,
      need: []
    });

    syncMatricesAndAvailability();
    logMessage('INFO', `Process ${procName} added to system with Max=[${max.join(', ')}]`);
    renderAll();
    runSafetyCheck(false);
  }

  /**
   * Delete a process and free up its allocated resources
   */
  function deleteProcess(id) {
    const idx = state.processes.findIndex(p => p.id === id);
    if (idx !== -1) {
      const p = state.processes[idx];
      logMessage('WARN', `Process ${p.name} deleted. Released allocation [${p.allocation.join(', ')}].`);
      state.processes.splice(idx, 1);
      syncMatricesAndAvailability();
      renderAll();
      runSafetyCheck(false);
    }
  }

  /**
   * Add a new resource type (e.g. R3 or D)
   */
  function addResource(name, totalInstances) {
    const resName = name && name.trim() ? name.trim().toUpperCase() : `R${state.resources.length}`;
    const total = Number(totalInstances) || 5;

    state.resources.push({
      name: resName,
      total: total,
      available: total
    });

    // Update all existing processes to add 0 allocation and 1 max for this resource
    state.processes.forEach(p => {
      p.allocation.push(0);
      p.max.push(1);
    });

    syncMatricesAndAvailability();
    logMessage('INFO', `Resource type '${resName}' added with ${total} instances.`);
    renderAll();
    runSafetyCheck(false);
  }

  // ==========================================================================
  // MODULE 2: DEADLOCK & ALGORITHM MODULE (Shaunak Dutta)
  // ==========================================================================

  /**
   * Banker's Safety Algorithm
   * Computes whether the system is in a SAFE state and records step-by-step
   * execution trace for visual stepper.
   */
  function runBankersSafetyAlgorithm() {
    syncMatricesAndAvailability();
    const n = state.processes.length;
    const m = state.resources.length;

    const work = state.resources.map(r => r.available);
    const finish = new Array(n).fill(false);
    const safeSequence = [];
    const steps = [];

    // Step 0: Initialization
    steps.push({
      type: 'INIT',
      title: "Step 0: Algorithm Initialization",
      work: [...work],
      finish: [...finish],
      processId: null,
      description: `Initialized Work vector = Available [${work.join(', ')}]. Finish array set to all FALSE.`
    });

    let count = 0;
    while (count < n) {
      let found = false;

      for (let i = 0; i < n; i++) {
        if (!finish[i]) {
          const p = state.processes[i];
          let canAllocate = true;

          // Check if Need[i][j] <= Work[j] for all j
          for (let j = 0; j < m; j++) {
            if (p.need[j] > work[j]) {
              canAllocate = false;
              break;
            }
          }

          if (canAllocate) {
            // Record step: Process Pi is selected
            const workBefore = [...work];
            for (let j = 0; j < m; j++) {
              work[j] += p.allocation[j];
            }
            finish[i] = true;
            safeSequence.push(p.name);
            count++;
            found = true;

            steps.push({
              type: 'ALLOCATE',
              title: `Step ${count}: Process ${p.name} can complete`,
              work: [...work],
              finish: [...finish],
              processId: p.id,
              description: `Need of ${p.name} [${p.need.join(', ')}] ≤ Work [${workBefore.join(', ')}]. Process finishes, releases its allocation [${p.allocation.join(', ')}]. New Work = [${work.join(', ')}].`
            });

            break; // Restart loop to check from beginning
          }
        }
      }

      // If no process could be safely allocated in this pass, break (Unsafe State)
      if (!found) {
        break;
      }
    }

    const isSafe = (count === n);
    const deadlockedIds = [];
    if (!isSafe) {
      finish.forEach((f, idx) => {
        if (!f) deadlockedIds.push(state.processes[idx].id);
      });

      steps.push({
        type: 'UNSAFE',
        title: "Deadlock Potential: Unsafe State",
        work: [...work],
        finish: [...finish],
        processId: null,
        description: `No remaining process has Need ≤ Work. Processes remaining unfinished: ${deadlockedIds.map(id => state.processes.find(p => p.id === id).name).join(', ')}.`
      });
    } else {
      steps.push({
        type: 'FINISH',
        title: "Safety Evaluation Complete",
        work: [...work],
        finish: [...finish],
        processId: null,
        description: `Safe State confirmed! Valid safe execution sequence: <${safeSequence.join(', ')}>. System is guaranteed deadlock-free.`
      });
    }

    return {
      isSafe,
      safeSequence,
      steps,
      deadlockedIds,
      finalWork: work
    };
  }

  /**
   * Banker's Resource-Request Algorithm
   * Evaluates if a request from process Pi can be safely granted.
   */
  function simulateResourceRequest(processId, requestVector) {
    syncMatricesAndAvailability();
    const pIdx = state.processes.findIndex(p => p.id === processId);
    if (pIdx === -1) return { success: false, reason: "Process not found" };

    const p = state.processes[pIdx];
    const m = state.resources.length;

    logMessage('REQUEST', `Process ${p.name} requested resources: [${requestVector.join(', ')}]`);

    // Rule 1: Request[j] <= Need[i][j]
    for (let j = 0; j < m; j++) {
      if (requestVector[j] > p.need[j]) {
        const msg = `Error: Process ${p.name} requested ${requestVector[j]} of ${state.resources[j].name}, which exceeds its remaining Need (${p.need[j]}). Request denied!`;
        logMessage('ERROR', msg);
        return { success: false, reason: msg, rule: 1 };
      }
    }

    // Rule 2: Request[j] <= Available[j]
    for (let j = 0; j < m; j++) {
      if (requestVector[j] > state.resources[j].available) {
        const msg = `Wait: Process ${p.name} requested ${requestVector[j]} of ${state.resources[j].name}, but only ${state.resources[j].available} is Available. Process must wait!`;
        logMessage('WARN', msg);
        p.state = 'Waiting';
        renderAll();
        return { success: false, reason: msg, rule: 2, waiting: true };
      }
    }

    // Step 3: Tentatively allocate resources
    for (let j = 0; j < m; j++) {
      state.resources[j].available -= requestVector[j];
      p.allocation[j] += requestVector[j];
      p.need[j] -= requestVector[j];
    }

    // Step 4: Run safety algorithm on tentative state
    const safetyCheck = runBankersSafetyAlgorithm();

    if (safetyCheck.isSafe) {
      // Permanent Grant
      p.state = 'Running';
      const msg = `Request GRANTED! Tentative allocation keeps system in a SAFE state. New safe sequence: <${safetyCheck.safeSequence.join(', ')}>`;
      logMessage('SAFE', msg);
      renderAll();
      runSafetyCheck(true);
      return { success: true, reason: msg, safeSequence: safetyCheck.safeSequence };
    } else {
      // Rollback allocation
      for (let j = 0; j < m; j++) {
        state.resources[j].available += requestVector[j];
        p.allocation[j] -= requestVector[j];
        p.need[j] += requestVector[j];
      }
      p.state = 'Waiting';
      const msg = `Request DENIED & ROLLED BACK! Granting this request leads to an UNSAFE state with potential deadlock. Process ${p.name} must wait.`;
      logMessage('ERROR', msg);
      renderAll();
      runSafetyCheck(false);
      return { success: false, reason: msg, rule: 4, rollback: true };
    }
  }

  /**
   * Multi-Instance Deadlock Detection Algorithm
   * Detects whether existing processes with unsatisfied needs are deadlocked.
   */
  function detectDeadlockMulti() {
    syncMatricesAndAvailability();
    const n = state.processes.length;
    const m = state.resources.length;

    const work = state.resources.map(r => r.available);
    const finish = new Array(n).fill(false);

    // Initialize Finish: If allocation is 0, finish is true
    for (let i = 0; i < n; i++) {
      let hasAlloc = false;
      for (let j = 0; j < m; j++) {
        if (state.processes[i].allocation[j] > 0) {
          hasAlloc = true;
          break;
        }
      }
      finish[i] = !hasAlloc;
    }

    let found = true;
    while (found) {
      found = false;
      for (let i = 0; i < n; i++) {
        if (!finish[i]) {
          const p = state.processes[i];
          let canSatisfy = true;
          for (let j = 0; j < m; j++) {
            if (p.need[j] > work[j]) {
              canSatisfy = false;
              break;
            }
          }

          if (canSatisfy) {
            for (let j = 0; j < m; j++) {
              work[j] += p.allocation[j];
            }
            finish[i] = true;
            found = true;
          }
        }
      }
    }

    const deadlockedProcesses = [];
    finish.forEach((f, idx) => {
      if (!f) {
        deadlockedProcesses.push(state.processes[idx]);
        state.processes[idx].state = 'Deadlocked';
      } else {
        if (state.processes[idx].state === 'Deadlocked') {
          state.processes[idx].state = 'Ready';
        }
      }
    });

    return {
      isDeadlocked: deadlockedProcesses.length > 0,
      deadlockedProcesses: deadlockedProcesses
    };
  }

  // ==========================================================================
  // MODULE 3: FRONTEND & VISUALIZATION (Sapandeep Kour)
  // ==========================================================================

  function renderAll() {
    renderResourceChips();
    renderMatrixTable();
    renderMetrics();
    populateSelectDropdowns();
  }

  /**
   * Render System Resource Availability Chips
   */
  function renderResourceChips() {
    const container = document.getElementById('resourceChipsContainer');
    if (!container) return;

    container.innerHTML = state.resources.map((res, j) => {
      let totalAlloc = 0;
      state.processes.forEach(p => {
        totalAlloc += Number(p.allocation[j] || 0);
      });
      return `
        <div class="resource-chip">
          <span class="res-name">${res.name}</span>
          <span class="res-stat">Total: <strong>${res.total}</strong></span>
          <span class="res-stat">Allocated: <strong>${totalAlloc}</strong></span>
          <span class="res-stat">Available: <span class="res-avail-highlight">${res.available}</span></span>
        </div>
      `;
    }).join('');
  }

  /**
   * Render the main matrix table with editable input cells
   */
  function renderMatrixTable() {
    const subHeaderRow = document.getElementById('subHeaderRow');
    const tableBody = document.getElementById('matrixTableBody');
    const thAllocCol = document.getElementById('thAllocCol');
    const thMaxCol = document.getElementById('thMaxCol');
    const thNeedCol = document.getElementById('thNeedCol');

    const m = state.resources.length;
    if (thAllocCol) thAllocCol.colSpan = m;
    if (thMaxCol) thMaxCol.colSpan = m;
    if (thNeedCol) thNeedCol.colSpan = m;

    // Subheaders: A, B, C for each block
    if (subHeaderRow) {
      let subHeadersHtml = '';
      // 3 blocks: Allocation, Max, Need
      for (let block = 0; block < 3; block++) {
        for (let j = 0; j < m; j++) {
          subHeadersHtml += `<th>${state.resources[j].name}</th>`;
        }
      }
      subHeaderRow.innerHTML = subHeadersHtml;
    }

    if (!tableBody) return;

    tableBody.innerHTML = state.processes.map((p, i) => {
      let allocCells = '';
      for (let j = 0; j < m; j++) {
        allocCells += `
          <td>
            <input type="number" min="0" max="${state.resources[j].total}" 
                   class="cell-input" data-pid="${p.id}" data-type="alloc" data-res="${j}" 
                   value="${p.allocation[j] || 0}">
          </td>
        `;
      }

      let maxCells = '';
      for (let j = 0; j < m; j++) {
        maxCells += `
          <td>
            <input type="number" min="0" max="${state.resources[j].total}" 
                   class="cell-input" data-pid="${p.id}" data-type="max" data-res="${j}" 
                   value="${p.max[j] || 0}">
          </td>
        `;
      }

      let needCells = '';
      for (let j = 0; j < m; j++) {
        const needVal = p.need[j] !== undefined ? p.need[j] : Math.max(0, (p.max[j] || 0) - (p.allocation[j] || 0));
        needCells += `<td><span class="need-val">${needVal}</span></td>`;
      }

      const stateClass = `pstate-${p.state.toLowerCase()}`;

      return `
        <tr id="row-proc-${p.id}" data-pid="${p.id}">
          <td class="pid-cell">${p.name}</td>
          <td><span class="pstate-badge ${stateClass}">${p.state}</span></td>
          ${allocCells}
          ${maxCells}
          ${needCells}
          <td>
            <div class="action-btn-group">
              <button class="btn btn-xs btn-outline btn-quick-req" data-pid="${p.id}" title="Request Resources">Req</button>
              <button class="btn btn-xs btn-outline btn-quick-rel" data-pid="${p.id}" title="Release All Resources">Rel</button>
              <button class="btn btn-xs btn-danger btn-quick-del" data-pid="${p.id}" title="Terminate / Delete">&times;</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Attach inline edit handlers
    tableBody.querySelectorAll('.cell-input').forEach(input => {
      input.addEventListener('change', handleMatrixCellEdit);
    });

    tableBody.querySelectorAll('.btn-quick-req').forEach(btn => {
      btn.addEventListener('click', () => openRequestModalFor(Number(btn.dataset.pid)));
    });

    tableBody.querySelectorAll('.btn-quick-rel').forEach(btn => {
      btn.addEventListener('click', () => releaseProcessResources(Number(btn.dataset.pid)));
    });

    tableBody.querySelectorAll('.btn-quick-del').forEach(btn => {
      btn.addEventListener('click', () => deleteProcess(Number(btn.dataset.pid)));
    });
  }

  function handleMatrixCellEdit(e) {
    const pid = Number(e.target.dataset.pid);
    const type = e.target.dataset.type;
    const resIdx = Number(e.target.dataset.res);
    const newVal = Math.max(0, Number(e.target.value) || 0);

    const proc = state.processes.find(p => p.id === pid);
    if (!proc) return;

    if (type === 'alloc') {
      proc.allocation[resIdx] = newVal;
      // Ensure max is at least alloc
      if (proc.max[resIdx] < newVal) {
        proc.max[resIdx] = newVal;
      }
    } else if (type === 'max') {
      proc.max[resIdx] = newVal;
      // Ensure alloc does not exceed max
      if (proc.allocation[resIdx] > newVal) {
        proc.allocation[resIdx] = newVal;
      }
    }

    syncMatricesAndAvailability();
    logMessage('INFO', `Updated ${proc.name} ${type} for resource ${state.resources[resIdx].name} to ${newVal}`);
    renderAll();
    runSafetyCheck(false);
  }

  function releaseProcessResources(pid) {
    const proc = state.processes.find(p => p.id === pid);
    if (!proc) return;
    const released = [...proc.allocation];
    proc.allocation = proc.allocation.map(() => 0);
    proc.state = 'Finished';
    syncMatricesAndAvailability();
    logMessage('INFO', `Process ${proc.name} released all allocated resources [${released.join(', ')}]. Status changed to Finished.`);
    renderAll();
    runSafetyCheck(false);
  }

  /**
   * Render Top Metrics and Available Vector
   */
  function renderMetrics() {
    const pCountEl = document.getElementById('metricProcessCount');
    const rCountEl = document.getElementById('metricResourceCount');
    const availVecEl = document.getElementById('metricAvailableVector');

    if (pCountEl) pCountEl.textContent = state.processes.length;
    if (rCountEl) rCountEl.textContent = state.resources.length;
    if (availVecEl) {
      const availVals = state.resources.map(r => r.available);
      availVecEl.textContent = `[ ${availVals.join(', ')} ]`;
    }
  }

  /**
   * Populate dropdowns for request dialogs and forms
   */
  function populateSelectDropdowns() {
    const inlineSelect = document.getElementById('reqProcessSelect');
    const modalSelect = document.getElementById('modalReqProcess');
    const optionsHtml = state.processes.map(p => `<option value="${p.id}">${p.name} (${p.state})</option>`).join('');

    if (inlineSelect) {
      inlineSelect.innerHTML = optionsHtml;
      renderInlineRequestInputs();
    }
    if (modalSelect) modalSelect.innerHTML = optionsHtml;
  }

  function renderInlineRequestInputs() {
    const container = document.getElementById('requestInputsContainer');
    if (!container) return;
    container.innerHTML = state.resources.map((r, j) => `
      <div class="vector-input-item">
        <label for="req-in-${j}" class="code-font">${r.name}:</label>
        <input type="number" id="req-in-${j}" class="cell-input inline-req-cell" data-res="${j}" min="0" value="0">
      </div>
    `).join('');
  }

  /**
   * Execute Safety Check and update the UI accordingly
   */
  function runSafetyCheck(showStepVisualizer = false) {
    const result = runBankersSafetyAlgorithm();
    state.lastSafetyResult = result;
    state.simulationSteps = result.steps;
    state.currentStepIndex = -1;

    // Update Status Banner
    const card = document.getElementById('systemStatusCard');
    const badge = document.getElementById('safetyBadge');
    const msg = document.getElementById('statusMessage');
    const sub = document.getElementById('statusSubtext');
    const pipeline = document.getElementById('sequencePipeline');

    if (card) {
      card.className = `status-card ${result.isSafe ? 'safe' : 'unsafe'}`;
    }

    if (badge) {
      badge.className = `badge ${result.isSafe ? 'badge-safe' : 'badge-unsafe'}`;
      badge.textContent = result.isSafe ? 'SAFE STATE' : 'UNSAFE STATE';
    }

    if (msg) {
      msg.textContent = result.isSafe ? 'System is currently in a Safe State' : 'Unsafe State Detected!';
    }

    if (sub) {
      sub.textContent = result.isSafe 
        ? 'A valid execution sequence exists guaranteeing deadlock freedom.'
        : `No safe sequence found. High risk of deadlock if processes request maximum claims.`;
    }

    // Render Safe Sequence Pipeline
    if (pipeline) {
      if (result.isSafe && result.safeSequence.length > 0) {
        pipeline.innerHTML = result.safeSequence.map((pName, idx) => `
          <div class="pipeline-node">
            <span>${pName}</span>
          </div>
          ${idx < result.safeSequence.length - 1 ? '<span class="pipeline-arrow">➔</span>' : ''}
        `).join('');
      } else {
        pipeline.innerHTML = `<span class="pipeline-node" style="background: rgba(239, 68, 68, 0.2); color:#fca5a5; border-color: rgba(239, 68, 68, 0.4);">No Safe Sequence Exists (Deadlock Hazard)</span>`;
      }
    }

    // Setup Stepper Panel
    setupStepperControls();

    if (showStepVisualizer) {
      stepTo(0);
    }

    return result;
  }

  // ==========================================================================
  // STEP-BY-STEP VISUALIZER LOGIC
  // ==========================================================================

  function setupStepperControls() {
    const prevBtn = document.getElementById('stepPrevBtn');
    const nextBtn = document.getElementById('stepNextBtn');
    const autoBtn = document.getElementById('stepAutoBtn');
    const resetBtn = document.getElementById('stepResetBtn');
    const stepText = document.getElementById('currentStepText');

    const total = state.simulationSteps.length;
    if (total > 0) {
      if (nextBtn) nextBtn.disabled = false;
      if (autoBtn) autoBtn.disabled = false;
      if (resetBtn) resetBtn.disabled = false;
    }

    if (stepText) {
      stepText.textContent = total > 0 ? `Ready (Total ${total} steps)` : `0 of 0`;
    }
  }

  function stepTo(index) {
    if (!state.simulationSteps || state.simulationSteps.length === 0) return;
    if (index < 0) index = 0;
    if (index >= state.simulationSteps.length) index = state.simulationSteps.length - 1;

    state.currentStepIndex = index;
    const step = state.simulationSteps[index];

    // Update Step Indicator
    const stepText = document.getElementById('currentStepText');
    if (stepText) {
      stepText.textContent = `Step ${index + 1} of ${state.simulationSteps.length}`;
    }

    // Update Work Vector
    const workDisplay = document.getElementById('workVectorDisplay');
    if (workDisplay) {
      workDisplay.textContent = `[ ${step.work.join(', ')} ]`;
    }

    // Update Finish Status Array
    const finishDisplay = document.getElementById('finishArrayDisplay');
    if (finishDisplay) {
      finishDisplay.innerHTML = step.finish.map((f, i) => {
        const pName = state.processes[i] ? state.processes[i].name : `P${i}`;
        return `<span class="finish-chip ${f ? 'done' : ''}">${pName}: ${f ? 'TRUE' : 'FALSE'}</span>`;
      }).join('');
    }

    // Update Step Explanation
    const stepTitle = document.getElementById('stepTitle');
    const stepDesc = document.getElementById('stepDescription');
    if (stepTitle) stepTitle.textContent = step.title;
    if (stepDesc) stepDesc.textContent = step.description;

    // Highlight row in table
    document.querySelectorAll('.matrix-table tbody tr').forEach(tr => {
      tr.classList.remove('active-eval');
    });

    if (step.processId !== null) {
      const activeRow = document.getElementById(`row-proc-${step.processId}`);
      if (activeRow) activeRow.classList.add('active-eval');
    }

    // Update Stepper Button States
    const prevBtn = document.getElementById('stepPrevBtn');
    const nextBtn = document.getElementById('stepNextBtn');
    if (prevBtn) prevBtn.disabled = (index <= 0);
    if (nextBtn) nextBtn.disabled = (index >= state.simulationSteps.length - 1);
  }

  function stepNext() {
    if (state.currentStepIndex < state.simulationSteps.length - 1) {
      stepTo(state.currentStepIndex + 1);
    } else {
      stopAutoPlay();
    }
  }

  function stepPrev() {
    if (state.currentStepIndex > 0) {
      stepTo(state.currentStepIndex - 1);
    }
  }

  function toggleAutoPlay() {
    const autoBtn = document.getElementById('stepAutoBtn');
    if (state.autoPlayTimer) {
      stopAutoPlay();
    } else {
      if (state.currentStepIndex >= state.simulationSteps.length - 1) {
        stepTo(0);
      }
      if (autoBtn) autoBtn.textContent = 'Pause ⏸️';
      state.autoPlayTimer = setInterval(() => {
        if (state.currentStepIndex < state.simulationSteps.length - 1) {
          stepNext();
        } else {
          stopAutoPlay();
        }
      }, 1200);
    }
  }

  function stopAutoPlay() {
    if (state.autoPlayTimer) {
      clearInterval(state.autoPlayTimer);
      state.autoPlayTimer = null;
      const autoBtn = document.getElementById('stepAutoBtn');
      if (autoBtn) autoBtn.textContent = 'Auto Play ⏩';
    }
  }

  // ==========================================================================
  // LOGGING CONSOLE & UTILITIES
  // ==========================================================================

  function logMessage(level, text) {
    const consoleBody = document.getElementById('consoleBody');
    if (!consoleBody) return;

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    const entry = document.createElement('div');
    let colorClass = 'log-info';
    if (level === 'SAFE') colorClass = 'log-safe';
    else if (level === 'WARN') colorClass = 'log-warn';
    else if (level === 'ERROR') colorClass = 'log-error';
    else if (level === 'REQUEST') colorClass = 'log-step';

    entry.className = `log-entry ${colorClass}`;
    entry.innerHTML = `<span class="log-time">[${timeStr}]</span> [${level}] ${text}`;
    consoleBody.appendChild(entry);
    consoleBody.scrollTop = consoleBody.scrollHeight;
  }

  function loadPreset(key) {
    const preset = PRESETS[key];
    if (!preset) return;

    stopAutoPlay();
    state.resources = JSON.parse(JSON.stringify(preset.resources));
    state.processes = JSON.parse(JSON.stringify(preset.processes));

    syncMatricesAndAvailability();
    logMessage('INFO', `Loaded Preset: "${preset.name}".`);
    renderAll();
    runSafetyCheck(false);

    // Update active preset button style
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.preset === key);
    });
  }

  // Modal helpers
  function openRequestModalFor(pid) {
    const modal = document.getElementById('requestModal');
    const select = document.getElementById('modalReqProcess');
    const inputsContainer = document.getElementById('modalVectorInputs');
    const statusBox = document.getElementById('modalStatusBox');

    if (!modal) return;
    if (select) select.value = pid;
    if (statusBox) statusBox.style.display = 'none';

    if (inputsContainer) {
      inputsContainer.innerHTML = state.resources.map((r, j) => `
        <div class="vector-input-item">
          <label class="code-font">${r.name}:</label>
          <input type="number" min="0" class="cell-input modal-req-input" data-res="${j}" value="0">
        </div>
      `).join('');
    }

    modal.showModal();
  }

  // ==========================================================================
  // EVENT LISTENERS INITIALIZATION
  // ==========================================================================

  function initEventListeners() {
    // Preset buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => loadPreset(btn.dataset.preset));
    });

    // Run Safety Check Button
    const runSafetyBtn = document.getElementById('runSafetyBtn');
    if (runSafetyBtn) {
      runSafetyBtn.addEventListener('click', () => {
        logMessage('INFO', "Initiating Banker's Safety Algorithm analysis...");
        runSafetyCheck(true);
      });
    }

    // Step-by-Step Button
    const stepByStepBtn = document.getElementById('stepByStepBtn');
    if (stepByStepBtn) {
      stepByStepBtn.addEventListener('click', () => {
        runSafetyCheck(true);
      });
    }

    // Stepper Controls
    const prevBtn = document.getElementById('stepPrevBtn');
    const nextBtn = document.getElementById('stepNextBtn');
    const autoBtn = document.getElementById('stepAutoBtn');
    const resetBtn = document.getElementById('stepResetBtn');

    if (prevBtn) prevBtn.addEventListener('click', stepPrev);
    if (nextBtn) nextBtn.addEventListener('click', stepNext);
    if (autoBtn) autoBtn.addEventListener('click', toggleAutoPlay);
    if (resetBtn) resetBtn.addEventListener('click', () => { stopAutoPlay(); stepTo(0); });

    // Inline Request Button
    const execReqBtn = document.getElementById('executeRequestBtn');
    if (execReqBtn) {
      execReqBtn.addEventListener('click', () => {
        const sel = document.getElementById('reqProcessSelect');
        const pid = Number(sel.value);
        const reqVector = [];
        document.querySelectorAll('.inline-req-cell').forEach(inp => {
          reqVector.push(Number(inp.value) || 0);
        });

        const res = simulateResourceRequest(pid, reqVector);
        const banner = document.getElementById('requestResultBanner');
        if (banner) {
          banner.style.display = 'block';
          banner.className = `request-result-banner ${res.success ? 'badge-safe' : 'badge-unsafe'}`;
          banner.textContent = res.reason;
        }
      });
    }

    // Deadlock Detection Button
    const detectDeadlockBtn = document.getElementById('detectDeadlockBtn');
    if (detectDeadlockBtn) {
      detectDeadlockBtn.addEventListener('click', () => {
        logMessage('INFO', 'Running Multi-Instance Deadlock Detection Algorithm...');
        const dl = detectDeadlockMulti();
        const dlBox = document.getElementById('deadlockResultBox');
        const dlText = document.getElementById('deadlockResultText');

        renderAll();

        if (dl.isDeadlocked) {
          const names = dl.deadlockedProcesses.map(p => p.name).join(', ');
          logMessage('ERROR', `DEADLOCK DETECTED! Processes involved: ${names}`);
          if (dlText) dlText.innerHTML = `<strong class="color-deadlock">DEADLOCK DETECTED!</strong><br>Processes in cyclic wait/blocked: <strong>${names}</strong>. None of these processes can proceed with available resources.`;
        } else {
          logMessage('SAFE', 'Deadlock Detection Complete: No deadlocked processes found.');
          if (dlText) dlText.innerHTML = `<strong class="color-safe">NO DEADLOCK FOUND.</strong><br>All processes can finish without deadlock in the current allocation configuration.`;
        }
      });
    }

    // Modal Request Triggers
    const reqModalBtn = document.getElementById('requestModalBtn');
    const reqModal = document.getElementById('requestModal');
    const closeReqModal = document.getElementById('closeReqModal');
    const cancelReqModal = document.getElementById('cancelReqModal');
    const confirmReqModal = document.getElementById('confirmReqModal');

    if (reqModalBtn && reqModal) {
      reqModalBtn.addEventListener('click', () => {
        openRequestModalFor(state.processes[0] ? state.processes[0].id : 0);
      });
    }
    if (closeReqModal && reqModal) closeReqModal.addEventListener('click', () => reqModal.close());
    if (cancelReqModal && reqModal) cancelReqModal.addEventListener('click', () => reqModal.close());

    if (confirmReqModal && reqModal) {
      confirmReqModal.addEventListener('click', () => {
        const sel = document.getElementById('modalReqProcess');
        const pid = Number(sel.value);
        const reqVector = [];
        document.querySelectorAll('.modal-req-input').forEach(inp => {
          reqVector.push(Number(inp.value) || 0);
        });

        const res = simulateResourceRequest(pid, reqVector);
        const statusBox = document.getElementById('modalStatusBox');
        if (statusBox) {
          statusBox.style.display = 'block';
          statusBox.className = `modal-status-box ${res.success ? 'badge-safe' : 'badge-unsafe'}`;
          statusBox.innerHTML = `<strong>${res.success ? 'SUCCESS (Safe)' : 'DENIED / WAITING'}:</strong> ${res.reason}`;
        }
      });
    }

    // Modal Add Process
    const addProcBtn = document.getElementById('addProcessBtn');
    const addProcModal = document.getElementById('addProcessModal');
    const closeAddProc = document.getElementById('closeAddProcModal');
    const cancelAddProc = document.getElementById('cancelAddProcModal');
    const confirmAddProc = document.getElementById('confirmAddProcModal');

    if (addProcBtn && addProcModal) {
      addProcBtn.addEventListener('click', () => {
        const maxCont = document.getElementById('newProcMaxInputs');
        const allocCont = document.getElementById('newProcAllocInputs');
        const nextIdx = state.processes.length;
        document.getElementById('newProcName').value = `P${nextIdx}`;

        if (maxCont) {
          maxCont.innerHTML = state.resources.map((r, j) => `
            <div class="vector-input-item">
              <label class="code-font">${r.name}:</label>
              <input type="number" min="0" class="cell-input new-proc-max-cell" data-res="${j}" value="3">
            </div>
          `).join('');
        }
        if (allocCont) {
          allocCont.innerHTML = state.resources.map((r, j) => `
            <div class="vector-input-item">
              <label class="code-font">${r.name}:</label>
              <input type="number" min="0" class="cell-input new-proc-alloc-cell" data-res="${j}" value="0">
            </div>
          `).join('');
        }
        addProcModal.showModal();
      });
    }
    if (closeAddProc && addProcModal) closeAddProc.addEventListener('click', () => addProcModal.close());
    if (cancelAddProc && addProcModal) cancelAddProc.addEventListener('click', () => addProcModal.close());

    if (confirmAddProc && addProcModal) {
      confirmAddProc.addEventListener('click', () => {
        const name = document.getElementById('newProcName').value;
        const max = [];
        const alloc = [];
        document.querySelectorAll('.new-proc-max-cell').forEach(inp => max.push(Number(inp.value) || 0));
        document.querySelectorAll('.new-proc-alloc-cell').forEach(inp => alloc.push(Number(inp.value) || 0));

        addProcess(name, max, alloc);
        addProcModal.close();
      });
    }

    // Modal Add Resource
    const addResBtn = document.getElementById('addResourceBtn');
    const addResModal = document.getElementById('addResourceModal');
    const closeAddRes = document.getElementById('closeAddResModal');
    const cancelAddRes = document.getElementById('cancelAddResModal');
    const confirmAddRes = document.getElementById('confirmAddResModal');

    if (addResBtn && addResModal) {
      addResBtn.addEventListener('click', () => {
        document.getElementById('newResName').value = String.fromCharCode(65 + state.resources.length);
        document.getElementById('newResTotal').value = 5;
        addResModal.showModal();
      });
    }
    if (closeAddRes && addResModal) closeAddRes.addEventListener('click', () => addResModal.close());
    if (cancelAddRes && addResModal) cancelAddRes.addEventListener('click', () => addResModal.close());

    if (confirmAddRes && addResModal) {
      confirmAddRes.addEventListener('click', () => {
        const name = document.getElementById('newResName').value;
        const total = Number(document.getElementById('newResTotal').value) || 5;
        addResource(name, total);
        addResModal.close();
      });
    }

    // Review 2 Report / Docs Modal
    const openDocsBtn = document.getElementById('openDocsBtn');
    const teamBadgeBtn = document.getElementById('teamBadgeBtn');
    const docsModal = document.getElementById('docsModal');
    const closeDocsModal = document.getElementById('closeDocsModal');
    const closeDocsModal2 = document.getElementById('closeDocsModal2');
    const printReportBtn = document.getElementById('printReportBtn');

    if ((openDocsBtn || teamBadgeBtn) && docsModal) {
      const openFn = () => docsModal.showModal();
      if (openDocsBtn) openDocsBtn.addEventListener('click', openFn);
      if (teamBadgeBtn) teamBadgeBtn.addEventListener('click', openFn);
    }
    if (closeDocsModal && docsModal) closeDocsModal.addEventListener('click', () => docsModal.close());
    if (closeDocsModal2 && docsModal) closeDocsModal2.addEventListener('click', () => docsModal.close());
    if (printReportBtn) printReportBtn.addEventListener('click', () => window.print());

    // Doc Modal Tabs
    document.querySelectorAll('.doc-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.doc-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.doc-tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        const target = document.getElementById(tab.dataset.tab);
        if (target) target.classList.add('active');
      });
    });

    // Console logs clear and export
    const clearLogsBtn = document.getElementById('clearLogsBtn');
    if (clearLogsBtn) {
      clearLogsBtn.addEventListener('click', () => {
        const consoleBody = document.getElementById('consoleBody');
        if (consoleBody) consoleBody.innerHTML = '';
        logMessage('SYS', 'Log console cleared.');
      });
    }

    const exportStateBtn = document.getElementById('exportStateBtn');
    if (exportStateBtn) {
      exportStateBtn.addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", `os_sim_state_${Date.now()}.json`);
        dlAnchor.click();
        logMessage('INFO', 'Exported simulation state snapshot as JSON.');
      });
    }
  }

  // --- BOOTSTRAP ---
  window.addEventListener('DOMContentLoaded', () => {
    syncMatricesAndAvailability();
    renderAll();
    initEventListeners();
    runSafetyCheck(false);
  });

})();
