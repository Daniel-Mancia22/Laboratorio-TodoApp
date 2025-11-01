const API_BASE_URL = '/api';

class api {
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                ...options,
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            if (response.status !== 204) {
                return await response.json();
            }
            return null;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async getTasks() {
        return this.request('/tasks');
    }

    async createTask(title) {
        return this.request('/tasks', {
            method: 'POST',
            body: JSON.stringify({ title }),
        });
    }

    async updateTask(id, updates) {
        return this.request(`/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    }

    async deleteTask(id) {
        return this.request(`/tasks/${id}`, {
            method: 'DELETE',
        });
    }

    async healthCheck() {
        return this.request('/health');
    }
}

export default new api();
