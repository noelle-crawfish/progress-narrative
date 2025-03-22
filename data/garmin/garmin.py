
import argparse
import sqlite3

DB_PATH_PREFIX = "/home/noelle/HealthData/DBs"

def get_sleep_stats(cur: sqlite3.Cursor) -> dict:
    sleep_stats = {}

    res = cur.execute("SELECT * FROM sleep")
    for entry in res.fetchall():
        entry_dict = dict(entry)
        day = entry_dict["day"]
        del entry_dict["day"]
        sleep_stats[day] = entry_dict
    return sleep_stats

def get_daily_stats(cur: sqlite3.Cursor) -> dict:
    daily_stats = {}

    keys = [
        "day",

        # heart rate
        "hr_min",
        "hr_max",
        "rhr",

        # daily movement
        "steps",
        "floors_up",
        "distance",

        # intensity minutes
        "moderate_activity_time",
        "vigorous_activity_time",

        # calories
        "calories_bmr",
        "calories_active",

        # wellness
        "bb_max", 
        "bb_min",
        "stress_avg"
    ]
    key_str = ",".join(keys)

    res = cur.execute(f"SELECT {key_str} from daily_summary")
    for entry in res.fetchall():
        entry_dict = dict(entry)
        day = entry_dict["day"]
        del entry_dict["day"]
        daily_stats[day] = entry_dict

    # add weight
    res = cur.execute("SELECT * from weight")
    for entry in res.fetchall():
        entry_dict = dict(entry)
        daily_stats[day]["weight"] = entry_dict["weight"]  # it's fine that this will be missing sometimes

    return daily_stats

def get_strength_stats():
    pass

if __name__=="__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--start_date", type=str, required=True)
    args = parser.parse_args()
    
    # daily summary (steps, rhr, calories, ...), sleep, weight, stress
    garmindb = sqlite3.connect(f"{DB_PATH_PREFIX}/garmin.db")
    garmindb.row_factory = sqlite3.Row
    garmindb_cur = garmindb.cursor()

    # tracked activities
    activitydb = sqlite3.connect(f"{DB_PATH_PREFIX}/garmin_activities.db")
    activitydb_cur = activitydb.cursor()

    # other available db, but not necessary, repeated info from those above
    # monitoringdb = sqlite3.connect(f"{DB_PATH_PREFIX}/garmin_monitoring.db")
    # garminsummarydb = sqlite3.connect(f"{DB_PATH_PREFIX}/garmin_summary.db")
    # summarydb = sqlite3.connect(f"{DB_PATH_PREFIX}/summary.db")

    # sleep_stats = get_sleep_stats(garmindb_cur)
    # daily_stats = get_daily_stats(garmindb_cur)



