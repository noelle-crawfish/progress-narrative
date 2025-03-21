
import argparse
import os 

import utils

def fetch_data(start_date:str) -> None:
    username, password = utils.get_secrets("cronometer")
    output_file = "cronometer.csv"

    # $ is a special character to go, so may need to escape it
    password = password.replace("$", "\$")

    cmd = f"cd cronometer && go run cronometer.go --username {username} --password {password} \
    --startDate {start_date} --outputFile {output_file}"
    os.system(cmd)

if __name__=="__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--start_date", type=str, required=True)
    args = parser.parse_args()

    fetch_data(args.start_date)

