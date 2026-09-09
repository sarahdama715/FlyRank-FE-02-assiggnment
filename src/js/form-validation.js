/**
 * Form Validation Module
 * Provides reusable validation functions for form fields
 */

const FormValidation = {
    /**
     * Validates if a field is required and has a value
     * @param {string} value - The field value
     * @returns {boolean} - True if valid
     */
    required: (value) => {
        return value.trim().length > 0;
    },

    /**
     * Validates if a field has minimum length
     * @param {string} value - The field value
     * @param {number} minLength - Minimum length required
     * @returns {boolean} - True if valid
     */
    minLength: (value, minLength) => {
        return value.length >= minLength;
    },

    /**
     * Validates if a field has maximum length
     * @param {string} value - The field value
     * @param {number} maxLength - Maximum length allowed
     * @returns {boolean} - True if valid
     */
    maxLength: (value, maxLength) => {
        return value.length <= maxLength;
    },

    /**
     * Validates email format
     * @param {string} value - The email value
     * @returns {boolean} - True if valid email format
     */
    email: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    },

    /**
     * Validates phone number format
     * @param {string} value - The phone number value
     * @returns {boolean} - True if valid phone format (basic validation)
     */
    phone: (value) => {
        if (!value) return true; // Phone is optional
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return phoneRegex.test(value) && value.replace(/\D/g, '').length >= 10;
    },

    /**
     * Validates if value is a number within range
     * @param {number} value - The number value
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {boolean} - True if valid
     */
    numberRange: (value, min, max) => {
        const num = parseFloat(value);
        return !isNaN(num) && num >= min && num <= max;
    },

    /**
     * Validates latitude value (-90 to 90)
     * @param {number} value - The latitude value
     * @returns {boolean} - True if valid latitude
     */
    latitude: (value) => {
        if (!value) return true; // Latitude is optional
        return FormValidation.numberRange(value, -90, 90);
    },

    /**
     * Validates longitude value (-180 to 180)
     * @param {number} value - The longitude value
     * @returns {boolean} - True if valid longitude
     */
    longitude: (value) => {
        if (!value) return true; // Longitude is optional
        return FormValidation.numberRange(value, -180, 180);
    },

    /**
     * Validates farm size (non-negative number)
     * @param {number} value - The farm size value
     * @returns {boolean} - True if valid
     */
    farmSize: (value) => {
        if (!value) return true; // Farm size is optional
        const num = parseFloat(value);
        return !isNaN(num) && num >= 0;
    },

    /**
     * Validates that at least one checkbox is selected
     * @param {NodeList} checkboxes - Collection of checkboxes with same name
     * @returns {boolean} - True if at least one is checked
     */
    atLeastOneChecked: (checkboxes) => {
        return Array.from(checkboxes).some(checkbox => checkbox.checked);
    },

    /**
     * Validates select field has a value
     * @param {string} value - The selected value
     * @returns {boolean} - True if a value is selected
     */
    selectRequired: (value) => {
        return value !== '' && value !== null;
    },

    /**
     * Validates coordinated latitude/longitude (if one is provided, both should be)
     * @param {number} latitude - Latitude value
     * @param {number} longitude - Longitude value
     * @returns {boolean} - True if valid coordinates or both empty
     */
    coordinatesPair: (latitude, longitude) => {
        const hasLat = latitude !== null && latitude !== undefined && latitude !== '';
        const hasLon = longitude !== null && longitude !== undefined && longitude !== '';

        // Both must be provided together or both empty
        return (hasLat && hasLon) || (!hasLat && !hasLon);
    },
};

/**
 * Field Validation Configuration
 * Defines validation rules for each form field
 */
const fieldValidationRules = {
    farmName: [
        {
            validate: (value) => FormValidation.required(value),
            message: 'Farm name is required',
        },
        {
            validate: (value) => FormValidation.minLength(value, 2),
            message: 'Farm name must be at least 2 characters',
        },
        {
            validate: (value) => FormValidation.maxLength(value, 100),
            message: 'Farm name must not exceed 100 characters',
        },
    ],
    farmType: [
        {
            validate: (value) => FormValidation.selectRequired(value),
            message: 'Please select a farm type',
        },
    ],
    location: [
        {
            validate: (value) => FormValidation.required(value),
            message: 'Location is required',
        },
        {
            validate: (value) => FormValidation.minLength(value, 5),
            message: 'Location must be at least 5 characters',
        },
    ],
    latitude: [
        {
            validate: (value) => FormValidation.latitude(value),
            message: 'Latitude must be between -90 and 90',
        },
    ],
    longitude: [
        {
            validate: (value) => FormValidation.longitude(value),
            message: 'Longitude must be between -180 and 180',
        },
    ],
    farmSize: [
        {
            validate: (value) => FormValidation.farmSize(value),
            message: 'Farm size must be a non-negative number',
        },
    ],
    email: [
        {
            validate: (value) => FormValidation.required(value),
            message: 'Email is required',
        },
        {
            validate: (value) => FormValidation.email(value),
            message: 'Please enter a valid email address',
        },
    ],
    phone: [
        {
            validate: (value) => FormValidation.phone(value),
            message: 'Please enter a valid phone number (at least 10 digits)',
        },
    ],
    notificationFrequency: [
        {
            validate: (value) => FormValidation.selectRequired(value),
            message: 'Please select a notification frequency',
        },
    ],
};

/**
 * Validates a single field
 * @param {HTMLElement} field - The form field element
 * @returns {object} - { isValid: boolean, errors: string[] }
 */
function validateField(field) {
    const fieldName = field.name;
    const fieldValue = field.value;
    const rules = fieldValidationRules[fieldName];
    const errors = [];

    if (!rules) {
        return { isValid: true, errors: [] };
    }

    for (const rule of rules) {
        if (!rule.validate(fieldValue)) {
            errors.push(rule.message);
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

/**
 * Displays validation error for a field
 * @param {HTMLElement} field - The form field element
 * @param {string[]} errors - Array of error messages
 */
function displayFieldError(field, errors) {
    const errorElement = document.getElementById(`${field.name}-error`);

    if (!errorElement) return;

    if (errors.length > 0) {
        errorElement.textContent = errors[0]; // Show first error
        errorElement.classList.add('show');
    } else {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
}

/**
 * Clears validation error for a field
 * @param {HTMLElement} field - The form field element
 */
function clearFieldError(field) {
    const errorElement = document.getElementById(`${field.name}-error`);

    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
}

/**
 * Validates the entire form
 * @param {HTMLFormElement} form - The form element
 * @returns {boolean} - True if form is valid
 */
function validateForm(form) {
    const fields = form.querySelectorAll('input, select, textarea');
    let isFormValid = true;

    // Validate all fields
    fields.forEach((field) => {
        const validation = validateField(field);

        if (!validation.isValid) {
            displayFieldError(field, validation.errors);
            isFormValid = false;
        } else {
            clearFieldError(field);
        }
    });

    // Additional cross-field validation for coordinates
    const latitudeField = form.querySelector('#latitude');
    const longitudeField = form.querySelector('#longitude');

    if (latitudeField && longitudeField) {
        if (!FormValidation.coordinatesPair(latitudeField.value, longitudeField.value)) {
            displayFieldError(latitudeField, ['Latitude and longitude must both be provided together']);
            isFormValid = false;
        }
    }

    return isFormValid;
}

export { FormValidation, validateField, validateForm, displayFieldError, clearFieldError };
