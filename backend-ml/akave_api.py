import requests
import json

API_BASE_URL = "https://c57a-102-91-105-198.ngrok-free.app"

def listFiles(bucket_name):
    url = f"{API_BASE_URL}/buckets/{bucket_name}/files"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Failed to list files: {response.text}")

def downloadFile(bucket_name, file_name):
    url = f"{API_BASE_URL}/buckets/{bucket_name}/files/{file_name}/download"
    response = requests.get(url)
    if response.status_code == 200:
        try:
            return response.json()  # for patient JSON files
        except ValueError:
            return response.content  # for binary files like .h5
    else:
        raise Exception(f"Failed to download file: {response.text}")

def download_model(bucket_name, file_name, output_path):
    content = downloadFile(bucket_name, file_name)
    with open(output_path, "wb") as f:
        f.write(content)
    print(f"Downloaded {file_name} to {output_path}")


# python3 -m venv venv
# source venv/bin/activate
