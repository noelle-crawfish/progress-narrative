#!/bin/sh

start_date="2021-03-21"

# cronometer (nutrition)
echo -n "Updating cronometer data... "
python -m cronometer.cronometer --start_date ${start_date}
echo "DONE"

# garmin (health)
# populate garmindb with new entries
echo -n "Downloading new data for garmindb..."
garmindb_cli.py --all --download --import --analyze --latest
echo "DONE"

# aggregate and format useful garmin data
echo -n "Formatting garmin data..."
python -m garmin.garmin --start_date ${start_date}
echo "DONE"



