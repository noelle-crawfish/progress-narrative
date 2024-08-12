#!/usr/bin/env python3

import json
import requests

from datetime import datetime

SECRETS_FILE = "../secrets.json"
OUTPUT_FILE = "ynab.json"

url = "https://api.ynab.com/v1"

with open(SECRETS_FILE) as secrets:
    api_token = json.load(secrets)["ynab"]["api-token"]

headers = {"Authorization": f"Bearer {api_token}"}

def get_budget_id(budget_name: str):
    budgets = requests.get(f"{url}/budgets", headers=headers).json()
    budgets = budgets['data']['budgets']

    for budget in budgets:
        if budget['name'] == budget_name:
            return budget['id']

    print(f"ERROR: Could not find budget {budget_name}.")
    return -1

def get_monthly_stats(month: int, year: int, budget_id: str):
    data = requests.get(f"{url}/budgets/{budget_id}/months/{year}-{month}-01", headers=headers).json()['data']['month']

    stats = {}
    stats["income"] = data["income"]
    stats["budgeted"] = data["budgeted"]

    stats["categories"] = {}
    for category in data["categories"]:
        name = category["name"]

        ignore = ["BoA Credit Card", "Venture X Card", "Inflow: Ready to Assign"]
        if category["hidden"] or name in ignore:
            continue

        budgeted = category["budgeted"] # going to use this as spending, since it's money that went towards the catagory

        stats["categories"][name] = {
            "budgeted": budgeted,
        }

    return stats

if __name__=="__main__":
    budget_id = get_budget_id("My Budget")

    data = {} # by year

    now = datetime.now()

    for year in range(2024, now.year + 1):
        data[year] = {}
        for month in range(1, 12 + 1):
            monthly_stats = get_monthly_stats(month=month, year=year, budget_id=budget_id)
            data[year][month] = monthly_stats

            if year == now.year and month == now.month:
                break

    with open(OUTPUT_FILE, "w") as json_file:
        json.dump(data, json_file)
