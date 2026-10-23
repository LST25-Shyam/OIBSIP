// State & Elements
let tasks = JSON.parse(localStorage.getItem('oibsip_tasks')) || [];
let editingTaskId = null;

const todoForm = document.getElementById('todo-form');
const taskTitleInput = document.getElementById('task-title');
const taskDescInput = document.getElementById('task-desc');
const addBtn = document.getElementById('add-btn');

const pendingList = document.getElementById('pending-list');
const completedList = document.getElementById('completed-list');

const pendingCount = document.getElementById('pending-count');
const completedCount = document.getElementById('completed-count');

const pendingEmpty = document.getElementById('pending-empty');
const completedEmpty = document.getElementById('completed-empty');

// Save to LocalStorage
function saveTasks() {
  localStorage.setItem('oibsip_tasks', JSON.stringify(tasks));
}

// Format Date
function formatDate(dateString) {
  const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Render Tasks
function renderTasks() {
  pendingList.innerHTML = '';
  completedList.innerHTML = '';

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  // Update Counters
  pendingCount.textContent = pendingTasks.length;
  completedCount.textContent = completedTasks.length;

  // Toggle Empty States
  pendingEmpty.style.display = pendingTasks.length === 0 ? 'block' : 'none';
  completedEmpty.style.display = completedTasks.length === 0 ? 'block' : 'none';

  // Render Pending List
  pendingTasks.forEach(task => {
    pendingList.appendChild(createTaskElement(task));
  });

  // Render Completed List
  completedTasks.forEach(task => {
    completedList.appendChild(createTaskElement(task));
  });
}

// Create DOM Element for Single Task
function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = `task-item ${task.completed ? 'completed' : ''}`;

  li.innerHTML = `
    <div class="task-header">
      <h3 class="task-title">${escapeHTML(task.title)}</h3>
    </div>
    ${task.desc ? `<p class="task-desc">${escapeHTML(task.desc)}</p>` : ''}
    <div class="task-footer">
      <span class="task-date"><i class="fa-regular fa-clock"></i> ${formatDate(task.createdAt)}</span>
      <div class="task-actions">
        <button class="action-btn complete" onclick="toggleTaskStatus('${task.id}')" title="${task.completed ? 'Mark Pending' : 'Mark Complete'}">
          <i class="fa-solid ${task.completed ? 'fa-rotate-left' : 'fa-check'}"></i>
        </button>
        ${!task.completed ? `
          <button class="action-btn edit" onclick="editTask('${task.id}')" title="Edit Task">
            <i class="fa-solid fa-pen"></i>
          </button>
        ` : ''}
        <button class="action-btn delete" onclick="deleteTask('${task.id}')" title="Delete Task">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  `;

  return li;
}

// Escape HTML to prevent XSS
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// Form Submit Handler (Add / Edit)
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = taskTitleInput.value.trim();
  const desc = taskDescInput.value.trim();

  if (!title) return;

  if (editingTaskId) {
    // Edit existing task
    tasks = tasks.map(task => 
      task.id === editingTaskId ? { ...task, title, desc } : task
    );
    editingTaskId = null;
    addBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Add Task`;
  } else {
    // Add new task
    const newTask = {
      id: Date.now().toString(),
      title,
      desc,
      completed: false,
      createdAt: new Date().toISOString()
    };
    tasks.unshift(newTask);
  }

  saveTasks();
  renderTasks();
  todoForm.reset();
});

// Toggle Complete Status
function toggleTaskStatus(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });

  saveTasks();
  renderTasks();
}

// Edit Task
function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  taskTitleInput.value = task.title;
  taskDescInput.value = task.desc || '';
  editingTaskId = id;
  addBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Save Changes`;
  taskTitleInput.focus();
}

// Delete Task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// Initial Render
renderTasks();