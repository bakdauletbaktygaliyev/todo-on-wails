package main

import (
	"embed"
	"todo-app/backend/service"
	"todo-app/backend/storage/sqlite"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

// go:embed all:frontend/dist
var assets embed.FS

func main() {
	storage, _ := sqlite.New("tasks.db")
	taskService := service.NewTaskService(storage)
	app := NewApp(taskService)

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "todo-app",
		Width:  1524,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
