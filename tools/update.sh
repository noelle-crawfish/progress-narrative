#!/bin/bash

source .env/bin/activate

python update_db.py
python make_groups.py

cp menu_nodes.json ../progress-narrative/public/
cp data.json ../progress-narrative/public/
