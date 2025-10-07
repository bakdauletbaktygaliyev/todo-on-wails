package service

import (
	"errors"
	"log"
	"strings"
	"time"
	"todo-app/backend/models"
	"todo-app/backend/storage"
)

type TaskService struct {
	storage storage.Storage
}

func NewTaskService(storage storage.Storage) *TaskService {
	return &TaskService{storage}
}

func (u *TaskService) GetAllTasks() ([]models.Task, error) {
	tasks, err := u.storage.GetAllTasks()
	if err != nil {
		log.Fatalf("Can't get all tasks: %v", err)
		return nil, err
	}
	return tasks, nil
}

func (u *TaskService) AddTask(title string, priority string, dueDate string) error {
	date, err := time.Parse("2006-01-02T15:04", dueDate)
	if err != nil {
		log.Fatalf("Can't parse due date: %v", err)
		return err
	}

	if strings.TrimSpace(title) == "" {
		log.Fatal("Title is required. Must be not blank.")
		return errors.New("Invalid title.")
	}

	validPriorities := map[string]bool{"Low": true, "Medium": true, "High": true}
	if !validPriorities[priority] {
		return errors.New("priority must be 'low', 'medium', or 'high'")
	}

	task := models.Task{
		Title:     title,
		Done:      false,
		Priority:  priority,
		DueDate:   date,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err = u.storage.AddTask(task); err != nil {
		log.Fatalf("Can't add task into database: %v", err)
	}

	return nil
}

func (u *TaskService) DeleteTask(id int) error {
	if err := u.storage.DeleteTask(id); err != nil {
		log.Fatalf("Can't delete task: %v", err)
		return err
	}
	return nil
}

func (u *TaskService) DeleteAllTasks() error {
	if err := u.storage.DeleteAllTasks(); err != nil {
		log.Fatalf("Can't delete all tasks: %v", err)
		return err
	}

	return nil
}

func (u *TaskService) ToggleTaskCompletion(id int) error {
	task, err := u.storage.GetTaskById(id)
	if err != nil {
		log.Fatalf("Can't get task by id %v: %v", id, err)
		return err
	}
	task.Done = !task.Done
	task.UpdatedAt = time.Now()
	if err = u.storage.UpdateTask(&task); err != nil {
		log.Fatalf("Can't update task: %v", err)
		return err
	}
	return nil
}

func (u *TaskService) UpdateTask(task *models.Task) error {
	task.UpdatedAt = time.Now()
	if err := u.storage.UpdateTask(task); err != nil {
		log.Fatalf("Can't update task: %v", err)
		return err
	}

	return nil
}

func (u *TaskService) ClearCompletedTasks() error {
	if err := u.storage.DeleteCompletedTasks(); err != nil {
		log.Fatalf("Can't delete completed tasks: %v", err)
		return err
	}
	return nil
}
