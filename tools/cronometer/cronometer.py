#!/usr/bin/env python3

import csv
import json
import os

SECRETS_FILE = "./../secrets.json"

def rename(db, old_label, new_label):
    for date in db:
        if old_label in db[date]:
            db[date][new_label] = db[date][old_label]
            del db[date][old_label]

def update_cronometer_data(username: str, password: str) -> None:
    password = password.replace('$', '\\$') # go recognizes $ as a special char, so it may need replacing if present
    os.system(f"go run cronometer.go {username} {password}")

    labels, data = None, {}
    with open("./cronometer.csv") as csvfile:
        reader = csv.reader(csvfile, delimiter=',')
        for row in reader:
            if not labels:
                labels = row
            else:
                date = row[0]
                data[date] = {}
                for i, label in enumerate(labels[1:]):
                    data[date][label] = (0.0 if row[i+1] == '' else row[i+1])

    with open("cronometer.json", "w") as cronometer_json:
        json.dump(data, cronometer_json)



if __name__=="__main__":

    secrets = json.load(open(SECRETS_FILE))

    update_cronometer_data(secrets['cronometer']['username'], secrets['cronometer']['password'])
