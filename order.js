const CONFIG = {
    // Replace this URL with your deployed Google Apps Script web app URL
    FORM_SUBMIT_URL: 'https://script.google.com/macros/s/AKfycbzs2fgVo2kfusz10hIIg3aXsNKDJXr4LhOzjBWpSqdfyG2ygLwxNxc8kioPETJl3zI3/exec',
    DELIVERY_FEE_PER_MILE: 0.60
};

const ALLOWED_ZIPS = new Set([
    "75001","75002","75006","75007","75009","75010","75011","75013","75019",
    "75023","75024","75025","75026","75028","75029","75030","75032","75033",
    "75034","75035","75036","75040","75041","75042","75043","75044","75045",
    "75046","75047","75048","75049","75056","75057","75058","75065","75067",
    "75068","75069","75070","75071","75072","75074","75075","75077","75078",
    "75080","75081","75082","75083","75085","75086","75087","75088","75089",
    "75090","75091","75092","75093","75094","75097","75098",
    "75121","75132","75135","75164","75166","75173","75189",
    "75218","75225","75228","75229","75230","75231","75234","75238","75240",
    "75243","75244","75248","75251","75252","75254","75287",
    "75401","75407","75409","75413","75414","75423","75424","75442","75452",
    "75454","75458","75459","75475","75479","75485","75489","75490","75491",
    "75495",
    "76202","76203","76204","76205","76206","76208","76209","76210","76227",
    "76233","76258","76268","76271"
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
        const formData = new URLSearchParams({
            name: formElements.name.value.trim(),
            phone: formElements.phone.value.trim(),
            email: formElements.email.value.trim() || 'Not provided',
            zip: formElements.zip.value.trim(),
            address: formElements.address.value.trim(),
            quantity: formElements.quantity.value.trim(),
            orderDetails: formElements.orderDetails.value.trim(),
            notes: formElements.notes.value.trim() || 'None',
            timestamp: new Date().toISOString()
        });

        const response = await fetch(CONFIG.FORM_SUBMIT_URL, {
            method: 'POST',
            body: formData
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