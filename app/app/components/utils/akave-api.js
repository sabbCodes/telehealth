import axios from "axios";

const API_BASE_URL = "https://cb62-102-91-104-117.ngrok-free.app";

async function apiRequest(method, endpoint, data = null) {
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${endpoint}`,
      data,
    });
    return response.data;
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    throw error;
  }
}

export async function createBucket(bucketName) {
  return apiRequest("POST", "/buckets", { bucketName });
}

export async function uploadFile(bucketName, fileName, fileContent) {
  await ensureBucket(bucketName);
  const form = new FormData();
  const blob = new Blob([JSON.stringify(fileContent)], {
    type: "application/json",
  });
  form.append("file", blob, fileName);

  const response = await axios.post(
    `${API_BASE_URL}/buckets/${bucketName}/files`,
    form
  );
  return response.data; // { success: true, data: { RootCID: "..." } }
}

export async function downloadFile(bucketName, fileName) {
  const response = await axios.get(
    `${API_BASE_URL}/buckets/${bucketName}/files/${fileName}/download`,
    {
      responseType: "json",
    }
  );
  return response.data;
}

export async function listFiles(bucketName) {
  const response = await axios.get(
    `${API_BASE_URL}/buckets/${bucketName}/files`
  );
  return response.data.data; // Array of {Name, RootCID, ...}
}

export async function ensureBucket(bucketName) {
  try {
    const response = await axios.get(`${API_BASE_URL}/buckets`);
    const buckets = response.data.data || [];
    const bucketExists = buckets.some((b) => b.Name === bucketName);
    if (bucketExists) {
      console.log(`Bucket ${bucketName} already exists`);
      return;
    }
    await axios.post(`${API_BASE_URL}/buckets`, { bucketName });
    console.log(`Bucket ${bucketName} created`);
  } catch (error) {
    console.error(
      "Failed to ensure bucket:",
      error.response?.data || error.message
    );
    throw error; // Let the app handle it, but it won’t hit this now
  }
}
