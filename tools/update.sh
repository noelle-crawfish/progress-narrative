#!/bin/bash

# source .env/bin/activate

# toggl
cd toggl
python toggl_track.py
cp -r months ../../public/toggl/

# python update_db.py
# python make_groups.py

# cp menu_nodes.json ../progress-narrative/public/
# cp data.json ../progress-narrative/public/
