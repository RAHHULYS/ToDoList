const tasksDOM = document.querySelector('.tasks');
const loadingDOM = document.querySelector('.loading-text');
const formDOM = document.querySelector('.task-form');
const taskInputDOM = document.querySelector('.task-input');
const formAlertDOM = document.querySelector('.form-alert');

// Load tasks from /api/tasks
const showTasks = async () => {
  loadingDOM.style.visibility = 'visible';
  try {
    const { data: { tasks } } = await axios.get('/api/v1/tasks');
    if (tasks.length < 1) {
      tasksDOM.innerHTML = '<h5 class="empty-list">No tasks in your list</h5>';
      loadingDOM.style.visibility = 'hidden';
      return;
    }
    const allTasks = tasks.map((task) => {
      const { completed, _id: taskID, name } = task;
      return `<div class="single-task ${completed && 'task-completed'}" draggable="true" data-id="${taskID}">
                <h5><span><i class="far fa-check-circle"></i></span>${name}</h5>
                <div class="task-links">
                  <a href="task.html?id=${taskID}" class="edit-link">
                    <i class="fas fa-edit"></i>
                  </a>
                  <button type="button" class="delete-btn" data-id="${taskID}">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>`;
    }).join('');
    tasksDOM.innerHTML = allTasks;

    // Add drag-and-drop event listeners to tasks
    const taskElements = document.querySelectorAll('.single-task');
    taskElements.forEach((task) => {
      task.addEventListener('dragstart', handleDragStart);
      task.addEventListener('dragover', handleDragOver);
      task.addEventListener('drop', handleDrop);
      task.addEventListener('dragenter', handleDragEnter);
      task.addEventListener('dragleave', handleDragLeave);
      task.addEventListener('dragend', handleDragEnd);
    });
  } catch (error) {
    tasksDOM.innerHTML = '<h5 class="empty-list">There was an error, please try later....</h5>';
  }
  loadingDOM.style.visibility = 'hidden';
};

// Drag-and-drop functions
let draggedTask = null;

const handleDragStart = (e) => {
  draggedTask = e.target;
  e.target.classList.add('dragging');
};

const handleDragOver = (e) => {
  e.preventDefault();
};

const handleDragEnter = (e) => {
  if (e.target.classList.contains('single-task')) {
    e.target.classList.add('drag-over');
  }
};

const handleDragLeave = (e) => {
  if (e.target.classList.contains('single-task')) {
    e.target.classList.remove('drag-over');
  }
};

const handleDrop = (e) => {
  e.preventDefault();
  if (e.target.classList.contains('single-task')) {
    e.target.classList.remove('drag-over');
    tasksDOM.insertBefore(draggedTask, e.target);
    updateTaskOrder();  // Call function to update task order
  }
};

const handleDragEnd = (e) => {
  e.target.classList.remove('dragging');
};

// Update task order on the backend
const updateTaskOrder = async () => {
  const taskElements = document.querySelectorAll('.single-task');
  const taskIds = Array.from(taskElements).map(task => task.getAttribute('data-id'));

  try {
    await axios.put('/api/v1/tasks/order', { taskIds });
  } catch (error) {
    console.error('Error updating task order:', error);
  }
};

// Delete task
tasksDOM.addEventListener('click', async (e) => {
  const el = e.target;
  if (el.parentElement.classList.contains('delete-btn')) {
    loadingDOM.style.visibility = 'visible';
    const id = el.parentElement.dataset.id;
    try {
      await axios.delete(`/api/v1/tasks/${id}`);
      showTasks();
    } catch (error) {
      console.log(error);
    }
    loadingDOM.style.visibility = 'hidden';
  }
});

// Form submission
formDOM.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = taskInputDOM.value;
  try {
    await axios.post('/api/v1/tasks', { name });
    showTasks();
    taskInputDOM.value = '';
    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = 'Success, task added';
    formAlertDOM.classList.add('text-success');
  } catch (error) {
    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = 'Error, please try again';
  }
  setTimeout(() => {
    formAlertDOM.style.display = 'none';
    formAlertDOM.classList.remove('text-success');
  }, 3000);
});

showTasks();
