#!/usr/bin/env python3

import json
import requests
import os.path

RESEARCH_PROJECT_ID = 202873184

productive = [
    'Research',
    'Chores'
]

fun = [
    'Social',
    'Hobbies',
    'Excercise'
]

with open("../secrets.json") as secrets:
    api_token = json.load(secrets)["toggl-track"]["api-token"]

# prefix = f"curl -u {api_token}:api_token https://api.track.toggl.com/api/v9/me"

# auth = f"{api_token}:api_token"

# get_projects = f'curl -u {auth} -H "Content-Type: application/json" -X GET https://api.track.toggl.com/api/v9/me/projects'

auth = (api_token, "api_token")
url = "https://api.track.toggl.com/api/v9/me"
headers = {'content-type':'application/json'}

def get_datasheet_stats():
    projects = requests.get(f"{url}/projects", headers=headers, auth=auth).json()
    project_by_id = {}
    for project in projects:
        project_by_id[project['id']] = project['name']
        print(project['name'])


    params = {
        "start_date":"2024-06-01", # 1 yr ago
        "end_date":"2024-06-22" # I think needs to be one day past (tommorow)
    }
    time_entries = requests.get(f"{url}/time_entries", headers=headers, auth=auth, params=params).json()
    time_entries_by_day = {}
    for entry in time_entries:
        # print(f"{project_by_id[entry['project_id']]} -> {entry['description']}: {entry['duration'] // 60} min")
        date = entry['start'].split('T')[0] # making the assumption entries are confined to a single day
        if date not in time_entries_by_day:
            time_entries_by_day[date] = [entry]
        else:
            time_entries_by_day[date] += [entry]

    toggl_json = {}
    for date in time_entries_by_day:
        toggl_json[date] = {
            "Productive Min.": 0,
            "Leisure Min.": 0,
        }

        for entry in time_entries_by_day[date]:
            if project_by_id[entry['project_id']] in productive:
                toggl_json[date]["Productive Min."] += entry['duration'] // 60
            elif project_by_id[entry['project_id']] in fun:
                toggl_json[date]["Leisure Min."] += entry['duration'] // 60

    return toggl_json

def get_monthly_entries(year: int, month: int):
    params = {
        "start_date":f"{year}-{month:02d}-01", # 1 yr ago
        "end_date":f"{year+1 if month == 12 else year}-{(1 if month == 12 else month+1):02d}-01"
    }
    time_entries = requests.get(f"{url}/time_entries", headers=headers, auth=auth, params=params).json()

    if type(time_entries) == str or len(time_entries) == 0:
        return {}

    for i in range(len(time_entries)):
        # print(time_entries[i])
        # time_entries[i] = json.loads(time_entries[i])
        if time_entries[i]['project_id'] == RESEARCH_PROJECT_ID:
            time_entries[i]['description'] = 'Research'
    return time_entries

if __name__=="__main__":

    # # generate overview stats for datasheet
    # datasheet_stats = get_datasheet_stats()
    # with open("toggl.json", "w") as json_file:
    #     json.dump(datasheet_stats, json_file)

    # generate montly stats for calendar
    for year in [2024]:
        for month in range(1, 12+1):
            filename = f"months/toggl-{year}-{month}.json"
            # if os.path.exists(filename):
            #     continue

            month_stats = get_monthly_entries(year, month)
            with open(filename, "w") as json_file:
                json.dump(month_stats, json_file)
