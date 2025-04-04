// Estrutura de dados para solicitações de empréstimo
let LOAN_REQUESTS = [];

// Configurações de autenticação
const AUTH_CONFIG = {
    ADMIN_EMAIL: 'admin@almoxarifado.com',
    ADMIN_PASSWORD: 'admin123',
    USER_EMAIL: 'usuario@almoxarifado.com', 
    USER_PASSWORD: 'user123'
};

// Dados de exemplo do estoque
let INVENTORY_DATA = [
    {
        id: 1,
        name: 'Peneira 0,100mm',
        category: 'materials',
        status: 'available',
        quantity: 10,
        details: 'Peneira de aço 0,100mm para uso geral',
        lastUpdated: '2025-04-03'
    }
];

// Gerador de ID
function generateId() {
    return INVENTORY_DATA.length > 0 
        ? Math.max(...INVENTORY_DATA.map(i => i.id)) + 1
        : 1;
}

// Função para mostrar mensagens
function showAlert(message) {
    alert(message);
}

// Funções para gerenciar o estoque
function saveEditedItem(e) {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('editItemId').value);
    const item = INVENTORY_DATA.find(i => i.id === id);
    if (!item) return;
    
    // Atualiza os dados do item
    item.name = document.getElementById('editItemName').value;
    item.quantity = parseInt(document.getElementById('editItemQuantity').value);
    item.status = document.getElementById('editItemStatus').value;
    item.category = document.getElementById('editItemCategory').value;
    item.details = document.getElementById('editItemDetails').value;
    item.lastUpdated = new Date().toISOString().split('T')[0];
    
    // Fecha o modal e atualiza a tabela
    document.getElementById('editItemModal').classList.add('hidden');
    populateItemsTable();
    showAlert('Item atualizado com sucesso!');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// Funções para gerenciar solicitações
function openRequestModal(itemId, itemName) {
    document.getElementById('requestItemId').value = itemId;
    document.getElementById('requestItemName').value = itemName;
    document.getElementById('requestModal').classList.remove('hidden');
}

function submitLoanRequest(e) {
    e.preventDefault();
    
    const request = {
        id: Date.now(),
        itemId: parseInt(document.getElementById('requestItemId').value),
        itemName: document.getElementById('requestItemName').value,
        userName: 'Usuário Teste',
        startDate: document.getElementById('requestStartDate').value,
        endDate: document.getElementById('requestEndDate').value,
        quantity: parseInt(document.getElementById('requestQuantity').value),
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    LOAN_REQUESTS.push(request);
    document.getElementById('requestModal').classList.add('hidden');
    document.getElementById('requestForm').reset();
    showAlert('Solicitação enviada com sucesso!');
}

function populatePendingRequests() {
    const tableBody = document.getElementById('recentRequestsTable');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    
    LOAN_REQUESTS.filter(r => r.status === 'pending').forEach(request => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${request.userName}</td>
            <td>${request.itemName}</td>
            <td>${request.startDate}</td>
            <td><span class="status-badge status-active">Pendente</span></td>
            <td>
                <button onclick="approveRequest(${request.id})" class="text-green-600 hover:text-green-800 mr-2">
                    <i class="fas fa-check"></i>
                </button>
                <button onclick="rejectRequest(${request.id})" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-times"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function approveRequest(requestId) {
    const request = LOAN_REQUESTS.find(r => r.id === requestId);
    if (request) {
        request.status = 'approved';
        populatePendingRequests();
        showAlert('Solicitação aprovada com sucesso!');
    }
}

function rejectRequest(requestId) {
    const request = LOAN_REQUESTS.find(r => r.id === requestId);
    if (request) {
        request.status = 'rejected';
        populatePendingRequests();
        showAlert('Solicitação rejeitada!');
    }
}

function populateUserRequests() {
    const tableBody = document.getElementById('myRequestsTable');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    
    LOAN_REQUESTS.filter(r => r.userName === 'Usuário Teste').forEach(request => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${request.itemName}</td>
            <td><span class="status-badge ${
                request.status === 'approved' ? 'status-active' : 
                request.status === 'rejected' ? 'status-inactive' : 'status-pending'
            }">
                ${request.status === 'approved' ? 'Aprovado' : 
                 request.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
            </span></td>
            <td>${request.startDate}</td>
            <td>${request.endDate}</td>
            <td>
                <button onclick="showRequestDetails(${request.id})" class="text-blue-600 hover:text-blue-800">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function showRequestDetails(requestId) {
    const request = LOAN_REQUESTS.find(r => r.id === requestId);
    if (!request) return;

    document.getElementById('detailItemName').textContent = request.itemName;
    document.getElementById('detailStatus').textContent = 
        request.status === 'approved' ? 'Aprovado' : 
        request.status === 'rejected' ? 'Rejeitado' : 'Pendente';
    document.getElementById('detailStatus').className = `badge ${
        request.status === 'approved' ? 'status-active' : 
        request.status === 'rejected' ? 'status-inactive' : 'status-pending'
    }`;
    document.getElementById('detailStartDate').textContent = request.startDate;
    document.getElementById('detailEndDate').textContent = request.endDate;
    document.getElementById('detailQuantity').textContent = request.quantity;

    document.getElementById('requestDetailsModal').classList.remove('hidden');
}

function populateItemsTable() {
    const tableBody = document.getElementById('itemsTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    
    INVENTORY_DATA.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.category === 'tools' ? 'Ferramentas' : 
                 item.category === 'equipment' ? 'Equipamentos' : 'Materiais'}</td>
            <td><span class="status-badge ${item.status === 'available' ? 
                'status-active' : 'status-inactive'}">
                ${item.status === 'available' ? 'Disponível' : 
                 item.status === 'borrowed' ? 'Emprestado' : 'Manutenção'}
            </span></td>
            <td>${item.quantity}</td>
            <td>${item.lastUpdated}</td>
            <td>
                <button onclick="editItem(${item.id})" class="text-blue-600 hover:text-blue-800 mr-2">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteItem(${item.id})" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Validação de formulário
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            // Validação básica
            if (!email || !password) {
                showAlert('Por favor, preencha todos os campos');
                return;
            }

            // Autenticação
            if (email === AUTH_CONFIG.ADMIN_EMAIL && 
                password === AUTH_CONFIG.ADMIN_PASSWORD) {
                window.location.href = 'admin-dashboard.html';
            } else if (email === AUTH_CONFIG.USER_EMAIL && 
                      password === AUTH_CONFIG.USER_PASSWORD) {
                window.location.href = 'client-dashboard.html';
            } else {
                showAlert('Credenciais inválidas');
            }
        });
    }

    // Popula tabelas quando a página carrega
    if (document.getElementById('itemsTableBody')) {
        populateItemsTable();
    }
    
    // Popula itens disponíveis no painel do cliente
    if (document.getElementById('availableItemsTable')) {
        const tableBody = document.getElementById('availableItemsTable');
        tableBody.innerHTML = '';
        
        INVENTORY_DATA.filter(item => item.status === 'available').forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.category === 'tools' ? 'Ferramentas' : 
                     item.category === 'equipment' ? 'Equipamentos' : 'Materiais'}</td>
                <td>${item.quantity}</td>
                <td>
                    <button onclick="openRequestModal(${item.id}, '${item.name}')" class="btn-primary py-1 px-3 text-sm">
                        Solicitar
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
});
