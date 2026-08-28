import requests

url = "http://localhost:8000/api/decision"
payload = {
    "data": {
        "currentPrice": "24",
        "expectedPrice": "30",
        "distance": "45",
        "storageCost": "2",
        "storageAvailable": "Yes",
        "tempHumidity": "30°C / 60%"
    }
}
try:
    res = requests.post(url, json=payload, timeout=5)
    print(res.status_code)
    print(res.json())
except Exception as e:
    print(e)
