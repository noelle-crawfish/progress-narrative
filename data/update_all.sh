#!/bin/sh

start_date="2021-03-21"

# cronometer (nutrition)
echo -n "Updating cronometer data... "
python -m cronometer.cronometer --start_date ${start_date}
echo "DONE"

# garmin (health)
