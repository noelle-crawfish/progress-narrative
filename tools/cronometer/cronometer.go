package main

import (
	"context"
	"fmt"
	"github.com/jrmycanady/gocronometer"
	"os"
	"time"
)

var output_file = "cronometer.csv"

func main() {
	username := os.Args[1]
	password := os.Args[2]
	fmt.Printf("%s %s\n", username, password)

	c := gocronometer.NewClient(nil)
	err := c.Login(context.Background(), username, password)
	if err != nil {
		fmt.Printf("login failed: %s\n", err)
	}

	startDate := time.Date(2024, 06, 01, 0, 0, 0, 0, time.UTC)
	rawCSVData, err := c.ExportDailyNutrition(context.Background(), startDate, time.Now())
	if err != nil {
		fmt.Printf("csv retrieval failed: %s\n", err)
	}

	err = os.WriteFile(output_file, []byte(rawCSVData), 0644)
}
