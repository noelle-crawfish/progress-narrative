#!/usr/bin/env python3

import json
import requests

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

with open("toggl.json", "w") as toggl_json_file:
    json.dump(toggl_json, toggl_json_file)
