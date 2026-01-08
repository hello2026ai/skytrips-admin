# Implementation Plan: Redesign Booking Details Page

I will redesign `src/app/dashboard/booking/[id]/page.tsx` to precisely match the reference design provided in the prompt. The redesign involves updating the layout, component structure, and styling while maintaining the existing data fetching logic.

## 1. Page Layout & Structure
*   **Layout**: Switch to a 2-column grid (`grid-cols-1 lg:grid-cols-3` or similar) where the main content takes 2/3 width and the sidebar takes 1/3 width.
*   **Header**:
    *   Booking ID + Status Badge (Green/Pending color).
    *   Action Buttons: "Edit Details", "View Invoice", "Print Booking".
*   **Breadcrumbs**: Standard dashboard breadcrumbs.

## 2. Component Implementation (Main Column)
*   **Customer Contact Details**:
    *   Card with header "Customer Contact Details" + "Existing Customer" badge.
    *   Grid for Email Address and Phone Number.
*   **Traveller Information**:
    *   Card with header "Traveller Information" + "Existing Traveller" badge.
    *   Fields: Full Name, Passport Number, Passport Expiry, DOB, Issue Date, Place of Issue, Nationality.
*   **Route & Trip Details**:
    *   Card with header + "One Way" badge.
    *   **Flight Segment**: Visual representation of Origin -> Destination with dates.
    *   **Flight Info**: Airline logo/name, Flight Number, Class.
    *   **Stopovers**: Section for stopover details (e.g., Singapore).

## 3. Component Implementation (Sidebar Column)
*   **Booking Details**:
    *   Booking ID, PNR Reference, Issued Through, Handled By (with avatar/initials), Booking Status.
*   **Financials**:
    *   Currency, Payment Status (Badge), Payment Method, Transaction ID, Date of Payment.
    *   **Cost Breakdown**: Cost Price, Add-ons, Selling Price (strikethrough/formatted), Grand Total (Blue text).
    *   **Profit Margin**: Green background section at the bottom.
*   **Add-ons & Services**:
    *   List of services (Meals, Seat, Luggage, Flyer Number) with prices.
    *   Add-ons Subtotal at the bottom.

## 4. Styling & Logic
*   **Tailwind CSS**: Use exact classes for spacing (`p-6`, `gap-6`), typography (`text-sm`, `font-bold`, `text-slate-500`), and colors (Slate 50/100/200/500/900, Primary Blue, Success Green).
*   **Icons**: Ensure `material-symbols-outlined` are used consistently.
*   **Data Binding**: Map existing `booking` object fields to the new UI structure.
    *   *Note*: Some fields like "Passport Issue Date", "Place of Issue", "Transaction ID", "Profit Margin" might need to be calculated or placeholders if missing in the current API response. I will use existing data where possible and safe fallbacks for UI matching.

## 5. Execution Steps
1.  **Refactor Main Page**: Completely rewrite the JSX in `page.tsx` to match the new grid structure.
2.  **Implement Sections**: Build each card (Customer, Traveller, Route, Booking Details, Financials, Add-ons) one by one.
3.  **Refine Styling**: Adjust padding, borders, shadows, and font weights to be pixel-perfect.
4.  **Verify Responsiveness**: Ensure it stacks correctly on mobile.

## 6. Verification
*   Check against reference image for visual accuracy.
*   Verify all buttons and links work (Edit, Back).
*   Ensure loading/error states remain intact.
