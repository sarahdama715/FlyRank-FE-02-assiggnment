# Farm Activity Planner — Settings Form

A fully functional, accessible settings form for the Farm Activity Planner application with comprehensive form validation.

## Features

### Form Sections

1. **Farm Information**
   - Farm name (2-100 characters, required)
   - Farm type selection (crop, livestock, mixed, specialty)
   - Location/address (required)
   - GPS coordinates (latitude/longitude with mutual validation)
   - Farm size in acres (optional)

2. **Notification Preferences**
   - Email notifications toggle
   - SMS alerts toggle
   - Weather alerts toggle
   - Notification frequency selection

3. **Activity Categories**
   - Checkboxes for: Planting, Irrigation, Harvesting, Equipment Maintenance, Pest & Disease Control
   - Multiple selections allowed

4. **Contact Information**
   - Email address (required, with validation)
   - Phone number (optional, with format validation)

### Validation Features

- **Real-time validation** on blur events
- **Field-specific error messages** displayed inline
- **Cross-field validation** (coordinates must be provided together)
- **Custom validation rules** for emails, phone numbers, coordinates
- **Success message** displayed after form submission
- **Local storage persistence** — settings are saved and automatically restored

### Accessibility

- Semantic HTML with `<fieldset>` and `<legend>` elements
- Proper `<label>` associations with form inputs
- ARIA attributes (`aria-invalid`, `aria-live`)
- Focus management and visual indicators
- High contrast support
- Reduced motion support for animations

### Responsive Design

- Mobile-first CSS with breakpoints at 768px and 480px
- Font size of 16px on mobile inputs (prevents auto-zoom)
- Flexible button layouts on small screens
- Touch-friendly spacing and controls

## Project Structure

```
.
├── index.html                      # Main HTML structure
├── src/
│   ├── css/
│   │   └── styles.css             # Complete styling with CSS variables
│   └── js/
│       ├── form-validation.js      # Validation logic (future use as module)
│       └── settings-form.js        # Form initialization & handlers
└── README.md
```

## Usage

### Opening the Form

Simply open `index.html` in your browser. The form loads with any previously saved settings from browser local storage.

### Submitting the Form

1. Fill in required fields (marked with `*`)
2. Errors appear automatically when leaving fields
3. Click "Save Settings" to submit
4. Settings are stored in browser's local storage
5. A success message appears for 4 seconds

### Resetting the Form

Click "Reset" to clear all fields and hide error messages.

## Validation Rules

| Field | Rules | Error Message |
|-------|-------|---------------|
| **farmName** | Required, 2-100 chars | "Farm name is required" / "Must be 2-100 characters" |
| **farmType** | Required select | "Please select a farm type" |
| **location** | Required, min 5 chars | "Location is required" / "Must be at least 5 characters" |
| **latitude** | -90 to 90 (optional) | "Latitude must be between -90 and 90" |
| **longitude** | -180 to 180 (optional) | "Longitude must be between -180 and 180" |
| **coordinates** | Both or neither | "Latitude and longitude must both be provided together" |
| **farmSize** | Non-negative number (optional) | "Farm size must be a non-negative number" |
| **email** | Required, valid format | "Email is required" / "Please enter a valid email" |
| **phone** | Optional, min 10 digits if provided | "Please enter a valid phone number" |
| **notificationFrequency** | Required select | "Please select a notification frequency" |

## Browser Storage

Settings are automatically saved to `localStorage` under the key `farmSettings` as JSON. The form automatically loads these settings on page load.

Example stored data:
```json
{
  "farmName": "Green Valley Farm",
  "farmType": "crop",
  "location": "Iowa, USA",
  "latitude": "41.8781",
  "longitude": "-93.0977",
  "farmSize": "250",
  "emailNotifications": "on",
  "weatherAlerts": "on",
  "notificationFrequency": "daily",
  "email": "farmer@greenvalley.com",
  "phone": "(555) 123-4567",
  "categories": ["planting", "irrigation", "harvesting"]
}
```

## Styling & Customization

The form uses CSS custom properties (variables) defined in `:root`. To customize colors, spacing, or typography, edit these variables in `src/css/styles.css`:

```css
:root {
    --color-primary: #2d6a4f;
    --font-size-base: 1rem;
    --spacing-md: 1rem;
    /* ... more variables ... */
}
```

## Future Enhancements

- Server-side form submission endpoint
- File upload for farm images
- Multi-step form wizard
- Form export/import as JSON
- Geolocation auto-detection for coordinates
- Integration with weather API

## Accessibility Considerations

- Focus outlines visible on keyboard navigation
- Error messages associated with form fields
- High contrast mode support via media query
- Reduced motion support for animations
- All form inputs have associated labels
- Success message has `role="alert"` for screen readers

## Browser Support

Works on all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile, etc.)

## License

Same license as the main FlyRank AI Frontend Engineering project.
