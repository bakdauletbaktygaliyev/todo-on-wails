package storage

import "todo-app/backend/models"

type Storage interface {
	GetAllTasks() ([]models.Task, error)
	GetTaskById(id int) (models.Task, error)
	AddTask(task models.Task) error
	DeleteTask(id int) error
	DeleteAllTasks() error
	UpdateTask(task *models.Task) error
	DeleteCompletedTasks() error
}
