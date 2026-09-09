/**
 * Form Validation Module
 * Provides reusable validation functions for the Settings Form
 */

const FormValidation = {
    /**
     * Check if a value is required and not empty
     * @param {string} value - The value to check
     * @returns {object} {isValid: boolean, message: string}
     */
    required(value) {
        const trimmed = String(value).trim();
        if (trimmed === '' || trimmed === '0' || value === null || value === undefined) {
            return {
                isValid: false,
                message: 'This field is required'
            };
        }
        return { isValid: true, message: '' };
    },

    /**
     * Validate email format
     * @param {string} value - The email to validate
     * @returns {object} {isValid: boolean, message: string}
     */
    email(value) {
        // First check if required
        if (!value) {
            return {
                isValid: false,
                message: 'Email is required'
            };
        }

        // Basic email regex pattern
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return {
                isValid: false,
                message: 'Please enter a valid email address'
            };
        }

        return { isValid: true, message: '' };
    },

    /**
     * Validate phone number format
     * @param {string} value - The phone number to validate
     * @returns {object} {isValid: boolean, message: string}
     */
    phone(value) {
        // Phone is optional, so empty is valid
        if (!value || value.trim() === '') {
            return { isValid: true, message: '' };
        }

        // Remove all non-digit characters for validation
        const digitsOnly = value.replace(/\D/g, '');

        // Must have at least 10 digits
        if (digitsOnly.length < 10) {
            return {
                isValid: false,
                message: 'Phone number must have at least 10 digits'
            };
        }

        return { isValid: true, message: '' };
    },

    /**
     * Validate numeric value is greater than zero
     * @param {number} value - The numeric value to validate
     * @returns {object} {isValid: boolean, message: string}
     */
    greaterThanZero(value) {
        if (value === '' || value === null || value === undefined) {
            return {
                isValid: false,
                message: 'This field is required'
            };
        }

        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
            return {
                isValid: false,
                message: 'Please enter a valid number'
            };
        }

        if (numValue <= 0) {
            return {
                isValid: false,
                message: 'Farm size must be greater than 0'
            };
        }

        return { isValid: true, message: '' };
    },

    /**
     * Validate latitude coordinate
     * @param {number} value - The latitude value
     * @returns {object} {isValid: boolean, message: string}
     */
    latitude(value) {
        // If empty, it's okay (coordinates are optional)
        if (value === '' || value === null || value === undefined) {
            return { isValid: true, message: '' };
        }

        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
            return {
                isValid: false,
                message: 'Latitude must be a valid number'
            };
        }

        if (numValue < -90 || numValue > 90) {
            return {
                isValid: false,
                message: 'Latitude must be between -90 and 90'
            };
        }

        return { isValid: true, message: '' };
    },

    /**
     * Validate longitude coordinate
     * @param {number} value - The longitude value
     * @returns {object} {isValid: boolean, message: string}
     */
    longitude(value) {
        // If empty, it's okay (coordinates are optional)
        if (value === '' || value === null || value === undefined) {
            return { isValid: true, message: '' };
        }

        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
            return {
                isValid: false,
                message: 'Longitude must be a valid number'
            };
        }

        if (numValue < -180 || numValue > 180) {
            return {
                isValid: false,
                message: 'Longitude must be between -180 and 180'
            };
        }

        return { isValid: true, message: '' };
    },

    /**
     * Validate that both latitude and longitude are provided together or neither
     * @param {number} latitude - The latitude value
     * @param {number} longitude - The longitude value
     * @returns {object} {isValid: boolean, latMessage: string, lonMessage: string}
     */
    coordinatePair(latitude, longitude) {
        const latEmpty = latitude === '' || latitude === null || latitude === undefined;
        const lonEmpty = longitude === '' || longitude === null || longitude === undefined;

        // Both empty or both filled is valid
        if ((latEmpty && lonEmpty) || (!latEmpty && !lonEmpty)) {
            return {
                isValid: true,
                latMessage: '',
                lonMessage: ''
            };
        }

        // One filled, one empty - error on both
        const message = 'Both latitude and longitude must be provided, or leave both empty';
        return {
            isValid: false,
            latMessage: latEmpty ? message : '',
            lonMessage: lonEmpty ? message : ''
        };
    },

    /**
     * Validate select field is not empty
     * @param {string} value - The selected value
     * @returns {object} {isValid: boolean, message: string}
     */
    selectRequired(value) {
        if (value === '' || value === null || value === undefined) {
            return {
                isValid: false,
                message: 'Please select an option'
            };
        }
        return { isValid: true, message: '' };
    }
};

/**
 * Field validation rules configuration
 * Maps field names to their validation functions
 */
const fieldValidationRules = {
    farmName: ['required'],
    farmType: ['selectRequired'],
    farmLocation: ['required'],
    farmSize: ['greaterThanZero'],
    latitude: ['latitude'],
    longitude: ['longitude'],
    email: ['email'],
    phone: ['phone'],
    notificationFrequency: ['selectRequired']
};

/**
 * Validate a single field
 * @param {string} fieldName - The name of the field to validate
 * @param {string} value - The value of the field
 * @returns {object} {isValid: boolean, message: string}
 */
function validateField(fieldName, value) {
    if (!fieldValidationRules[fieldName]) {
        return { isValid: true, message: '' };
    }

    const rules = fieldValidationRules[fieldName];
    for (const rule of rules) {
        if (typeof FormValidation[rule] === 'function') {
            const result = FormValidation[rule](value);
            if (!result.isValid) {
                return result;
            }
        }
    }

    return { isValid: true, message: '' };
}

/**
 * Validate the entire form
 * @param {HTMLFormElement} form - The form element to validate
 * @returns {object} {isValid: boolean, errors: {fieldName: message}}
 */
function validateForm(form) {
    const errors = {};
    let isFormValid = true;

    // Validate all regular fields
    for (const [fieldName] of Object.entries(fieldValidationRules)) {
        const field = form.elements[fieldName];
        if (field) {
            const result = validateField(fieldName, field.value);
            if (!result.isValid) {
                errors[fieldName] = result.message;
                isFormValid = false;
            }
        }
    }

    // Validate coordinate pair (must be together or both empty)
    const latitudeField = form.elements['latitude'];
    const longitudeField = form.elements['longitude'];
    if (latitudeField && longitudeField) {
        const latResult = validateField('latitude', latitudeField.value);
        const lonResult = validateField('longitude', longitudeField.value);

        // If individual validations pass, check pair validation
        if (latResult.isValid && lonResult.isValid) {
            const pairResult = FormValidation.coordinatePair(
                latitudeField.value,
                longitudeField.value
            );

            if (!pairResult.isValid) {
                if (pairResult.latMessage) {
                    errors['latitude'] = pairResult.latMessage;
                }
                if (pairResult.lonMessage) {
                    errors['longitude'] = pairResult.lonMessage;
                }
                isFormValid = false;
            }
        }
    }

    return { isValid: isFormValid, errors };
}

/**
 * Display a field-specific error message
 * @param {string} fieldName - The name of the field
 * @param {string} message - The error message to display
 * @param {HTMLFormElement} form - The form element containing the field
 */
function displayFieldError(fieldName, message, form) {
    const errorElement = form.querySelector(`#${fieldName}Error`);
    const field = form.elements[fieldName];

    if (errorElement && field) {
        if (message) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
            field.setAttribute('aria-invalid', 'true');
            field.setAttribute('aria-describedby', `${fieldName}Error`);
        } else {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
            field.setAttribute('aria-invalid', 'false');
            field.removeAttribute('aria-describedby');
        }
    }
}

/**
 * Clear error message for a field
 * @param {string} fieldName - The name of the field
 * @param {HTMLFormElement} form - The form element containing the field
 */
function clearFieldError(fieldName, form) {
    const errorElement = form.querySelector(`#${fieldName}Error`);
    const field = form.elements[fieldName];

    if (errorElement && field) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
        field.setAttribute('aria-invalid', 'false');
        field.removeAttribute('aria-describedby');
    }
}
