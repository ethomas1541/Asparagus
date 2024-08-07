#fefac935-f11a-4342-87fc-59e8ee37995e

import requests
from PIL import Image
from io import BytesIO

# Define constants
API_KEY = "fefac935-f11a-4342-87fc-59e8ee37995e"
BASE_URL = "https://api4.thetvdb.com/v4"

def get_auth_token(api_key):
    url = f"{BASE_URL}/login"
    payload = {"apikey": api_key}
    headers = {"Content-Type": "application/json"}
    response = requests.post(url, json=payload, headers=headers)
    # Print response for debugging
    #print("Authentication Response:", response.json())
    if 'data' in response.json() and 'token' in response.json()['data']:
        return response.json()['data']['token']
    else:
        raise ValueError("Authentication failed: 'token' not found in the response")

def search_series(token, series_name):
    url = f"{BASE_URL}/search?query={series_name}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json"
    }
    response = requests.get(url, headers=headers)
    #print("Search Series Response:", response.json())  # Debug print
    return response.json()

def get_series_info(token, series_id):
    url = f"{BASE_URL}/series/{series_id}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json"
    }
    response = requests.get(url, headers=headers)
    #print("Series Info Response:", response.json())  # Debug print
    return response.json()

def get_episode_count(token, series_id):
    count = 0
    url = f"{BASE_URL}/series/{series_id}/episodes/absolute"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json"
}
    response = requests.get(url, headers=headers).json()
    if 'data' in response:
        if 'episodes' in response['data']:
            for e in response['data']['episodes']:
                count = count + 1
    return count

def display_thumbnail(image_url):
    response = requests.get(image_url)
    img = Image.open(BytesIO(response.content))
    img.show()

try:
    token = get_auth_token(API_KEY)
    series_name = "Southydfg park"
    search_results = search_series(token, series_name)

    if 'data' in search_results and search_results['data']:
        first_result = search_results['data'][0]
        series_id = first_result['tvdb_id']  # Use 'tvdb_id' to fetch series info
        series_info = get_series_info(token, series_id)
        
        if 'data' in series_info and 'image' in series_info['data']:
            thumbnail_url = series_info['data']['image']
            episode_count = get_episode_count(token, series_id)
            print(f"Series Name: {first_result['name']}")
            print(f"Episode Count: {episode_count}")
            print(f"Thumbnail URL: {thumbnail_url}")
            display_thumbnail(thumbnail_url)
        else:
            print("Series image not found.")
    else:
        print("Series not found.")
except ValueError as e:
    print(e)
except KeyError as e:
    print(f"Key error: {e}")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
