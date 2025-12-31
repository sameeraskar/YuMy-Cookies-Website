const CONFIG = {
    // Replace this URL with your deployed Google Apps Script web app URL
    FORM_SUBMIT_URL: 'https://script.google.com/macros/s/AKfycbzs2fgVo2kfusz10hIIg3aXsNKDJXr4LhOzjBWpSqdfyG2ygLwxNxc8kioPETJl3zI3/exec',
    DELIVERY_FEE_PER_MILE: 0.60
};

const ALLOWED_ZIPS = new Set([
    '75069', '75070', '75071', '75072', '75454', '75033', '75034', '75035', '75002', '75013', '75023', '75024', '75025', '75074', '75075', '75093', '75094', '75078', '75409', '75454', '75009', '75068', '75056', '75069'
]);

let form, submitBtn, messageDiv;
let formElements = {};

function initializeForm() {
    form = document.getElementById('order-form');
    submitBtn = document.getElementById('submit-btn');
    messageDiv = document.getElementById('form-message');

    formElements = {
        name: document.getElementById('name'),
        phone: document.getElementById('phone'),
        email: document.getElementById('email'),
        zip: document.getElementById('zip'),
        address: document.getElementById('address'),
        pickup: document.getElementById('pickup'),
        quantity: document.getElementById('quantity'),
        orderDetails: document.getElementById('order-details'),
        notes: document.getElementById('notes'),
        honeypot: document.querySelector('input[name="honeypot"]')
    };

    setupEventListeners();
}

function setupEventListeners() {
    form.addEventListener('submit', handleFormSubmit);

    formElements.zip.addEventListener('input', handleZipInput);
    formElements.zip.addEventListener('blur', validateZip);

    formElements.quantity.addEventListener('input', validateQuantity);
    formElements.quantity.addEventListener('blur', validateQuantity);

    formElements.phone.addEventListener('input', formatPhoneNumber);
}

function handleZipInput(e) {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 5);
}

function validateZip() {
    const zip = formElements.zip.value.trim();

    if (zip.length !== 5) {
        showFieldError(formElements.zip, 'Please enter a 5-digit ZIP code');
        return false;
    }

    if (!ALLOWED_ZIPS.has(zip)) {
        showFieldError(formElements.zip, 'Sorry, we don\'t currently deliver to this ZIP code. Please contact us for delivery availability.');
        return false;
    }

    clearFieldError(formElements.zip);
    return true;
}

function validateQuantity() {
    const quantity = parseInt(formElements.quantity.value);

    if (isNaN(quantity) || quantity < 12) {
        showFieldError(formElements.quantity, 'Minimum order is 12 cookies');
        return false;
    }

    if (quantity % 12 !== 0) {
        showFieldError(formElements.quantity, 'Quantity must be in multiples of 12 (12, 24, 36, etc.)');
        return false;
    }

    clearFieldError(formElements.quantity);
    return true;
}

function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length > 10) {
        value = value.slice(0, 10);
    }

    if (value.length >= 6) {
        value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
    } else if (value.length >= 3) {
        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    }

    e.target.value = value;
}

function showFieldError(field, message) {
    field.classList.add('error');

    const existingError = field.parentElement.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }

    const errorEl = document.createElement('p');
    errorEl.className = 'field-error field-help';
    errorEl.style.color = 'var(--error)';
    errorEl.textContent = message;
    field.parentElement.appendChild(errorEl);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorEl = field.parentElement.querySelector('.field-error');
    if (errorEl) {
        errorEl.remove();
    }
}

function showFormMessage(message, type = 'success') {
    messageDiv.textContent = message;
    messageDiv.className = `form-message show ${type}`;
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    if (type === 'success') {
        setTimeout(() => {
            messageDiv.classList.remove('show');
        }, 10000);
    }
}

function hideFormMessage() {
    messageDiv.classList.remove('show');
}

function validateForm() {
    hideFormMessage();
    let isValid = true;

    if (formElements.honeypot.value !== '') {
        return false;
    }

    const requiredFields = [
        { field: formElements.name, name: 'Name' },
        { field: formElements.phone, name: 'Phone' },
        { field: formElements.zip, name: 'ZIP Code' },
        { field: formElements.address, name: 'Address' },
        { field: formElements.quantity, name: 'Quantity' },
        { field: formElements.orderDetails, name: 'Order Details' }
    ];

    requiredFields.forEach(({ field, name }) => {
        if (!field.value.trim()) {
            showFieldError(field, `${name} is required`);
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });

    if (formElements.email.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formElements.email.value.trim())) {
            showFieldError(formElements.email, 'Please enter a valid email address');
            isValid = false;
        }
    }

    if (formElements.zip.value.trim() && !validateZip()) {
        isValid = false;
    }

    if (formElements.quantity.value && !validateQuantity()) {
        isValid = false;
    }

    return isValid;
}

async function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
        showFormMessage('Please correct the errors above and try again.', 'error');
        return;
    }

    if (CONFIG.FORM_SUBMIT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
        showFormMessage('Form submission is not yet configured. Please set up Google Apps Script integration.', 'error');
        console.error('Please configure FORM_SUBMIT_URL in order.js');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.classList.add('loading');

    try {
        const formData = {
            name: formElements.name.value.trim(),
            phone: formElements.phone.value.trim(),
            email: formElements.email.value.trim() || 'Not provided',
            zip: formElements.zip.value.trim(),
            address: formElements.address.value.trim() || 'Pickup',
            pickup: formElements.pickup.checked,
            quantity: formElements.quantity.value.trim(),
            orderDetails: formElements.orderDetails.value.trim(),
            notes: formElements.notes.value.trim() || 'None',
            timestamp: new Date().toISOString()
        };

        const response = await fetch(CONFIG.FORM_SUBMIT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });


        showFormMessage(
            'Thank you for your order! You should receive a confirmation email within 24 hours. Please check your spam folder if you don\'t see it.',
            'success'
        );

        form.reset();

    } catch (error) {
        console.error('Form submission error:', error);
        showFormMessage(
            'There was an error submitting your order. Please try again or contact us directly at yuMycookiesgfdf@gmail.com',
            'error'
        );
    } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    }
}

document.addEventListener('DOMContentLoaded', initializeForm);

if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}