const API_URL = 'http://localhost:3000';

function addTask() {
    const taskDescription = document.getElementById('taskDescription').value;
    const dueDate = document.getElementById('dueDate').value;

    fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            description: taskDescription,
            due_date: dueDate
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        renderTasks();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function renderTasks() {
    fetch(`${API_URL}/tasks`)
        .then(response => response.json())
        .then(tasks => {
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = '';

            tasks.forEach(task => {
                const taskItem = document.createElement('li');
                taskItem.classList.toggle('completed', task.status === 'Completed');

                const taskContent = document.createElement('span');
                taskContent.innerHTML = `${task.description} (Due: ${task.due_date})`;

                const toggleButton = document.createElement('button');
                toggleButton.textContent = task.status === 'Pending' ? 'Complete' : 'Undo';
                toggleButton.addEventListener('click', () => toggleTaskStatus(task.task_id, task.status));

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => deleteTask(task.task_id));

                taskItem.appendChild(taskContent);
                taskItem.appendChild(toggleButton);
                taskItem.appendChild(deleteButton);

                taskList.appendChild(taskItem);
            });
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
        });
}

function toggleTaskStatus(taskId, currentStatus) {
    const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';

    fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        renderTasks();
    })
    .catch(error => {
        console.error('Error updating task status:', error);
    });
}

function deleteTask(taskId) {
    fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        renderTasks();
    })
    .catch(error => {
        console.error('Error deleting task:', error);
    });
}

// Initial render
renderTasks();
