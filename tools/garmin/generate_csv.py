#!/usr/bin/env python3

import json
from datetime import datetime, time, timedelta

from garmindb.garmindb import GarminDb, Attributes, Device, DeviceInfo, DailySummary, ActivitiesDb, Activities, StepsActivities
from garmindb import GarminConnectConfigManager

def get_sleep_data():
    # sleep breakdown -> time slept, bedtime, wakeup time, REM time, sleep score, body battery charge
    pass

def get_activities():
    # which activities were done -> check for run, bike, hike, climb, strength, yoga, row, swim, misc.
    pass

def get_daily_stats():
    # hr_min, hr_max, rhr
    # stress_avg, steps, floors_up, distance
    # calories_total, calories_active -> idk if both are needed
    # hydration intake, sweat loss?
    # what is rr
    # bb_charged, bb_max, bb_min -> do I care about how much it charged? I think will put w sleep score
    # moderate_activity_time vigorus_activity_time

    # can I get like max stress value or soemthing?
    # weight
    pass

if __name__=="__main__":
    gc_config = GarminConnectConfigManager()
    db_params = gc_config.get_db_params()
    garmin_db = GarminDb(db_params)

    end_ts = datetime.now()
    start_ts = end_ts - timedelta(days=7)
    results = DailySummary.get_for_period(garmin_db, start_ts, end_ts)
    for result in results:
        print(result.day)

    garmin_json = {}
    for result in results:
        garmin_json[str(result.day)] = {}

        garmin_json[str(result.day)]["hr_min"] = result.hr_min
        garmin_json[str(result.day)]["hr_max"] = result.hr_max
        garmin_json[str(result.day)]["rhr"] = result.rhr

    json_file = open("garmin_health.json", "w")
    json.dump(garmin_json, json_file)
    # print(results)
