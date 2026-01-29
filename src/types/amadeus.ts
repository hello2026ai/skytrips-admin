export interface AmadeusTraveler {
    id: string;
    dateOfBirth: string;
    name: {
        firstName: string;
        lastName: string;
    };
    gender: 'MALE' | 'FEMALE';
    contact: {
        emailAddress: string;
        phones: Array<{
            deviceType: 'MOBILE';
            countryCallingCode: string;
            number: string;
        }>;
    };
    documents?: Array<{
        documentType: 'PASSPORT';
        number: string;
        expiryDate: string;
        issuanceCountry: string;
        nationality: string;
        holder: boolean;
    }>;
}

export interface AmadeusFlightOffer {
    type: 'flight-offer';
    id: string;
    source: string;
    instantTicketingRequired: boolean;
    nonHomogeneous: boolean;
    oneWay: boolean;
    lastTicketingDate: string;
    numberOfBookableSeats: number;
    itineraries: any[];
    price: {
        currency: string;
        total: string;
        base: string;
        fees: any[];
        grandTotal: string;
    };
    pricingOptions: {
        fareType: string[];
        includedCheckedBagsOnly: boolean;
    };
    validatingAirlineCodes: string[];
    travelerPricings: any[];
}
