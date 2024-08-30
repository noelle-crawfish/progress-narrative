#!/usr/bin/env python3

import json
from datetime import datetime, time, timedelta

from garmindb.garmindb import GarminDb, GarminSummaryDb, Attributes, Device, DeviceInfo, DailySummary, ActivitiesDb, \
    MonitoringDb, Monitoring, Activities, StepsActivities, DaysSummary, Weight, Sleep, IntensityHR, MonitoringHeartRate
from garmindb import GarminConnectConfigManager

from sqlalchemy import Column, Integer, Date, DateTime, text

gc_config = GarminConnectConfigManager()
db_params = gc_config.get_db_params()
garmin_db = GarminDb(db_params)
garmin_sum_db = GarminSummaryDb(db_params)
activities_db = ActivitiesDb(db_params)
monitoring_db = MonitoringDb(db_params)

def get_sleep_stats(ts: datetime):
    # sleep breakdown -> time slept, bedtime, wakeup time, REM time, sleep score, body battery charge
    sleep_stats = {}
    with garmin_db.managed_session() as garmin_session:
        raw_sleep_stats = Sleep.get_daily_stats(garmin_session, ts)

    sleep_stats['sleep_duration'] = raw_sleep_stats['sleep_avg'].hour*60 + raw_sleep_stats['sleep_avg'].minute
    sleep_stats['sleep_score'] = raw_sleep_stats['score_avg']

    return sleep_stats

def get_active_stats(ts: datetime):
    # which activities were done -> check for run, bike, hike, climb, strength, yoga, row, swim, misc.
    with activities_db.managed_session() as activities_session:
        act = Activities.get_daily_stats(activities_session, ts)
        # print(act)
    return {}

def get_daily_stats(ts: datetime):
    # hr_min, hr_max, rhr
    # stress_avg, steps, floors_up, distance
    # calories_total, calories_active -> idk if both are needed
    # hydration intake, sweat loss?
    # what is rr
    # bb_charged, bb_max, bb_min -> do I care about how much it charged? I think will put w sleep score
    # moderate_activity_time vigorus_activity_time


    daily_stats = {}
    with garmin_db.managed_session() as garmin_session:
        summary = DailySummary.get_daily_stats(garmin_session, ts)
        weight_stats = Weight.get_daily_stats(garmin_session, ts)

    with monitoring_db.managed_session() as monitoring_session:
        hr_data = MonitoringHeartRate.get_daily_stats(monitoring_session, ts)

    daily_stats['weight'] = weight_stats['weight_avg']
    daily_stats['calories'] = summary['calories_avg']

    daily_stats['rhr'] = summary['rhr_avg']
    daily_stats['min_hr'] = hr_data['hr_min']
    daily_stats['max_hr'] = hr_data['hr_max']

    moderate_activity = summary['moderate_activity_time']
    vigorous_activity = summary['vigorous_activity_time']
    daily_stats['intensity_min'] = moderate_activity.hour*60 + moderate_activity.minute + \
        2*(vigorous_activity.hour*60 + vigorous_activity.minute)

    daily_stats['steps'] = summary['steps']
    daily_stats['floors'] = summary['floors']
    # TODO distance

    daily_stats['stress'] = summary['stress_avg']

    return daily_stats

if __name__=="__main__":

    end_ts = datetime.now() - timedelta(days=1)

    garmin_json = {}
    for ts in [end_ts - timedelta(days=i) for i in range(60)]:
        daily_stats = get_daily_stats(ts)
        sleep_stats = get_sleep_stats(ts)
        active_stats = get_active_stats(ts)

        garmin_json[ts.strftime("%Y-%m-%d")] = {**daily_stats, **sleep_stats, **active_stats}
    # exit(0)
    # garmin_json = {}
    # for result in results:
    #     garmin_json[str(result.day)] = {}

    #     garmin_json[str(result.day)]["hr_min"] = result.hr_min
    #     garmin_json[str(result.day)]["hr_max"] = result.hr_max
    #     garmin_json[str(result.day)]["rhr"] = result.rhr

    #     garmin_json[str(result.day)]["steps"] = result.steps
    #     garmin_json[str(result.day)]["calories_out"] = result.calories_total

    #     garmin_json[str(result.day)]["active_min"] = \
    #         result.moderate_activity_time.minute + 2*result.vigorous_activity_time.minute

    #     garmin_json[str(result.day)]["stress"] = result.stress_avg


    with open("garmin.json", "w") as json_file:
        json.dump(garmin_json, json_file)
