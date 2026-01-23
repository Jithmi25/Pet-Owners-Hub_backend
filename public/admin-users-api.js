// Admin User Management API Integration
// Base API URL - update this to match your backend server
const API_BASE_URL = 'http://localhost:5000/api/admin';

// Authentication token (should be stored securely in production)
let authToken = localStorage.getItem('adminToken') || '';

// API Helper Functions
const apiRequest = async (endpoint, options = {}) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // Add auth token if available
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// User Management Functions
const UserAPI = {
    // Get all users with filters
    getAllUsers: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return await apiRequest(`/users?${queryString}`);
    },

    // Get user by ID
    getUserById: async (userId) => {
        return await apiRequest(`/users/${userId}`);
    },

    // Create new user
    createUser: async (userData) => {
        return await apiRequest('/users', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    // Update user
    updateUser: async (userId, userData) => {
        return await apiRequest(`/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    },

    // Delete user
    deleteUser: async (userId) => {
        return await apiRequest(`/users/${userId}`, {
            method: 'DELETE'
        });
    },

    // Update user status
    updateUserStatus: async (userId, status) => {
        return await apiRequest(`/users/${userId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        });
    },

    // Reset user password
    resetPassword: async (userId, newPassword) => {
        return await apiRequest(`/users/${userId}/reset-password`, {
            method: 'PATCH',
            body: JSON.stringify({ newPassword })
        });
    },

    // Get user statistics
    getUserStats: async () => {
        return await apiRequest('/users/stats');
    },

    // Export users to CSV
    exportUsers: async (filters = {}) => {
        const queryString = new URLSearchParams(filters).toString();
        window.open(`${API_BASE_URL}/users/export?${queryString}`, '_blank');
    },

    // Bulk delete users
    bulkDelete: async (userIds) => {
        return await apiRequest('/users/bulk-delete', {
            method: 'POST',
            body: JSON.stringify({ userIds })
        });
    }
};

// Initialize page
document.addEventListener('DOMContentLoaded', async function() {
    // Load users on page load
    await loadUsers();

    // Setup event listeners
    setupEventListeners();

    // Load user statistics
    await loadUserStats();
});

// Load and display users
async function loadUsers(params = {}) {
    try {
        const response = await UserAPI.getAllUsers(params);
        
        if (response.success) {
            displayUsers(response.data.users);
            updatePagination(response.data.pagination);
        }
    } catch (error) {
        showError('Failed to load users: ' + error.message);
    }
}

// Display users in table
function displayUsers(users) {
    const tbody = document.querySelector('.users-table tbody');
    
    if (!users || users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No users found</td></tr>';
        return;
    }

    tbody.innerHTML = users.map(user => `
        <tr data-user-id="${user._id}">
            <td>${user._id.slice(-4)}</td>
            <td>${escapeHtml(user.name)}</td>
            <td>${escapeHtml(user.email)}</td>
            <td><span class="badge badge-${user.role.toLowerCase()}">${user.role}</span></td>
            <td class="status-${user.status.toLowerCase()}">${user.status}</td>
            <td>${formatDate(user.createdAt)}</td>
            <td>${user.lastLogin ? formatDate(user.lastLogin) : 'Never'}</td>
            <td>
                <span class="action-icon edit-icon" onclick="editUser('${user._id}')" title="Edit">✏️</span>
                <span class="action-icon delete-icon" onclick="deleteUser('${user._id}')" title="Delete">🗑️</span>
                ${user.status !== 'Active' ? 
                    `<span class="action-icon" onclick="activateUser('${user._id}')" title="Activate">✅</span>` : 
                    `<span class="action-icon" onclick="deactivateUser('${user._id}')" title="Deactivate">🚫</span>`
                }
            </td>
        </tr>
    `).join('');
}

// Edit user
async function editUser(userId) {
    try {
        const response = await UserAPI.getUserById(userId);
        
        if (response.success) {
            const user = response.data;
            
            // Populate edit modal (you'll need to create this modal similar to add modal)
            document.getElementById('editUserId').value = user._id;
            document.getElementById('editUserName').value = user.name;
            document.getElementById('editUserEmail').value = user.email;
            document.getElementById('editUserRole').value = user.role;
            document.getElementById('editUserStatus').value = user.status;
            
            // Show edit modal
            document.getElementById('editUserModal').style.display = 'block';
        }
    } catch (error) {
        showError('Failed to load user details: ' + error.message);
    }
}

// Delete user
async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        return;
    }

    try {
        const response = await UserAPI.deleteUser(userId);
        
        if (response.success) {
            showSuccess('User deleted successfully');
            await loadUsers();
        }
    } catch (error) {
        showError('Failed to delete user: ' + error.message);
    }
}

// Activate user
async function activateUser(userId) {
    try {
        const response = await UserAPI.updateUserStatus(userId, 'Active');
        
        if (response.success) {
            showSuccess('User activated successfully');
            await loadUsers();
        }
    } catch (error) {
        showError('Failed to activate user: ' + error.message);
    }
}

// Deactivate user
async function deactivateUser(userId) {
    if (!confirm('Are you sure you want to deactivate this user?')) {
        return;
    }

    try {
        const response = await UserAPI.updateUserStatus(userId, 'Inactive');
        
        if (response.success) {
            showSuccess('User deactivated successfully');
            await loadUsers();
        }
    } catch (error) {
        showError('Failed to deactivate user: ' + error.message);
    }
}

// Load user statistics
async function loadUserStats() {
    try {
        const response = await UserAPI.getUserStats();
        
        if (response.success) {
            const stats = response.data.summary;
            
            // Update stats display (you'll need to add these elements to your HTML)
            document.getElementById('totalUsersCount')?.textContent = stats.totalUsers;
            document.getElementById('activeUsersCount')?.textContent = stats.activeUsers;
            document.getElementById('adminsCount')?.textContent = stats.admins;
        }
    } catch (error) {
        console.error('Failed to load user stats:', error);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Add user form submission
    const addUserForm = document.getElementById('addUserForm');
    if (addUserForm) {
        addUserForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const userData = {
                name: document.getElementById('userName').value,
                email: document.getElementById('userEmail').value,
                password: document.getElementById('userPassword')?.value || 'defaultPassword123',
                role: document.getElementById('userRole').value,
                status: document.getElementById('userStatus').value
            };

            try {
                const response = await UserAPI.createUser(userData);
                
                if (response.success) {
                    showSuccess('User created successfully');
                    addUserForm.reset();
                    document.getElementById('addUserModal').style.display = 'none';
                    await loadUsers();
                }
            } catch (error) {
                showError('Failed to create user: ' + error.message);
            }
        });
    }

    // Search functionality
    const userSearch = document.getElementById('userSearch');
    if (userSearch) {
        let searchTimeout;
        userSearch.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                loadUsers({ search: this.value });
            }, 500);
        });
    }

    // Export users
    const exportBtn = document.getElementById('exportUsersBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            UserAPI.exportUsers();
        });
    }

    // Role and status filters
    const roleFilter = document.getElementById('roleFilter');
    if (roleFilter) {
        roleFilter.addEventListener('change', function() {
            const search = document.getElementById('userSearch')?.value || '';
            const status = document.getElementById('statusFilter')?.value || '';
            loadUsers({ search, role: this.value, status });
        });
    }

    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            const search = document.getElementById('userSearch')?.value || '';
            const role = document.getElementById('roleFilter')?.value || '';
            loadUsers({ search, role, status: this.value });
        });
    }
}

// Update pagination
function updatePagination(pagination) {
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer || !pagination) return;

    let paginationHtml = '';
    
    // Previous button
    if (pagination.hasPrevPage) {
        paginationHtml += `<div class="page-item" onclick="loadUsers({ page: ${pagination.currentPage - 1} })">←</div>`;
    }

    // Page numbers
    for (let i = 1; i <= pagination.totalPages; i++) {
        if (
            i === 1 || 
            i === pagination.totalPages || 
            (i >= pagination.currentPage - 2 && i <= pagination.currentPage + 2)
        ) {
            paginationHtml += `
                <div class="page-item ${i === pagination.currentPage ? 'active' : ''}" 
                     onclick="loadUsers({ page: ${i} })">
                    ${i}
                </div>
            `;
        } else if (
            i === pagination.currentPage - 3 || 
            i === pagination.currentPage + 3
        ) {
            paginationHtml += '<div class="page-item disabled">...</div>';
        }
    }

    // Next button
    if (pagination.hasNextPage) {
        paginationHtml += `<div class="page-item" onclick="loadUsers({ page: ${pagination.currentPage + 1} })">→</div>`;
    }

    paginationContainer.innerHTML = paginationHtml;
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'error');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
    .badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
        text-transform: uppercase;
    }
    .badge-user { background: #e3f2fd; color: #1976d2; }
    .badge-admin { background: #f3e5f5; color: #7b1fa2; }
    .badge-moderator { background: #fff3e0; color: #f57c00; }
`;
document.head.appendChild(style);
