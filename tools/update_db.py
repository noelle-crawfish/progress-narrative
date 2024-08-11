#!/usr/bin/env python3

import csv
import json
import os

SECRETS_FILE = "secrets.json"

def rename(db, old_label, new_label):
    for date in db:
        if old_label in db[date]:
            db[date][new_label] = db[date][old_label]
            del db[date][old_label]

def update_cronometer_data(username: str, password: str) -> None:
    # password = password.replace('$', '\\$') # go recognizes $ as a special char, so it may need replacing if present
    # os.system(f"cd cronometer && go run cronometer.go {username} {password}")

    labels, data = None, {}
    with open("./cronometer/cronometer.csv") as csvfile:
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


def update_garmin_data() -> None:
    os.system("cd garmin && python garmindb_cli.py --all --download --import --analyze --latest")


def update_toggl_data() -> None:
    pass

def insert_data(db: dict, new_data: dict) -> None:
    for item in new_data:
        if item in db:
            db[item] = {**db[item], **new_data[item]}
        else:
            db[item] = new_data[item]
    return db

def merge_db() -> None:
    garmin_file = open("./garmin/garmin_health.json", "r")
    garmin = json.load(garmin_file)
    garmin_file.close()

    cronometer_file = open("./cronometer.json", "r")
    cronometer = json.load(cronometer_file)
    cronometer_file.close()

    toggl_file = open("./toggl/toggl.json", "r")
    toggl = json.load(toggl_file)
    toggl_file.close()

    db = {}
    db = insert_data(db, garmin)
    db = insert_data(db, cronometer)
    db = insert_data(db, toggl)

    db['365 Day Avg.'] = {}
    db['30 Day Avg.'] = {}
    db['7 Day Avg.'] = {}

    history = 0
    for i in range(-1, -365-1, -1):
        try:
            for label in db[list(db.keys())[i]]:

                try:
                    if not label in db['365 Day Avg']:
                        db['365 Day Avg'][label] = float(db[list(db.keys())[i]][label])
                    else:
                        db['365 Day Avg'][label] += float(db[list(db.keys())[i]][label])
                except:
                    print("Could not avg. label: ", label)
            history += 1
        except:
            pass

        if i == -7:
            for label in db['365 Day Avg.']:
                db['7 Day Avg.'][label] = db['365 Day Avg.'][label] / history
        elif i == -30:
            for label in db['365 Day Avg.']:
                db['30 Day Avg.'][label] = db['365 Day Avg.'][label] / history
        elif i == -365:
            for label in db['365 Day Avg.']:
                db['365 Day Avg.'][label] = db['365 Day Avg.'][label] / history

    rename(db, "rhr", "Resting HR (bpm)")
    rename(db, "hr_min", "Min. HR (bpm)")
    rename(db, "hr_max", "Max. HR (bpm)")

    output_file = open("data.json", "w")
    json.dump(db, output_file)
    output_file.close()

if __name__=="__main__":

    secrets = json.load(open(SECRETS_FILE))

    update_cronometer_data(secrets['cronometer']['username'], secrets['cronometer']['password'])
    # update_garmin_data() # TODO secrets are currently included in json file, should I move / keep there?

    merge_db()
