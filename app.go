package main

import (
	"context"
	"todo-app/backend/models"
	"todo-app/backend/service"
)

// App struct
type App struct {
	ctx         context.Context
	taskService *service.TaskService
}

// NewApp creates a new App application struct
func NewApp(taskService *service.TaskService) *App {
	return &App{taskService: taskService}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// GetAllTasks fetches all tasks from SQLite
func (a *App) GetAllTasks() ([]models.Task, error) {
	return a.taskService.GetAllTasks()
}

// AddTask adds a new task
func (a *App) AddTask(title string, priority string, dueDate string) error {
	return a.taskService.AddTask(title, priority, dueDate)
}

// DeleteTask removes a task by ID
func (a *App) DeleteTask(id int) error {
	return a.taskService.DeleteTask(id)
}

func (a *App) DeleteAllTasks() error {
	return a.taskService.DeleteAllTasks()
}

// ToggleTaskCompletion marks a task as done or undone
func (a *App) ToggleTaskCompletion(id int) error {
	return a.taskService.ToggleTaskCompletion(id)
}

func (a *App) UpdateTask(task models.Task) error {
	return a.taskService.UpdateTask(&task)
}

func (a *App) ClearCompletedTasks() error {
	return a.taskService.ClearCompletedTasks()
}
