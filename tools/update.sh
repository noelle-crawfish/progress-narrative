#!/bin/bash

source .env/bin/activate

# toggl
cd toggl
python toggl_track.py
cp -r months ../../public/toggl/
cd ..

# garmin
garmindb_cli.py --all --download --import --analyze --latest
cd garmin
python garmin.py
cp garmin.json ../../public/garmin.json
cd ..

# cronometer
cd cronometer
python cronometer.py
cp cronometer.json ../../public/cronometer.json
cd ..

# python update_db.py
# python make_groups.py

# cp menu_nodes.json ../progress-narrative/public/
# cp data.json ../progress-narrative/public/
