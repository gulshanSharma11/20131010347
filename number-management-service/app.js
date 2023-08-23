from flask import Flask, request, jsonify
import requests
import gevent
from gevent import monkey

monkey.patch_all()

app = Flask(__name__)

def fetch_data(url):
    try:
        response = requests.get(url, timeout=2)
        if response.status_code == 200:
            data = response.json()
            return data.get("numbers", [])
    except Exception as e:
        print(f"Error fetching data from {url}: {e}")
    return []

@app.route('/numbers', methods=['GET'])
def get_numbers():
    urls = request.args.getlist('url')
    
    results = []
    jobs = [gevent.spawn(fetch_data, url) for url in urls]
    gevent.joinall(jobs, timeout=0.5)
    
    for job in jobs:
        result = job.value
        if result:
            results.extend(result)

    results = list(set(results))
    results.sort()

    return jsonify({"numbers": results})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8008)
