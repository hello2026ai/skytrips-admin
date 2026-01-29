import { NextResponse } from 'next/server';
import { amadeus, handleAmadeusError } from '@/lib/amadeus';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const originLocationCode = searchParams.get('origin');
        const destinationLocationCode = searchParams.get('destination');
        const departureDate = searchParams.get('departureDate');
        const returnDate = searchParams.get('returnDate');
        const adults = searchParams.get('adults') || '1';
        const children = searchParams.get('children') || '0';
        const infants = searchParams.get('infants') || '0';
        const travelClass = searchParams.get('travelClass'); // ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST

        if (!originLocationCode || !destinationLocationCode || !departureDate) {
            return NextResponse.json(
                { errors: [{ status: 400, title: 'Missing parameters', detail: 'origin, destination, and departureDate are required' }] },
                { status: 400 }
            );
        }

        console.log(`Searching flights from ${originLocationCode} to ${destinationLocationCode} on ${departureDate}...`);

        const params: any = {
            originLocationCode,
            destinationLocationCode,
            departureDate,
            adults: parseInt(adults),
            children: parseInt(children),
            infants: parseInt(infants),
            max: 20, // Limit results
        };

        if (returnDate) {
            params.returnDate = returnDate;
        }

        if (travelClass) {
            params.travelClass = travelClass;
        }

        // Call Amadeus Flight Offers Search API
        const response = await amadeus.shopping.flightOffersSearch.get(params);

        return NextResponse.json(response.data);
    } catch (error: any) {
        const amadeusError = handleAmadeusError(error);
        return NextResponse.json(amadeusError, { status: error.response?.status || 500 });
    }
}
