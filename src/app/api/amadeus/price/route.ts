import { NextResponse } from 'next/server';
import { amadeus, handleAmadeusError } from '@/lib/amadeus';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { flightOffer } = body;

        if (!flightOffer) {
            return NextResponse.json(
                { errors: [{ status: 400, title: 'Missing parameters', detail: 'flightOffer is required' }] },
                { status: 400 }
            );
        }

        console.log('Confirming price for flight offer...');

        // Call Amadeus Flight Price API
        const response = await amadeus.shopping.flightOffersPrice.post(
            JSON.stringify({
                data: {
                    type: 'flight-offers-pricing',
                    flightOffers: [flightOffer]
                }
            })
        );

        return NextResponse.json(response.data);
    } catch (error: any) {
        const amadeusError = handleAmadeusError(error);
        return NextResponse.json(amadeusError, { status: error.response?.status || 500 });
    }
}
