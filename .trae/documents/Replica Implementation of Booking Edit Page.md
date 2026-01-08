# Implementation Plan: Edit Booking Page

I will design and implement a precise replica of the booking edit page (`/dashboard/booking/edit/[id]`) based on the reference provided. The implementation will be a functional Next.js page using Tailwind CSS, mirroring the existing design system and logic.

## 1. Page Structure & Layout

* **File**: `src/app/dashboard/booking/edit/[id]/page.tsx` (or `page.jsx`, I will use TypeScript if project conventions allow, otherwise standard JS).

* **Layout**: 2-column grid (`grid-cols-1 lg:grid-cols-3`).

  * **Main Column (Left, 2/3 width)**: Form sections (Customer, Traveller, Trip, Add-ons).

  * **Sidebar Column (Right, 1/3 width)**: Booking summary, Financials, Actions.

* **Header**: Breadcrumbs + "Edit Booking #{id}" title with status badge.

## 2. Form Components & Sections

I will implement the following sections with exact field types and styles:

### A. Customer Contact Details

* Radio buttons: "Existing Customer" vs "New Customer".

* Inputs: Search (for existing) OR Email & Phone (for new).

### B. Traveller Information

* Radio buttons: "Existing Traveller" vs "New Traveller".

* Inputs: First Name, Last Name.

* Passport Section: Number, Expiry Date.

* Personal Details: Nationality (Select), Date of Birth.

### C. Route & Trip Details

* Select: Trip Type (One Way, Round Trip, Multi City).

* Date Picker: Travel Date.

* Custom Components:

  * `AirportAutocomplete` for Origin & Destination.

* **Stopover Logic**: Toggle button to show/hide "Stopover Segment Details" (Location, Arrival, Departure).

* **Flight Details**: `AirlineAutocomplete`, Flight No, Class (Economy/Business/etc.).

### D. Add-ons & Services

* Checkboxes + Price Inputs: Meals, Wheelchair (simplified list from reference).

* Modal: "Select Meal Options" (triggered by "Options" button).

* Inputs: Frequent Flyer Number.

* UI Element: Seat Selection placeholder card.

### E. Sidebar Widgets (Right Column)

* **Booking Details**: ID (Read-only), PNR, Agency, Status (Select), handled by(select)(read-only).

* **Financials**: Payment Status (Select), Cost Price, Selling Price,Payment Method(Select),Transaction id,Date of payment.

* **Summary**: Net Cost, Add-ons sub-total,Grand Total calculation, Estimated Profit.

* **Actions**: "Save Changes" (Primary), "Cancel" (Secondary).

## 3. State & Logic

* **State Management**: `useState` for a comprehensive `formData` object.

* **Calculations**: Real-time `calculateGrandTotal()` based on Selling Price + Add-ons.

* **Data Fetching**: `useEffect` to fetch booking data from Supabase by ID on mount.

* **Submission**: `handleSubmit` to update the `bookings` table in Supabase.

## 4. Dependencies

* **Icons**: `material-symbols-outlined` (Google Fonts).

* **Components**: Reuse `src/components/AirportAutocomplete` and `src/components/AirlineAutocomplete`.

* **Utils**: `src/lib/supabase` for backend connection.

## 5. Execution Steps

1. **Verify Components**: Ensure Autocomplete components exist (already verified).
2. **Create Page**: Create `src/app/dashboard/booking/edit/[id]/page.tsx` with the complete layout and logic.
3. **Refine Styles**: Match Tailwind classes for colors, borders, shadows, and typography (Inter/Manrope).
4. **Test**: Verify form interactions, calculations, and responsiveness.

