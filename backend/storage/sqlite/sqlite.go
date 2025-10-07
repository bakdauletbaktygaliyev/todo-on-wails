package sqlite

import (
	"log"
	"todo-app/backend/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Storage struct {
	db *gorm.DB
}

func New(path string) (*Storage, error) {
	db, err := gorm.Open(sqlite.Open(path), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database")
		return nil, err
	}

	db.AutoMigrate(&models.Task{})
	return &Storage{db}, nil
}

// gets all tasks from SQLite
func (s *Storage) GetAllTasks() ([]models.Task, error) {
	var tasks []models.Task
	result := s.db.Find(&tasks)
	return tasks, result.Error
}

func (s *Storage) GetTaskById(id int) (models.Task, error) {
	task := models.Task{}
	if err := s.db.First(&task, id).Error; err != nil {
		return models.Task{}, err
	}

	return task, nil
}

// will add new task into db
func (s *Storage) AddTask(task models.Task) error {
	return s.db.Create(&task).Error
}

// will remove task by ID
func (s *Storage) DeleteTask(id int) error {
	return s.db.Delete(&models.Task{}, id).Error
}

func (s *Storage) DeleteAllTasks() error {
	return s.db.Where("1 = 1").Delete(&models.Task{}).Error
}

func (s *Storage) UpdateTask(task *models.Task) error {
	return s.db.Save(task).Error
}

func (s *Storage) DeleteCompletedTasks() error {
	return s.db.Where("done = ?", true).Delete(&models.Task{}).Error
}
