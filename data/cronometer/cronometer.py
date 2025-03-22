
import argparse
import csv
import os 

import utils

output_file = "cronometer.csv"

def fetch_data(start_date:str) -> None:
    username, password = utils.get_secrets("cronometer")

    # $ is a special character to go, so may need to escape it
    password = password.replace("$", "\$")

    cmd = f"cd cronometer && go run cronometer.go --username {username} --password {password} \
    --startDate {start_date} --outputFile {output_file}"
    os.system(cmd)

def format_data():
    with open(f"cronometer/{output_file}", 'r') as csv_file:
        reader = csv.DictReader(csv_file)
        for row in reader:
            print(row)

    # interesting statistics:
    # - is alcohol consumed? maybe have a "days sober + avg. streak + max streak on site"
    # - ...

if __name__=="__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--start_date", type=str, required=True)
    args = parser.parse_args()

    # fetch_data(args.start_date)
    format_data()

