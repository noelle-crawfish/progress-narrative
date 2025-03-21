
package main

import (
	"context"
	"flag"
	"fmt"
	"github.com/jrmycanady/gocronometer"
	"os"
	"time"
)

func main() {
	username := flag.String("username", "", "Username (required)")
	password := flag.String("password", "", "Password (required)")
	outputFile := flag.String("outputFile", "cronometer.csv", "Output filename")
	startDateString := flag.String("startDate", "2025-03-21", "Start date of data range")
	flag.Parse()

	c := gocronometer.NewClient(nil)
	err := c.Login(context.Background(), *username, *password)
	if err != nil {
		fmt.Printf("login failed: %s\n", err)
	}

	startDate, err := time.Parse("2006-01-02", *startDateString)
	rawCSVData, err := c.ExportDailyNutrition(context.Background(), startDate, time.Now())
	if err != nil {
		fmt.Printf("csv retrieval failed: %s\n", err)
	}

	err = os.WriteFile(*outputFile, []byte(rawCSVData), 0644)
}
