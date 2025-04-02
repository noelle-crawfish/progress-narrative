
import argparse
import csv
import json
import os 

import utils

api_output_file = "cronometer.csv"
formatted_output_file = "cronometer.json"

def fetch_data(start_date:str) -> None:
    username, password = utils.get_secrets("cronometer")

    # $ is a special character to go, so may need to escape it
    password = password.replace("$", "\$")

    cmd = f"cd cronometer && go run cronometer.go --username {username} --password {password} \
    --startDate {start_date} --outputFile {api_output_file}"
    os.system(cmd)

def format_data():
    cronometer_formatted_data = {}
    with open(f"cronometer/{api_output_file}", 'r') as csv_file:
        reader = csv.DictReader(csv_file)
        for row in reader:
            day = row["Date"]
            del row["Date"]
            cronometer_formatted_data[day] = row

    # interesting statistics:
    # - is alcohol consumed? maybe have a "days sober + avg. streak + max streak on site"
    # - ...
    return cronometer_formatted_data

if __name__=="__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--start_date", type=str, required=True)
    args = parser.parse_args()

    fetch_data(args.start_date)
    with open(f"cronometer/{formatted_output_file}", "w") as f:
        json.dump(format_data(), f)

