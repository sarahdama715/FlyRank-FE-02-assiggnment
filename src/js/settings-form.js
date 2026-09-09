/**
 * Settings Form Controller
 * Handles form initialization, event listeners, validation, and data persistence
 */

const SettingsFormController = {
    form: null,
    storageKey: 'farmActivityPlannerSettings',
    successMessageDuration: 4000,

    /**
     * Initialize the form controller
     */
    init() {
        this.form = document.getElementById('settingsForm');
        if (!this.form) return;

        // Load saved settings from localStorage
        this.loadSettings();

        // Set up event listeners for real-time validation
        this.setupValidationListeners();

        // Set up form submission handler
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Set up reset handler
        this.form.addEventListener('reset', () => this.handleReset());
    },

    /**
     * Set up real-time validation on blur and input events
     */
    setupValidationListeners() {
        // Get all form fields
        const fields = this.form.querySelectorAll('[name]');

        fields.forEach((field) => {
            // Validate on blur (after user leaves the field)
            field.addEventListener('blur', () => {
                this.validateFieldOnChange(field.name);
            });

            // Clear error on input (when user starts typing)
            field.addEventListener('input', () => {
                clearFieldError(field.name, this.form);
            });

            // For select fields, also validate on change
            if (field.tagName === 'SELECT') {
                field.addEventListener('change', () => {
                    this.validateFieldOnChange(field.name);
                });
            }
        });

        // Special handling for coordinate pair validation
        const latitudeField = this.form.elements['latitude'];
        const longitudeField = this.form.elements['longitude'];

        if (latitudeField && longitudeField) {
            latitudeField.addEventListener('blur', () => {
                this.validateCoordinates();
            });
            longitudeField.addEventListener('blur', () => {
                this.validateCoordinates();
            });
        }
    },

    /**
     * Validate a single field and display error if needed
     * @param {string} fieldName - The name of the field to validate
     */
    validateFieldOnChange(fieldName) {
        const field = this.form.elements[fieldName];
        if (!field) return;

        const result = validateField(fieldName, field.value);

        if (!result.isValid) {
            displayFieldError(fieldName, result.message, this.form);
        } else {
            clearFieldError(fieldName, this.form);
        }
    },

    /**
     * Validate the coordinate pair
     */
    validateCoordinates() {
        const latitude = this.form.elements['latitude'];
        const longitude = this.form.elements['longitude'];

        if (!latitude || !longitude) return;

        // First validate individual fields
        const latResult = validateField('latitude', latitude.value);
        const lonResult = validateField('longitude', longitude.value);

        if (!latResult.isValid) {
            displayFieldError('latitude', latResult.message, this.form);
        } else if (!lonResult.isValid) {
            displayFieldError('longitude', lonResult.message, this.form);
        } else {
            // Both are individually valid, now check if they're a pair
            const pairResult = FormValidation.coordinatePair(
                latitude.value,
                longitude.value
            );

            if (!pairResult.isValid) {
                if (pairResult.latMessage) {
                    displayFieldError('latitude', pairResult.latMessage, this.form);
                }
                if (pairResult.lonMessage) {
                    displayFieldError('longitude', pairResult.lonMessage, this.form);
                }
            } else {
                clearFieldError('latitude', this.form);
                clearFieldError('longitude', this.form);
            }
        }
    },

    /**
     * Handle form submission
     * @param {Event} e - The submit event
     */
    handleSubmit(e) {
        e.preventDefault();

        // Validate the entire form
        const validation = validateForm(this.form);

        if (!validation.isValid) {
            // Display all errors
            for (const [fieldName, message] of Object.entries(validation.errors)) {
                displayFieldError(fieldName, message, this.form);
            }

            // Re-validate coordinate pair specifically
            this.validateCoordinates();

            // Scroll to first error field
            this.scrollToFirstError();
            return;
        }

        // Form is valid, save the settings
        this.saveSettings();

        // Show success message
        this.showSuccessMessage();

        // Clear any error messages
        const errorMessages = this.form.querySelectorAll('.error-message');
        errorMessages.forEach((msg) => {
            msg.textContent = '';
            msg.classList.remove('show');
        });
    },

    /**
     * Handle form reset
     */
    handleReset() {
        // Clear all error messages
        const errorMessages = this.form.querySelectorAll('.error-message');
        errorMessages.forEach((msg) => {
            msg.textContent = '';
            msg.classList.remove('show');
        });

        // Remove aria-invalid attributes
        const fields = this.form.querySelectorAll('[aria-invalid]');
        fields.forEach((field) => {
            field.setAttribute('aria-invalid', 'false');
            field.removeAttribute('aria-describedby');
        });

        // Hide success message
        const successMessage = this.form.querySelector('#successMessage');
        if (successMessage) {
            successMessage.classList.remove('show');
        }

        // Clear localStorage to reset to empty state
        try {
            localStorage.removeItem(this.storageKey);
        } catch (e) {
            // Storage error - continue anyway
        }
    },

    /**
     * Save form data to localStorage
     */
    saveSettings() {
        try {
            const formData = new FormData(this.form);
            const settings = {
                farmName: formData.get('farmName'),
                farmType: formData.get('farmType'),
                farmLocation: formData.get('farmLocation'),
                farmSize: formData.get('farmSize'),
                latitude: formData.get('latitude') || '',
                longitude: formData.get('longitude') || '',
                smsAlerts: formData.get('smsAlerts') === 'on',
                emailNotifications: formData.get('emailNotifications') === 'on',
                notificationFrequency: formData.get('notificationFrequency'),
                activityCategories: formData.getAll('activityCategories'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                savedAt: new Date().toISOString()
            };

            localStorage.setItem(this.storageKey, JSON.stringify(settings));
        } catch (e) {
            // Handle storage quota exceeded or other storage errors
        }
    },

    /**
     * Load saved settings from localStorage
     */
    loadSettings() {
        try {
            const savedData = localStorage.getItem(this.storageKey);
            if (!savedData) return;

            const settings = JSON.parse(savedData);

            // Populate form fields with saved data
            if (settings.farmName) {
                this.form.elements['farmName'].value = settings.farmName;
            }
            if (settings.farmType) {
                this.form.elements['farmType'].value = settings.farmType;
            }
            if (settings.farmLocation) {
                this.form.elements['farmLocation'].value = settings.farmLocation;
            }
            if (settings.farmSize) {
                this.form.elements['farmSize'].value = settings.farmSize;
            }
            if (settings.latitude) {
                this.form.elements['latitude'].value = settings.latitude;
            }
            if (settings.longitude) {
                this.form.elements['longitude'].value = settings.longitude;
            }

            // Restore checkboxes
            if (settings.smsAlerts) {
                this.form.elements['smsAlerts'].checked = true;
            }
            if (settings.emailNotifications) {
                this.form.elements['emailNotifications'].checked = true;
            }

            // Restore notification frequency
            if (settings.notificationFrequency) {
                this.form.elements['notificationFrequency'].value = settings.notificationFrequency;
            }

            // Restore activity categories
            if (Array.isArray(settings.activityCategories) && settings.activityCategories.length > 0) {
                settings.activityCategories.forEach((category) => {
                    const checkbox = this.form.querySelector(
                        `input[name="activityCategories"][value="${category}"]`
                    );
                    if (checkbox) {
                        checkbox.checked = true;
                    }
                });
            }

            // Restore contact information
            if (settings.email) {
                this.form.elements['email'].value = settings.email;
            }
            if (settings.phone) {
                this.form.elements['phone'].value = settings.phone;
            }
        } catch (e) {
            // JSON parse error or other storage error - silently continue
        }
    },

    /**
     * Show the success message for a brief duration
     */
    showSuccessMessage() {
        const successMessage = document.getElementById('successMessage');
        if (!successMessage) return;

        successMessage.classList.add('show');

        // Scroll to top to show the success message
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Auto-hide after duration
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, this.successMessageDuration);
    },

    /**
     * Scroll to the first field with an error
     */
    scrollToFirstError() {
        const errorMessages = this.form.querySelectorAll('.error-message.show');
        if (errorMessages.length === 0) return;

        const firstErrorMessage = errorMessages[0];
        const firstErrorField = firstErrorMessage.previousElementSibling;

        if (firstErrorField) {
            firstErrorField.focus();
            firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
};

/**
 * Initialize the form when the DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    SettingsFormController.init();
});
