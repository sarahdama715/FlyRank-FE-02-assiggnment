# Farm Activity Planner Settings Form

## Overview

A fully responsive, accessible Settings Form for the Farm Activity Planner capstone project. The form is built with vanilla HTML, CSS, and JavaScript with no external dependencies.

## Features Implemented

### 1. Farm Information Section
- **Farm Name** — Required text field
- **Farm Type** — Required select field (Crop, Livestock, Dairy, Mixed Farming, Fruit Orchard, Vegetable Farm)
- **Farm Location** — Required text field (e.g., "County, State" or "City, Region")
- **Farm Size in Acres** — Required numeric field with validation (must be > 0)
- **Latitude & Longitude** — Optional coordinate fields with paired validation (both required or both empty)

### 2. Notification Preferences
- **SMS Alerts** — Optional checkbox (not pre-selected)
- **Email Notifications** — Optional checkbox (not pre-selected)
- **Notification Frequency** — Required select field (Real-time, Daily, Weekly, Monthly)

### 3. Activity Categories
- Checkboxes for: Planting, Harvesting, Irrigation, Weeding, Spraying
- None pre-selected by default
- Users select only the activities relevant to their farm

### 4. Contact Information
- **Email** — Required field with email format validation
- **Phone** — Optional field with phone number format validation (10+ digits)

### 5. Form Actions
- **Reset Button** — Clears all form data and validation errors
- **Save Settings Button** — Submits and validates the form

## Validation Features

### Real-Time Validation
- Triggered on blur for immediate feedback
- Error messages appear inline near the relevant field
- Errors clear when the user starts typing

### Form Submission Validation
- All required fields are checked
- Email format is validated
- Phone number (if provided) must have 10+ digits
- Farm size must be greater than 0
- Latitude must be between -90 and 90 (if provided)
- Longitude must be between -180 and 180 (if provided)
- Latitude and longitude must both be provided or both be empty
- Form does not save if validation errors exist

### Error Handling
- Field-specific error messages appear below each input
- Error messages are clearly visible and associated with fields via aria-describedby
- Scroll-to-first-error on submit failure
- All errors cleared on form reset

## Accessibility Features

### Semantic HTML
- Proper use of `<fieldset>` and `<legend>` for form sections
- Every form control has an associated `<label>`
- Headings with correct hierarchy (h1, section titles)

### ARIA Attributes
- `aria-live="polite"` on success message for screen reader announcement
- `aria-invalid` attribute on fields with validation errors
- `aria-describedby` links error messages to their fields
- `aria-label` on required indicators
- `role="alert"` on success message

### Keyboard Navigation
- Full keyboard navigation support (Tab, Shift+Tab, Arrow keys for selects)
- Visible focus states on all interactive elements
- Form submission with Enter key

### Visual Focus States
- 3px shadow on focused elements
- Clear visual indication of keyboard focus
- High contrast mode support

## Responsive Design

### Mobile-First Approach
- Base styles optimized for mobile (default viewport)
- **Tablet breakpoint** (max-width: 768px)
  - Adjusted padding and spacing
  - Button layout adaptation
- **Desktop breakpoint** (max-width: 480px)
  - Optimized form width
  - Reduced font sizes for small screens
  - Single-column layout for coordinates

### No Horizontal Scrolling
- All elements fit within viewport width
- Text input font size 16px on mobile to prevent zoom
- Touch-friendly button and control sizes

## Data Persistence

### localStorage Integration
- Form data automatically saved on successful submission
- Saved data loaded when page reloads
- Timestamp recorded for reference
- All form types supported (text, select, checkbox, textarea)
- Graceful error handling if storage is unavailable

### Reset Behavior
- Clears all form fields
- Clears localStorage
- Removes all error messages
- Removes all validation indicators
- Hides success message

## File Structure

```
Front-End-AI-engineering/
├── index.html                    # Main form (350+ lines)
├── src/
│   ├── css/
│   │   └── styles.css           # Responsive styling (600+ lines)
│   └── js/
│       ├── form-validation.js   # Validation module (250+ lines)
│       └── settings-form.js     # Form controller (350+ lines)
├── CLAUDE.md                    # Project guidelines
├── README.md                    # Project documentation
└── LICENSE                      # MIT License
```

## Code Quality

### Following CLAUDE.md Guidelines
- ✅ No external dependencies or frameworks
- ✅ No `console.log` statements in production code
- ✅ Uses `const` by default, `let` only when necessary
- ✅ Single-purpose, focused functions
- ✅ Semantic HTML throughout
- ✅ Mobile-first responsive design
- ✅ Accessible by default
- ✅ Realistic farm-related copy (no lorem ipsum)
- ✅ CSS custom properties for theming
- ✅ Clear class names describing purpose

### Validation Module
- Reusable validation functions
- Clear separation of concerns
- Easy to extend with additional validators
- Comprehensive error messages

### Form Controller
- Handles initialization, events, and persistence
- Real-time and submit-time validation
- LocalStorage management
- Accessibility updates (aria-invalid)
- User-friendly error display

## Testing

All features have been tested and verified:

| Test | Result |
|------|--------|
| Empty form submission | ✅ Shows 6 required field errors |
| Invalid email | ✅ Rejected with error message |
| Farm size = 0 | ✅ Rejected with error message |
| Farm size = -5 | ✅ Rejected with error message |
| Latitude only (no longitude) | ✅ Shows error on longitude |
| Longitude only (no latitude) | ✅ Shows error on latitude |
| Valid data submission | ✅ Success message appears |
| Success message duration | ✅ Auto-hides after 4 seconds |
| Reset button | ✅ Clears form and errors |
| localStorage persistence | ✅ Data restored after reload |
| Keyboard navigation | ✅ Tab/Shift+Tab works |
| Focus states | ✅ Visible on all controls |

## Browser Compatibility

The form works on modern browsers supporting:
- CSS Grid and Flexbox
- CSS Custom Properties
- ES6+ JavaScript (const/let, arrow functions, template literals)
- localStorage API

## Future Enhancements

Potential improvements for future iterations:
1. Auto-suggest for farm location (geocoding API)
2. Map integration to set coordinates
3. Export settings as JSON
4. Import settings from file
5. Phone number formatting and country code selection
6. Activity scheduling/calendar integration
7. Settings versioning/history
8. Multiple farm profiles
9. Cloud sync via API
10. Offline mode with service workers

## Usage

1. Open `index.html` in a web browser
2. Fill in the form fields
3. Click "Save Settings" to persist data (shows success message)
4. Data is saved to localStorage automatically
5. Reload the page to see data persists
6. Click "Reset" to clear all data

No server or build tools required — just open the HTML file!
