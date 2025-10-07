import { useEffect, useState } from "react";
import {
  GetAllTasks,
  AddTask,
  UpdateTask,
  DeleteTask,
  DeleteAllTasks,
  ToggleTaskCompletion,
  ClearCompletedTasks,
} from "../wailsjs/go/main/App";
import "./App.css";
import Swal from "sweetalert2";

interface Task {
  id: number;
  title: string;
  done: boolean;
  priority: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [editTask, setEditTask] = useState<Task | null>(null);
  const formatDate = (dateString: string) => {
    if (!dateString) return ""; // Handle undefined or empty input safely
    const date = new Date(dateString);
    return date.toISOString(); // Returns "2025-03-06T07:56:00.000Z"
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const result: Task[] = await GetAllTasks();
      setTasks(
        result.sort(
          (a, b) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
        ),
      );
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const handleTaskSubmit = async () => {
    if (!title || !dueDate) return;

    if (editTask !== null) {
      const updatedTask = {
        id: editTask.id,
        title,
        priority,
        dueDate: formatDate(editTask.dueDate),
        done: tasks.find((t) => t.id === editTask.id)?.done || false,
        createdAt: formatDate(editTask.createdAt),
        updatedAt: formatDate(editTask.updatedAt),
        convertValues: () => {},
      };

      await UpdateTask(updatedTask);
    } else {
      await AddTask(title, priority, dueDate);
    }

    resetForm();
    await loadTasks();
  };
  const deleteTask = async (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await DeleteTask(id);
        loadTasks();
        Swal.fire("Deleted!", "The task has been removed.", "success");
      }
    });
  };

  const deleteAllTasks = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete all tasks and cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete all tasks!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await DeleteAllTasks(); // Backend call to delete all tasks
        loadTasks();
        Swal.fire("Deleted!", "All tasks have been removed.", "success");
      }
    });
  };

  const clearCompletedTasks = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete all completed tasks!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, clear them!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await ClearCompletedTasks();
        loadTasks();
        Swal.fire(
          "Cleared!",
          "All completed tasks have been removed.",
          "success",
        );
      }
    });
  };

  const toggleTask = async (id: number) => {
    await ToggleTaskCompletion(id);
    loadTasks();
  };

  const startEditTask = (task: Task) => {
    setEditTask(task);
    setTitle(task.title);
    setPriority(task.priority);
    setDueDate(task.dueDate);
  };

  const resetForm = () => {
    setEditTask(null);
    setTitle("");
    setPriority("Medium");
    setDueDate("");
  };

  return (
    <div className="container">
      <h1>To-Do List</h1>
      <div className="task-inputs">
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button onClick={handleTaskSubmit}>
          {editTask ? "Update" : "Add"}
        </button>
        {editTask && <button onClick={resetForm}>Cancel</button>}
      </div>

      <div className="extra-btns">
        <button className="delete-btn" onClick={deleteAllTasks}>
          Delete All Tasks
        </button>

        <button className="toggle-btn" onClick={clearCompletedTasks}>
          Clear
        </button>
      </div>
      <div className="task-sections">
        <div className="task-column">
          <h2>Pending Tasks</h2>

          <ul className="task-list">
            {tasks
              .filter((task) => !task.done)
              .map((task) => (
                <li
                  key={task.id}
                  className={`task-item priority-${task.priority.toLowerCase()}`}
                >
                  <span>
                    {task.title} ({task.priority}) - Due: {task.dueDate}
                  </span>
                  <small>
                    Created: {new Date(task.createdAt).toLocaleString()}
                  </small>
                  <small>
                    Updated: {new Date(task.updatedAt).toLocaleString()}
                  </small>
                  <div className="task-actions">
                    <button
                      className="toggle-btn"
                      onClick={() => toggleTask(task.id)}
                    >
                      Done
                    </button>
                    <button
                      className="toggle-btn"
                      onClick={() => startEditTask(task)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>

        <div className="task-column">
          <h2>Completed Tasks</h2>
          <ul className="task-list completed-tasks">
            {tasks
              .filter((task) => task.done)
              .map((task) => (
                <li
                  key={task.id}
                  className={`task-item priority-${task.priority.toLowerCase()}`}
                >
                  <span>
                    {task.title} ({task.priority}) - Due: {task.dueDate}
                  </span>
                  <small>
                    Created: {new Date(task.createdAt).toLocaleString()}
                  </small>
                  <small>
                    Updated: {new Date(task.updatedAt).toLocaleString()}
                  </small>
                  <div className="task-actions">
                    <button
                      className="toggle-btn"
                      onClick={() => toggleTask(task.id)}
                    >
                      Undo
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
