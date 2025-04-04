// Configurações de autenticação
const AUTH_CONFIG = {
    ADMIN_EMAIL: 'admin@almoxarifado.com',
    ADMIN_PASSWORD: 'admin123'
};

// Validação de formulário
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            
            if (!validateEmail(email)) {
                showToast('Por favor, insira um e-mail válido', 'error');
                return;
            }
            
            if (password.length < 6) {
                showToast('A senha deve ter pelo menos 6 caracteres', 'error');
                return;
            }
            
            // Simula autenticação
            authenticateUser(email, password);
        });
    }
});

// Função de autenticação centralizada
function authenticateUser(email, password) {
    showToast('Login realizado com sucesso!', 'success');
    
    setTimeout(() => {
        const isAdmin = email === AUTH_CONFIG.ADMIN_EMAIL && 
                       password === AUTH_CONFIG.ADMIN_PASSWORD;
        window.location.href = isAdmin ? 'admin-dashboard.html' : 'client-dashboard.html';
    }, 1500);
}

// ... (mantém as outras funções existentes sem alterações)

// Helper Functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Toast Notification System
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white ${
        type === 'error' ? 'bg-red-500' : 
        type === 'success' ? 'bg-green-500' : 'bg-blue-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Modal System
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Initialize modals
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-close') || 
        e.target.classList.contains('modal-overlay')) {
        const modal = e.target.closest('.modal');
        if (modal) {
            closeModal(modal.id);
        }
    }
});

// Inventory Management System
let inventory = [];

// Load inventory from localStorage or API
function loadInventory() {
    // In a real app, this would fetch from an API
    const savedInventory = localStorage.getItem('inventory');
    if (savedInventory) {
        inventory = JSON.parse(savedInventory);
        renderInventoryTable();
    } else {
        // Sample data for demo
        inventory = [
            {
                id: '1',
                name: 'Kit de Ferramentas',
                category: 'tools',
                status: 'available',
                quantity: 5,
                lastUpdated: new Date().toISOString(),
                image: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg'
            }
        ];
        saveInventory();
    }
}

// Add new item
document.getElementById('addItemForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newItem = {
        id: Date.now().toString(),
        name: document.getElementById('addItemName').value,
        quantity: parseInt(document.getElementById('addItemQuantity').value),
        status: document.getElementById('addItemStatus').value,
        category: document.getElementById('addItemCategory').value,
        details: document.getElementById('addItemDetails').value,
        lastUpdated: new Date().toISOString(),
        image: 'default-item.jpg'
    };
    
    inventory.push(newItem);
    saveInventory();
    closeModal('addItemModal');
    this.reset();
});

// Save inventory to localStorage
function saveInventory() {
    localStorage.setItem('inventory', JSON.stringify(inventory));
    renderInventoryTable();
    updateDashboardMetrics();
}

// Render inventory table
function renderInventoryTable() {
    const tbody = document.getElementById('itemsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    inventory.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="flex items-center">
                <img src="${item.image || 'default-item.jpg'}" 
                     class="h-10 w-10 rounded-full object-cover mr-3" alt="${item.name}">
                <span>${item.name}</span>
            </td>
            <td>${translateCategory(item.category)}</td>
            <td><span class="badge ${getStatusClass(item.status)}">${translateStatus(item.status)}</span></td>
            <td>${item.quantity}</td>
            <td>${new Date(item.lastUpdated).toLocaleDateString()}</td>
            <td>
                <div class="flex gap-2">
                    <button onclick="openEditModal('${item.id}')" class="p-1 text-blue-600 hover:text-blue-800">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteItem('${item.id}')" class="p-1 text-red-600 hover:text-red-800">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Helper functions
function translateCategory(category) {
    const categories = {
        tools: 'Ferramentas',
        equipment: 'Equipamentos',
        materials: 'Materiais'
    };
    return categories[category] || category;
}

function translateStatus(status) {
    const statuses = {
        available: 'Disponível',
        borrowed: 'Emprestado',
        maintenance: 'Manutenção'
    };
    return statuses[status] || status;
}

function getStatusClass(status) {
    const classes = {
        available: 'badge-success',
        borrowed: 'badge-warning',
        maintenance: 'badge-danger'
    };
    return classes[status] || '';
}

// Open edit modal with item data
function openEditModal(itemId) {
    const item = inventory.find(i => i.id === itemId);
    if (item) {
        document.getElementById('editItemId').value = item.id;
        document.getElementById('editItemName').value = item.name;
        document.getElementById('editItemQuantity').value = item.quantity;
        document.getElementById('editItemStatus').value = item.status;
        document.getElementById('editItemCategory').value = item.category;
        openModal('editItemModal');
    }
}

// Save edited item
document.getElementById('editItemForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const itemId = document.getElementById('editItemId').value;
    const item = inventory.find(i => i.id === itemId);
    
    if (item) {
        item.name = document.getElementById('editItemName').value;
        item.quantity = parseInt(document.getElementById('editItemQuantity').value);
        item.status = document.getElementById('editItemStatus').value;
        item.category = document.getElementById('editItemCategory').value;
        item.lastUpdated = new Date().toISOString();
        
        saveInventory();
        closeModal('editItemModal');
    }
});

// Delete item
function deleteItem(itemId) {
    if (confirm('Tem certeza que deseja remover este item?')) {
        inventory = inventory.filter(item => item.id !== itemId);
        saveInventory();
    }
}

// Update dashboard metrics
function updateDashboardMetrics() {
    const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
    const pendingRequests = requests.filter(r => r.status === 'pending').length;
    const activeLoans = requests.filter(r => r.status === 'approved').length;
    
    // Update metrics cards
    if (document.getElementById('totalItems')) {
        document.getElementById('totalItems').textContent = totalItems;
        document.getElementById('pendingRequests').textContent = pendingRequests;
        document.getElementById('activeLoans').textContent = activeLoans;
    }
    
    // Update recent requests table
    if (document.getElementById('recentRequestsTable')) {
        renderRecentRequests();
    }
    
    // Update low stock items
    if (document.getElementById('lowStockItems')) {
        renderLowStockItems();
    }
}

// Render recent requests
function renderRecentRequests() {
    const tbody = document.getElementById('recentRequestsTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // Get 5 most recent requests
    const recentRequests = [...requests]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
    
    recentRequests.forEach(request => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${request.itemName}</td>
            <td>${formatDate(request.startDate)}</td>
            <td><span class="badge ${getRequestStatusClass(request.status)}">
                ${translateRequestStatus(request.status)}
            </span></td>
            <td>
                <button onclick="showRequestDetails('${request.id}')" 
                        class="text-blue-600 hover:text-blue-800">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Render low stock items
function renderLowStockItems() {
    const container = document.getElementById('lowStockItems');
    if (!container) return;
    
    container.innerHTML = '';
    
    const lowStockItems = inventory.filter(item => item.quantity < 3);
    
    if (lowStockItems.length === 0) {
        container.innerHTML = '<p class="text-gray-500">Nenhum item com estoque baixo</p>';
        return;
    }
    
    lowStockItems.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'flex justify-between items-center p-3 bg-yellow-50 rounded-lg';
        itemEl.innerHTML = `
            <div class="flex items-center">
                <img src="${item.image || 'default-item.jpg'}" 
                     class="h-8 w-8 rounded-full object-cover mr-3" alt="${item.name}">
                <span>${item.name}</span>
            </div>
            <span class="font-medium text-yellow-700">${item.quantity} restantes</span>
        `;
        container.appendChild(itemEl);
    });
}

// Client Dashboard Functions
function loadAvailableItems() {
    const availableItems = inventory.filter(item => 
        item.status === 'available' && item.quantity > 0
    );
    renderAvailableItemsTable(availableItems);
}

function renderAvailableItemsTable(items) {
    const tbody = document.getElementById('availableItemsTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="flex items-center">
                <img src="${item.image || 'default-item.jpg'}" 
                     class="h-10 w-10 rounded-full object-cover mr-3" alt="${item.name}">
                <span>${item.name}</span>
            </td>
            <td>${translateCategory(item.category)}</td>
            <td>${item.quantity}</td>
            <td>
                <button onclick="prepareRequest('${item.id}')" 
                        class="btn-primary px-3 py-1 text-sm">
                    Solicitar
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Request Management
let requests = JSON.parse(localStorage.getItem('requests')) || [];

function prepareRequest(itemId) {
    const item = inventory.find(i => i.id === itemId);
    if (item) {
        document.getElementById('requestItemId').value = item.id;
        document.getElementById('requestItemName').value = item.name;
        document.getElementById('requestQuantity').max = item.quantity;
        openModal('requestModal');
    }
}

document.getElementById('requestForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const request = {
        id: Date.now().toString(),
        itemId: document.getElementById('requestItemId').value,
        itemName: document.getElementById('requestItemName').value,
        startDate: document.getElementById('requestStartDate').value,
        endDate: document.getElementById('requestEndDate').value,
        quantity: parseInt(document.getElementById('requestQuantity').value),
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    requests.push(request);
    localStorage.setItem('requests', JSON.stringify(requests));
    
    showToast('Solicitação enviada com sucesso!', 'success');
    closeModal('requestModal');
    loadUserRequests();
});

function loadUserRequests() {
    // In a real app, filter by current user
    renderRequestsTable(requests);
}

function renderRequestsTable(userRequests) {
    const tbody = document.getElementById('myRequestsTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    userRequests.forEach(request => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${request.itemName}</td>
            <td><span class="badge ${getRequestStatusClass(request.status)}">
                ${translateRequestStatus(request.status)}
            </span></td>
            <td>${formatDate(request.startDate)}</td>
            <td>${formatDate(request.endDate)}</td>
            <td>
                <button onclick="showRequestDetails('${request.id}')" 
                        class="text-blue-600 hover:text-blue-800">
                    <i class="fas fa-info-circle"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showRequestDetails(requestId) {
    const request = requests.find(r => r.id === requestId);
    if (request) {
        document.getElementById('detailItemName').textContent = request.itemName;
        document.getElementById('detailStatus').textContent = translateRequestStatus(request.status);
        document.getElementById('detailStatus').className = `badge ${getRequestStatusClass(request.status)}`;
        document.getElementById('detailStartDate').textContent = formatDate(request.startDate);
        document.getElementById('detailEndDate').textContent = formatDate(request.endDate);
        document.getElementById('detailQuantity').textContent = request.quantity;
        openModal('requestDetailsModal');
    }
}

function translateRequestStatus(status) {
    const statuses = {
        pending: 'Pendente',
        approved: 'Aprovado',
        rejected: 'Recusado',
        returned: 'Devolvido'
    };
    return statuses[status] || status;
}

function getRequestStatusClass(status) {
    const classes = {
        pending: 'badge-warning',
        approved: 'badge-success',
        rejected: 'badge-danger',
        returned: 'badge-info'
    };
    return classes[status] || '';
}

function formatDate(dateString) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
}

// Search and Filter
document.getElementById('itemSearch')?.addEventListener('input', function(e) {
    filterAvailableItems();
});

document.getElementById('categoryFilter')?.addEventListener('change', function(e) {
    filterAvailableItems();
});

function filterAvailableItems() {
    const searchTerm = document.getElementById('itemSearch').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    
    let filteredItems = inventory.filter(item => 
        item.status === 'available' && item.quantity > 0
    );
    
    if (searchTerm) {
        filteredItems = filteredItems.filter(item => 
            item.name.toLowerCase().includes(searchTerm)
        );
    }
    
    if (categoryFilter) {
        filteredItems = filteredItems.filter(item => 
            item.category === categoryFilter
        );
    }
    
    renderAvailableItemsTable(filteredItems);
}

// Initialize inventory on page load
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('itemsTableBody')) {
        loadInventory();
    }
    if (document.getElementById('availableItemsTable')) {
        loadInventory();
        loadAvailableItems();
        loadUserRequests();
    }
});
