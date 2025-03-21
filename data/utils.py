import json

SECRETS = "secrets.json"

def get_secrets(app_name: str) -> (str, str):
    with open(SECRETS, "r") as secrets:
        secrets_db = json.load(secrets)
        app_secrets = secrets_db[app_name]

        return app_secrets["username"], app_secrets["password"]
