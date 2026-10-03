const API_BASE_URL = 'http://localhost:8000';

export async function loginUser(endpoint, username, password) {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/X-www-form-urlencoded',
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}