#!/usr/bin/env python3

import json

OUTPUT_FILE = "daylio.json"

mood_map = {
    "awful":0,
    "bad":1,
    "meh":2,
    "good":3,
    "rad":4
}

if __name__=="__main__":
    data = {}
    for line in open("daylio.csv", "r"):
        if "full_date" in line:
            continue # skip header
        values = line.split(",")
        data[values[0]] = {
            "weekday": values[2],
            "mood": mood_map[values[4]],
            "activities": values[5].split(' | '),
            "note": values[7]
        }

    with open(OUTPUT_FILE, "w") as json_file:
        json.dump(data, json_file)
