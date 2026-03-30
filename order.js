document.addEventListener('DOMContentLoaded', () => {
    if (typeof cookieData === 'undefined' || !Array.isArray(cookieData)) return;

    const cookieSelect = document.getElementById('cookie-select');
    const addCookieBtn = document.getElementById('add-cookie-btn');
    const selectedCookiesContainer = document.getElementById('selected-cookies');
    const quantityInput = document.getElementById('quantity');
    const hiddenOrderDetails = document.getElementById('order-details');
    const summaryDozens = document.getElementById('summary-dozens');
    const summaryCookies = document.getElementById('summary-cookies');
    const summaryTotal = document.getElementById('summary-total');
    const timestampInput = document.getElementById('timestamp');
    const form = document.getElementById('order-form');
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;

    const selectedCookies = [];

    if (timestampInput) {
        timestampInput.value = new Date().toISOString();
    }

    function showMessage(message, type) {
        if (!formMessage) return;

        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function clearMessage() {
        if (!formMessage) return;
        formMessage.textContent = '';
        formMessage.className = 'form-message';
        formMessage.style.display = 'none';
    }

    function setSubmitting(isSubmitting) {
        if (!submitBtn) return;
        submitBtn.disabled = isSubmitting;
        if (btnText) {
            btnText.textContent = isSubmitting ? 'Submitting...' : 'Submit Order';
        }
    }

    function parsePrice(cookieName) {
        const match = cookieName.match(/\$([\d.]+)\s*\/\s*dozen/i);
        return match ? Number(match[1]) : 0;
    }

    function formatCurrency(amount) {
        return `$${amount.toFixed(2)}`;
    }

    function populateCookieDropdown() {
        cookieData.forEach((cookie) => {
            const option = document.createElement('option');
            option.value = cookie.name;
            option.textContent = cookie.name;
            cookieSelect.appendChild(option);
        });
    }

    function updateHiddenFields() {
        const totalDozens = selectedCookies.reduce((sum, cookie) => sum + cookie.dozens, 0);
        const totalCookies = totalDozens * 12;
        const totalCost = selectedCookies.reduce((sum, cookie) => sum + (cookie.dozens * cookie.pricePerDozen), 0);

        const details = selectedCookies
            .map((cookie) => `${cookie.dozens} dozen(s) of ${cookie.name}`)
            .join(', ');

        quantityInput.value = String(totalCookies);
        hiddenOrderDetails.value = details;

        summaryDozens.textContent = String(totalDozens);
        summaryCookies.textContent = String(totalCookies);
        summaryTotal.textContent = formatCurrency(totalCost);
    }

    function renderSelectedCookies() {
        selectedCookiesContainer.innerHTML = '';

        if (selectedCookies.length === 0) {
            const empty = document.createElement('p');
            empty.className = 'selected-cookies-empty field-help';
            empty.textContent = 'No cookies selected yet.';
            selectedCookiesContainer.appendChild(empty);
            updateHiddenFields();
            return;
        }

        selectedCookies.forEach((cookie, index) => {
            const item = document.createElement('div');
            item.className = 'selected-cookie-item';
            item.innerHTML = `
                <div class="selected-cookie-top">
                    <div>
                        <p class="selected-cookie-name">${cookie.name}</p>
                        <p class="selected-cookie-price">${formatCurrency(cookie.pricePerDozen)} per dozen</p>
                    </div>
                    <button type="button" class="remove-cookie-btn" data-index="${index}">Remove</button>
                </div>
                <div class="selected-cookie-controls">
                    <div class="form-group">
                        <label for="dozens-${index}" class="form-label">How many dozens?</label>
                        <select id="dozens-${index}" class="form-input dozens-select" data-index="${index}">
                            ${Array.from({ length: 10 }, (_, i) => {
                const value = i + 1;
                return `<option value="${value}" ${cookie.dozens === value ? 'selected' : ''}>${value}</option>`;
            }).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Item total</label>
                        <div class="form-input" style="display:flex;align-items:center;">${formatCurrency(cookie.dozens * cookie.pricePerDozen)}</div>
                    </div>
                </div>
            `;
            selectedCookiesContainer.appendChild(item);
        });

        updateHiddenFields();
    }

    function addSelectedCookie() {
        const selectedName = cookieSelect.value;
        if (!selectedName) return;

        const alreadyAdded = selectedCookies.some(cookie => cookie.name === selectedName);
        if (alreadyAdded) {
            cookieSelect.focus();
            return;
        }

        selectedCookies.push({
            name: selectedName,
            dozens: 1,
            pricePerDozen: parsePrice(selectedName)
        });

        cookieSelect.value = '';
        hiddenOrderDetails.setCustomValidity('');
        quantityInput.setCustomValidity('');
        clearMessage();
        renderSelectedCookies();
    }

    function resetCookieSelection() {
        selectedCookies.length = 0;
        renderSelectedCookies();
    }

    async function submitForm(event) {
        event.preventDefault();

        if (timestampInput) {
            timestampInput.value = new Date().toISOString();
        }

        if (selectedCookies.length === 0) {
            hiddenOrderDetails.setCustomValidity('Please add at least one cookie to your order.');
            hiddenOrderDetails.reportValidity();
            return;
        }

        hiddenOrderDetails.setCustomValidity('');
        quantityInput.setCustomValidity('');
        updateHiddenFields();
        clearMessage();

        const actionUrl = form.getAttribute('action');
        if (!actionUrl) {
            showMessage('Form action URL is missing. Add your Google Script web app URL to the form action.', 'error');
            return;
        }

        setSubmitting(true);

        try {
            const formData = new FormData(form);
            const response = await fetch(actionUrl, {
                method: 'POST',
                body: formData
            });

            const rawText = await response.text();
            let result = null;

            try {
                result = JSON.parse(rawText);
            } catch (err) {
                result = null;
            }

            if (!response.ok) {
                throw new Error('The form could not be submitted.');
            }

            if (result && result.status === 'success') {
                showMessage('Your order was submitted successfully. We will get back to you within 24 hours to confirm it.', 'success');
                form.reset();
                resetCookieSelection();

                if (timestampInput) {
                    timestampInput.value = new Date().toISOString();
                }
            } else if (result && result.message) {
                throw new Error(result.message);
            } else {
                showMessage('Your order was submitted successfully. We will get back to you within 24 hours to confirm it.', 'success');
                form.reset();
                resetCookieSelection();

                if (timestampInput) {
                    timestampInput.value = new Date().toISOString();
                }
            }
        } catch (error) {
            showMessage(`There was a problem submitting your order. ${error.message}`, 'error');
        } finally {
            setSubmitting(false);
        }
    }

    addCookieBtn.addEventListener('click', addSelectedCookie);

    cookieSelect.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addSelectedCookie();
        }
    });

    selectedCookiesContainer.addEventListener('change', (event) => {
        if (!event.target.classList.contains('dozens-select')) return;

        const index = Number(event.target.dataset.index);
        const value = Number(event.target.value);

        if (selectedCookies[index]) {
            selectedCookies[index].dozens = value;
            clearMessage();
            renderSelectedCookies();
        }
    });

    selectedCookiesContainer.addEventListener('click', (event) => {
        if (!event.target.classList.contains('remove-cookie-btn')) return;

        const index = Number(event.target.dataset.index);
        selectedCookies.splice(index, 1);
        clearMessage();
        renderSelectedCookies();
    });

    form.addEventListener('submit', submitForm);

    populateCookieDropdown();
    clearMessage();
    renderSelectedCookies();
});