/**
 * Settings Form Handler
 * Manages form initialization, validation, submission, and persistence
 */

// Import validation functions
// Note: Using script tags instead of modules for vanilla JS compatibility

/**
 * Initializes the settings form
 */
function initializeSettingsForm() {
    const form = document.getElementById('settingsForm');

    if (!form) {
        console.error('Settings form not found');
        return;
    }

    // Load saved settings from localStorage
    loadFormSettings(form);

    // Attach event listeners
    attachFormEventListeners(form);
}

/**
 * Loads previously saved form settings from localStorage
 * @param {HTMLFormElement} form - The form element
 */
function loadFormSettings(form) {
    const savedSettings = localStorage.getItem('farmSettings');

    if (!savedSettings) {
        return;
    }

    try {
        const settings = JSON.parse(savedSettings);

        // Populate form fields with saved data
        Object.keys(settings).forEach((key) => {
            const field = form.elements[key];

            if (!field) return;

            if (field.type === 'checkbox') {
                // Handle multiple checkboxes with same name
                const checkboxes = form.querySelectorAll(`input[name="${key}"]`);
                checkboxes.forEach((checkbox) => {
                    checkbox.checked = settings[key].includes(checkbox.value);
                });
            } else {
                field.value = settings[key];
            }
        });
    } catch (error) {
        console.warn('Failed to load saved settings:', error);
    }
}

/**
 * Saves form settings to localStorage
 * @param {HTMLFormElement} form - The form element
 */
function saveFormSettings(form) {
    const formData = new FormData(form);
    const settings = {};

    // Handle regular fields and checkboxes
    const fields = form.querySelectorAll('input, select, textarea');

    fields.forEach((field) => {
        if (field.type === 'checkbox') {
            // Collect all checked checkboxes with same name
            if (!settings[field.name]) {
                const checkedBoxes = Array.from(
                    form.querySelectorAll(`input[name="${field.name}"]:checked`)
                ).map((cb) => cb.value);
                settings[field.name] = checkedBoxes;
            }
        } else if (field.type !== 'hidden') {
            settings[field.name] = field.value;
        }
    });

    try {
        localStorage.setItem('farmSettings', JSON.stringify(settings));
        return true;
    } catch (error) {
        console.error('Failed to save settings:', error);
        return false;
    }
}

/**
 * Attaches event listeners to the form
 * @param {HTMLFormElement} form - The form element
 */
function attachFormEventListeners(form) {
    // Real-time validation on blur
    const fields = form.querySelectorAll('input, select, textarea');

    fields.forEach((field) => {
        field.addEventListener('blur', () => {
            handleFieldValidation(field, form);
        });

        // Clear error on input
        field.addEventListener('input', () => {
            const errorElement = document.getElementById(`${field.name}-error`);
            if (errorElement) {
                errorElement.classList.remove('show');
            }
        });
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit(form);
    });

    // Form reset
    form.addEventListener('reset', (e) => {
        // Clear error messages on reset
        setTimeout(() => {
            const errorMessages = form.querySelectorAll('.error-message');
            errorMessages.forEach((msg) => {
                msg.classList.remove('show');
                msg.textContent = '';
            });

            // Hide success message
            const successMessage = document.getElementById('successMessage');
            if (successMessage) {
                successMessage.classList.remove('show');
            }
        }, 0);
    });
}

/**
 * Validates a single field
 * @param {HTMLElement} field - The form field element
 * @param {HTMLFormElement} form - The form element
 */
function handleFieldValidation(field, form) {
    const fieldName = field.name;
    const fieldValue = field.value;

    // Get validation rules for this field
    const rules = fieldValidationRules[fieldName];

    if (!rules) {
        return; // No validation rules for this field
    }

    const errors = [];

    for (const rule of rules) {
        if (!rule.validate(fieldValue)) {
            errors.push(rule.message);
        }
    }

    const errorElement = document.getElementById(`${fieldName}-error`);

    if (errorElement) {
        if (errors.length > 0) {
            errorElement.textContent = errors[0];
            errorElement.classList.add('show');
            field.setAttribute('aria-invalid', 'true');
        } else {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
            field.setAttribute('aria-invalid', 'false');
        }
    }
}

/**
 * Handles form submission
 * @param {HTMLFormElement} form - The form element
 */
function handleFormSubmit(form) {
    // Validate entire form
    if (!validateFormComplete(form)) {
        // Scroll to first error
        const firstError = form.querySelector('.error-message.show');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }

    // Save settings
    const saved = saveFormSettings(form);

    if (saved) {
        // Show success message
        showSuccessMessage();

        // Log submission (in real app, would send to server)
        console.log('Settings saved successfully');

        // Optional: Reset form after successful save
        // form.reset();
    } else {
        alert('Failed to save settings. Please try again.');
    }
}

/**
 * Validates the entire form
 * @param {HTMLFormElement} form - The form element
 * @returns {boolean} - True if form is valid
 */
function validateFormComplete(form) {
    const fields = form.querySelectorAll('input, select, textarea');
    let isFormValid = true;

    // Validate all fields
    fields.forEach((field) => {
        const fieldName = field.name;
        const fieldValue = field.value;
        const rules = fieldValidationRules[fieldName];

        if (!rules) {
            return; // Skip fields without rules
        }

        const errors = [];

        for (const rule of rules) {
            if (!rule.validate(fieldValue)) {
                errors.push(rule.message);
            }
        }

        const errorElement = document.getElementById(`${fieldName}-error`);

        if (errorElement) {
            if (errors.length > 0) {
                errorElement.textContent = errors[0];
                errorElement.classList.add('show');
                field.setAttribute('aria-invalid', 'true');
                isFormValid = false;
            } else {
                errorElement.textContent = '';
                errorElement.classList.remove('show');
                field.setAttribute('aria-invalid', 'false');
            }
        }
    });

    // Cross-field validation for coordinates
    const latitudeField = form.querySelector('#latitude');
    const longitudeField = form.querySelector('#longitude');

    if (latitudeField && longitudeField) {
        const latValue = latitudeField.value;
        const lonValue = longitudeField.value;
        const hasLat = latValue !== null && latValue !== undefined && latValue !== '';
        const hasLon = lonValue !== null && lonValue !== undefined && lonValue !== '';

        if ((hasLat || hasLon) && !(hasLat && hasLon)) {
            const errorElement = document.getElementById('latitude-error');
            if (errorElement) {
                errorElement.textContent =
                    'Latitude and longitude must both be provided together';
                errorElement.classList.add('show');
            }
            isFormValid = false;
        }
    }

    return isFormValid;
}

/**
 * Shows success message
 */
function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');

    if (!successMessage) {
        return;
    }

    successMessage.classList.add('show');

    // Hide after 4 seconds
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 4000);
}

/**
 * Gets current form data
 * @param {HTMLFormElement} form - The form element
 * @returns {object} - Form data object
 */
function getFormData(form) {
    const formData = new FormData(form);
    const data = {};

    const fields = form.querySelectorAll('input, select, textarea');

    fields.forEach((field) => {
        if (field.type === 'checkbox') {
            if (!data[field.name]) {
                const checkedBoxes = Array.from(
                    form.querySelectorAll(`input[name="${field.name}"]:checked`)
                ).map((cb) => cb.value);
                data[field.name] = checkedBoxes;
            }
        } else if (field.type !== 'hidden') {
            data[field.name] = field.value;
        }
    });

    return data;
}

/**
 * Field Validation Rules
 */
const fieldValidationRules = {
    farmName: [
        {
            validate: (value) => value.trim().length > 0,
            message: 'Farm name is required',
        },
        {
            validate: (value) => value.length >= 2,
            message: 'Farm name must be at least 2 characters',
        },
        {
            validate: (value) => value.length <= 100,
            message: 'Farm name must not exceed 100 characters',
        },
    ],
    farmType: [
        {
            validate: (value) => value !== '' && value !== null,
            message: 'Please select a farm type',
        },
    ],
    location: [
        {
            validate: (value) => value.trim().length > 0,
            message: 'Location is required',
        },
        {
            validate: (value) => value.length >= 5,
            message: 'Location must be at least 5 characters',
        },
    ],
    latitude: [
        {
            validate: (value) => {
                if (!value) return true;
                const num = parseFloat(value);
                return !isNaN(num) && num >= -90 && num <= 90;
            },
            message: 'Latitude must be between -90 and 90',
        },
    ],
    longitude: [
        {
            validate: (value) => {
                if (!value) return true;
                const num = parseFloat(value);
                return !isNaN(num) && num >= -180 && num <= 180;
            },
            message: 'Longitude must be between -180 and 180',
        },
    ],
    farmSize: [
        {
            validate: (value) => {
                if (!value) return true;
                const num = parseFloat(value);
                return !isNaN(num) && num >= 0;
            },
            message: 'Farm size must be a non-negative number',
        },
    ],
    email: [
        {
            validate: (value) => value.trim().length > 0,
            message: 'Email is required',
        },
        {
            validate: (value) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            },
            message: 'Please enter a valid email address',
        },
    ],
    phone: [
        {
            validate: (value) => {
                if (!value) return true;
                const phoneRegex = /^[\d\s\-\+\(\)]+$/;
                return phoneRegex.test(value) && value.replace(/\D/g, '').length >= 10;
            },
            message: 'Please enter a valid phone number (at least 10 digits)',
        },
    ],
    notificationFrequency: [
        {
            validate: (value) => value !== '' && value !== null,
            message: 'Please select a notification frequency',
        },
    ],
};

// Initialize form when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSettingsForm);
} else {
    initializeSettingsForm();
}
