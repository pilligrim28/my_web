// ===== DOM Elements =====
const modalOverlays = document.querySelectorAll('.modal-overlay');
const linkCards = document.querySelectorAll('.link-card');
const modalCloseButtons = document.querySelectorAll('.modal-close, .modal-close-btn');
const nextStepButtons = document.querySelectorAll('[data-next-step]');
const forms = document.querySelectorAll('form');
const toggleLinks = document.querySelectorAll('[data-toggle]');

// ===== Toggle Section Function =====
function toggleSection(sectionId, linkElement) {
    const section = document.getElementById(sectionId);
    const linkItem = linkElement.closest('.link-item');
    const allLinkItems = document.querySelectorAll('.link-item');
    
    // Close all other sections
    allLinkItems.forEach(item => {
        if (item !== linkItem) {
            item.classList.remove('active');
            const sec = item.querySelector('.expandable-section');
            if (sec) {
                sec.classList.add('hidden');
            }
        }
    });
    
    // Toggle current section
    if (section) {
        const isHidden = section.classList.contains('hidden');
        if (isHidden) {
            section.classList.remove('hidden');
            linkItem.classList.add('active');
            
            // Smooth scroll to section
            setTimeout(() => {
                section.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest' 
                });
            }, 50);
        } else {
            section.classList.add('hidden');
            linkItem.classList.remove('active');
        }
    }
}

// ===== Modal Functions =====
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Reset to first step
        resetModalSteps(modal);
    }
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function resetModalSteps(modal) {
    const steps = modal.querySelectorAll('.funnel-step');
    steps.forEach((step, index) => {
        if (index === 0) {
            step.classList.remove('hidden');
        } else {
            step.classList.add('hidden');
        }
    });
}

// ===== Event Listeners =====

// Link cards with data-modal attribute
linkCards.forEach(card => {
    const modalId = card.getAttribute('data-modal');
    if (modalId) {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(`modal-${modalId}`);
        });
    }
});

// Toggle links with data-toggle attribute
toggleLinks.forEach(link => {
    const sectionId = link.getAttribute('data-toggle');
    if (sectionId) {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            toggleSection(sectionId, link);
        });
    }
});

// Close buttons
modalCloseButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal-overlay');
        if (modal) {
            closeModal(modal);
        }
    });
});

// Click outside modal to close
modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal(overlay);
        }
    });
});

// ESC key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modalOverlays.forEach(overlay => {
            if (overlay.classList.contains('active')) {
                closeModal(overlay);
            }
        });
    }
});

// Next step buttons in funnel
nextStepButtons.forEach(button => {
    button.addEventListener('click', () => {
        const nextStep = button.getAttribute('data-next-step');
        const modal = button.closest('.modal-overlay');
        
        if (modal && nextStep) {
            // Hide all steps
            const steps = modal.querySelectorAll('.funnel-step');
            steps.forEach(step => step.classList.add('hidden'));
            
            // Show next step
            const nextStepEl = modal.querySelector(`[data-step="${nextStep}"]`);
            if (nextStepEl) {
                nextStepEl.classList.remove('hidden');
                nextStepEl.style.animation = 'none';
                setTimeout(() => {
                    nextStepEl.style.animation = '';
                }, 10);
            }
        }
    });
});

// ===== Form Submissions =====
forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const formType = form.getAttribute('data-form');
        
        // Validate form
        if (!validateForm(form)) {
            return;
        }
        
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Отправка...';
        submitButton.disabled = true;
        
        try {
            // Simulate API call (replace with actual endpoint)
            await submitFormData(data, formType);
            
            // Success handling
            handleFormSuccess(form, formType);
            
        } catch (error) {
            console.error('Form submission error:', error);
            showNotification('Произошла ошибка. Попробуйте ещё раз.', 'error');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
});

// ===== Form Validation =====
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#EF4444';
            
            // Shake animation
            input.style.animation = 'shake 0.5s';
            setTimeout(() => {
                input.style.animation = '';
            }, 500);
        } else {
            input.style.borderColor = '';
        }
    });
    
    // Email validation
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput && emailInput.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            isValid = false;
            emailInput.style.borderColor = '#EF4444';
            showNotification('Введите корректный email', 'error');
        }
    }
    
    // Phone validation (if provided)
    const phoneInput = form.querySelector('input[type="tel"]');
    if (phoneInput && phoneInput.value) {
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        if (!phoneRegex.test(phoneInput.value.replace(/\s/g, ''))) {
            isValid = false;
            phoneInput.style.borderColor = '#EF4444';
            showNotification('Введите корректный номер телефона', 'error');
        }
    }
    
    if (!isValid) {
        showNotification('Пожалуйста, заполните все обязательные поля', 'error');
    }
    
    return isValid;
}

// ===== Form Success Handler =====
function handleFormSuccess(form, formType) {
    const modal = form.closest('.modal-overlay');
    
    if (formType === 'lead-capture') {
        // Move to step 3 (thank you + bonus)
        const steps = modal.querySelectorAll('.funnel-step');
        steps.forEach(step => step.classList.add('hidden'));
        const step3 = modal.querySelector('[data-step="3"]');
        if (step3) {
            step3.classList.remove('hidden');
        }
        
        // Track conversion
        trackEvent('lead_captured', {
            form_type: formType
        });
        
    } else if (formType === 'consultation' || formType === 'consult-quick') {
        // Show success message
        showNotification('✅ Отлично! Я свяжусь с вами в ближайшее время', 'success');
        
        // Close modal after delay
        setTimeout(() => {
            if (modal) {
                closeModal(modal);
            }
        }, 2000);
        
        // Track conversion
        trackEvent('consultation_booked', {
            form_type: formType
        });
    }
}

// ===== Submit Form Data =====
// 
// ╔══════════════════════════════════════════════╗
// ║  КАК НАСТРОИТЬ ОТПРАВКУ ЗАЯВОК:             ║
// ║                                              ║
// ║  1. EMAIL: замените email в функции         ║
// ║     sendToEmail() (строка ~298)              ║
// ║                                              ║
// ║  2. TELEGRAM:                                ║
// ║     - Создайте бота через @BotFather         ║
// ║     - Узнайте chat_id через @userinfobot     ║
//      - Создайте Cloudflare Worker             ║
// ║     - Вставьте код из telegram-worker.js     ║
// ║     - Замените URL в sendToTelegram()        ║
// ║       (строка ~329)                          ║
// ║                                              ║
// ║  Подробности в DEPLOY.md                     ║
// ╚══════════════════════════════════════════════╝
// 
async function submitFormData(data, formType) {
    // 1. Отправка на Email через FormSubmit
    const emailPromise = sendToEmail(data);
    
    // 2. Отправка в Telegram через Cloudflare Worker
    const telegramPromise = sendToTelegram({ ...data, form_type: formType });
    
    // Ждём обе отправки
    const results = await Promise.allSettled([emailPromise, telegramPromise]);
    
    // Проверяем результаты
    const emailSuccess = results[0].status === 'fulfilled';
    const telegramSuccess = results[1].status === 'fulfilled' && results[1].value?.success;
    
    if (!emailSuccess && !telegramSuccess) {
        throw new Error('Все сервисы недоступны');
    }
    
    return { emailSuccess, telegramSuccess };
}

// ===== Send to Email (FormSubmit.co) =====
async function sendToEmail(data) {
    // ЗАМЕНИТЕ YOUR_EMAIL@example.com НА ВАШ EMAIL!
    const email = 'jobanikolaev@gmail.com';
    
    const response = await fetch(`https://formsubmit.co/ajax/${email}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            _subject: `🔔 Новая заявка с сайта - ${data.form_type || 'Консультация'}`,
            _template: 'table',
            _captcha: 'false',
            Имя: data.name || '',
            Email: data.email || '',
            Телефон: data.phone || '',
            Платформа: data.platform || '',
            Сообщение: data.message || '',
            'Тип формы': data.form_type || '',
            'Дата': new Date().toLocaleString('ru-RU')
        })
    });
    
    if (!response.ok) throw new Error('Email send failed');
    return await response.json();
}

// ===== Send to Telegram (Cloudflare Worker) =====
async function sendToTelegram(data) {
    // ЗАМЕНИТЕ НА URL ВАШЕГО CLOUDFLARE WORKER!
    const workerUrl = 'https://your-worker.workers.dev/send';
    
    const response = await fetch(workerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error('Telegram send failed');
    return await response.json();
}

// ===== Notification System =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '16px 24px',
        background: type === 'success' ? '#27c93f' : type === 'error' ? '#ff5f56' : '#89b4fa',
        color: '#1e1e2e',
        borderRadius: '6px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        zIndex: '2000',
        fontSize: '15px',
        fontWeight: '600',
        animation: 'slideDown 0.3s ease-out',
        maxWidth: '90%',
        textAlign: 'center',
        fontFamily: "'JetBrains Mono', monospace"
    });
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add notification animations to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// ===== Event Tracking (Analytics) =====
function trackEvent(eventName, data = {}) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, data);
    }
    
    // Yandex Metrika
    if (typeof ym !== 'undefined') {
        ym(XXXXXX, 'reachGoal', eventName);
    }
    
    // Console log for development
    console.log('📊 Event tracked:', eventName, data);
}

// ===== Input Focus Effects =====
const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');

formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
        input.parentElement.classList.remove('focused');
    });
    
    // Clear error on input
    input.addEventListener('input', () => {
        input.style.borderColor = '';
    });
});

// ===== Page Load Analytics =====
document.addEventListener('DOMContentLoaded', () => {
    // Track page view
    trackEvent('page_view', {
        page_title: document.title,
        page_location: window.location.href
    });
    
    // Track time on page
    let timeOnPage = 0;
    setInterval(() => {
        timeOnPage += 10;
        if (timeOnPage === 30) {
            trackEvent('time_on_page', { seconds: 30 });
        } else if (timeOnPage === 60) {
            trackEvent('time_on_page', { seconds: 60 });
        }
    }, 10000);
});

// ===== Smooth Scroll Polyfill (for older browsers) =====
if (!('scrollBehavior' in document.documentElement.style)) {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView();
            }
        });
    });
}

// ===== Service Worker Registration (for PWA capability) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable offline support
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('SW registered'))
        //     .catch(err => console.log('SW registration failed'));
    });
}

// ===== Export for testing =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        openModal,
        closeModal,
        validateForm,
        trackEvent,
        showNotification
    };
}
