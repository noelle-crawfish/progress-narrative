#!/usr/bin/env python3

import json

garmin, cronometer = None, None

with open("./garmin/garmin_health.json") as garmin_file:
    garmin = json.load(garmin_file)

with open("./cronometer.json") as cronometer_file:
    cronometer = json.load(cronometer_file)

select_menu = {
    "Health":{
        "Heart Rate":{
            "Resting HR (bpm)":{},
            "Min. HR (bpm)":{},
            "Max. HR (bpm)":{}
        }
    },
    "Nutrition":{
        "Calories":{
            "Calories Consumed (kcal)":{}, # consumed
            "Calories Burned (kcal)":{}, # via garmin
            "Net Calories":{}
        },
        "Protein":{
            "Protein (g)":{},
            "Cystine (g)":{},
            "Histidine (g)":{},
            "Isoleucine (g)":{},
            "Leucine (g)":{},
            "Lysine (g)":{},
            "Methionine (g)":{},
            "Phenylalanine (g)":{},
            "Threonine (g)":{},
            "Tryptophan (g)":{},
            "Tyrosine (g)":{},
            "Valine (g)":{}
        },
        "Carbohydrates":{
            "Carbs (g)":{},
            "Fiber (g)":{},
            "Starch (g)":{},
            "Sugars (g)":{},
            "Added Sugars (g)":{},
            "Net Carbs (g)":{}
        },
        "Lipids":{
            "Fat (g)":{},
            "Monosaturated (g)":{},
            "Polysaturated (g)":{},
            "Omega-3 (g)":{},
            "Omega-6 (g)":{},
            "Saturated (g)":{},
            "Trans-Fats (g)":{},
            "Cholesterol (g)":{}
        },
        "Vitamins":{ # TODO
        },
        "Minerals":{ # TODO
        },
        "Alcohol (g)":{
        },
        "Caffine (g)":{
        }
    },
    "Activities":{
        "Time Tracking":{
            "Productive Min.":{},
            "Leisure Min.":{}
        }
    }
}


with open("menu_nodes.json", "w") as menu_nodes:
    json.dump(select_menu, menu_nodes)
