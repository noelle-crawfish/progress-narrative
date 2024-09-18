#!/usr/bin/env python3

import json
from datetime import datetime, time, timedelta

from garmindb.garmindb import GarminDb, GarminSummaryDb, Attributes, Device, DeviceInfo, DailySummary, ActivitiesDb, \
    MonitoringDb, Monitoring, Activities, StepsActivities, DaysSummary, Weight, Sleep, IntensityHR, MonitoringHeartRate
from garmindb import GarminConnectConfigManager

from fitfile import Sport, SubSport

from sqlalchemy import Column, Integer, Date, DateTime, text

LIFT_DATA_FILENAME = "lifting.csv"
LIFT_JSON_FILENAME = "lifting.json"

RUN_JSON_FILENAME = "run.json"
MMA_JSON_FILENAME = "mma.json"
YOGA_JSON_FILENAME = "yoga.json"

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

def get_running_stats(ts: datetime):
    running_stats = {}
    all_runs = Activities.get_by_sport(activities_db, "running")

    for run in all_runs:
        date = run.start_time.date().strftime('%Y-%m-%d') # TODO zero out hour, min, sec

        if date not in running_stats:
            running_stats[date] = []

        time = run.elapsed_time
        time = time.hour + time.minute / 60 + time.second / 3600

        run_stats = {
            "elapsed_time": time,
            "avg_speed": run.avg_speed, # TODO what is the unit on this
            "avg_hr": run.avg_hr,
            "max_hr": run.max_hr,
            "distance": run.distance,
            "calories": run.calories,
            # time in zones? -> not for now
        }
        running_stats[date].append(run_stats)
    return running_stats

def get_lifting_stats():
    lifting_stats = {}

    all_lifting = Activities.get_by_sport(activities_db, "fitness_equipment", subsport="strength_training")
    # TODO map date -> duration so we can easily pick up the value later
    lift_durations = {}
    for lift in all_lifting:
        date = lift.start_time.date().strftime('%Y-%m-%d') # TODO zero out hour, min, sec
        time = lift.elapsed_time
        time = time.hour + time.minute / 60 + time.second / 36000
        lift_durations[date] = time

    with open(LIFT_DATA_FILENAME) as f:
        labels = f.readline().strip('\n').split(',')[1:]
        while True:
            data = f.readline()
            if not data:
                break

            data = data.strip('\n').split(',')

            date = data[0]
            data = {k: (None if x == '' else float(x)) for k, x in zip(labels, data[1:])}

            try:
                data["duration"] = lift_durations[date]
            except:
                data["duration"] = 0

            lifting_stats[date] = [data]

    return lifting_stats

def get_mma_stats():
    mma_stats = {}

    # mma = mma + boxing + cardio (I've been using cardio for CKB)
    all_mma = Activities.get_by_sport(activities_db, "UnknownEnumValue_80")
    all_boxing = Activities.get_by_sport(activities_db, "boxing")
    all_cardio = Activities.get_by_sport(activities_db, "fitness_equipment", subsport="cardio_training")

    all_mma = all_mma + all_boxing + all_cardio

    for session in all_mma:
        date = session.start_time.date().strftime('%Y-%m-%d') # TODO zero out hour, min, sec

        if date not in mma_stats:
            mma_stats[date] = []

        time = session.elapsed_time
        time = time.hour + time.minute / 60 + time.second / 3600

        session_stats = {
            "duration": time,
            "calories": session.calories,
            "avg_hr": session.avg_hr,
            "max_hr": session.max_hr,
        }

        mma_stats[date].append(session_stats)

    return mma_stats

def get_yoga_stats():
    yoga_stats = {}

    all_yoga = Activities.get_by_sport(activities_db, "training", subsport="yoga")

    for yoga in all_yoga:
        date = yoga.start_time.date().strftime('%Y-%m-%d')

        if date not in yoga_stats:
            yoga_stats[date] = []

        time = yoga.elapsed_time
        time = time.hour + time.minute / 60 + time.second / 3600

        session_stats = {
            "duration": time,
            "calories": yoga.calories,
            "avg_hr": yoga.avg_hr,
            "max_hr": yoga.max_hr,
        }

        yoga_stats[date].append(session_stats)

    return yoga_stats

if __name__=="__main__":

    end_ts = datetime.now()

    # with open(LIFT_JSON_FILENAME, "w") as json_file:
    #     json.dump(get_lifting_stats(), json_file)

    # with open(RUN_JSON_FILENAME, "w") as json_file:
    #     json.dump(get_running_stats(end_ts), json_file)

    # with open(MMA_JSON_FILENAME, "w") as json_file:
    #     json.dump(get_mma_stats(), json_file)

    with open(YOGA_JSON_FILENAME, "w") as json_file:
        json.dump(get_yoga_stats(), json_file)

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
