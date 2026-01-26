# **App Name**: Apdrošinātājs Pro

## Core Features:

- Dynamic Property Forms: Dynamically renders property details forms based on objectType (Apartments, Houses, Outbuildings) with appropriate fields and validations (totalFloors, currentFloor, propertyArea, ownerName).
- Data Validation and Branching: Implements client-side data validation for property details (integer and float types, string length). The tool branches form fields and validations based on objectType to prioritize floor information for apartments and construction details for houses.
- Underwriting Parameter Capture: Captures underwriting parameters like Build Year Ranges (pre-defined options), Occupancy Status (boolean), and Prior Losses (boolean) via UI toggles.
- Movable Property Section: Enables a nested 'Kustamā manta' section with a toggle to reveal a sub-toggle for 'Vērtīga manta' (Art, jewelry).
- Legal Status Selection: Provides a clear selection between 'Fiziska persona' and 'Juridiska persona' for legal status.
- Data Serialization and Email: Serializes all property details and underwriting parameters into a professional email body for the handleSendToBroker function.
- State management buildings array: Maintain array state in a Nextjs Context Provider and make available in every functional component.

## Style Guidelines:

- Primary color: Compensa Green (#008D41) to maintain brand consistency as the main action color.
- Background color: Light grey (#F0F0F0) for a clean, high-contrast interface. (#F0F0F0)
- Accent color: A slightly desaturated light-green (#3cae72), to add visual interest while still remaining harmonious with the primary brand color.
- Body font: 'PT Sans', sans-serif, to provide a modern look with some warmth.
- Headline font: 'Playfair', sans-serif, for an elegant, high-end feel, combined with PT Sans for longer text.
- Utilize Lucide Icons for a consistent and modern aesthetic.
- Maintain rounded containers (rounded-3xl) and subtle shadows for a soft, modern look.
- Ensure the interface is fully mobile-responsive for optimal user experience on all devices.