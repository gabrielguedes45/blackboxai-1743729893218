// Form Validation
document.addEventListener('DOMContentLoaded', function() {
    // Login Form Validation
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (!validateEmail(email)) {
                showToast('Por favor, insira um e-mail válido', 'error');
                return;
            }
            
            if (password.length < 6) {
                showToast('A senha deve ter pelo menos 6 caracteres', 'error');
                return;
            }
            
            // Simulate login (in a real app, this would be an API call)
            showToast('Login realizado com sucesso!', 'success');
            setTimeout(() => {
            // Verifica se é admin e redireciona
            const isAdmin = email === 'admin@almoxarifado.com';
            window.location.href = isAdmin ? 'admin-dashboard.html' : 'client-dashboard.html';
            }, 1500);
        });
    }
});

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