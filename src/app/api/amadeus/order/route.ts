import { NextResponse } from 'next/server';
import { amadeus, handleAmadeusError } from '@/lib/amadeus';
import { getAdminClient } from '@/lib/supabase-server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { flightOffer, travelers, customerData } = body;

        if (!flightOffer || !travelers || !Array.isArray(travelers)) {
            return NextResponse.json(
                { errors: [{ status: 400, title: 'Missing parameters', detail: 'flightOffer and travelers array are required' }] },
                { status: 400 }
            );
        }

        console.log('Creating flight order with Amadeus...');

        // Call Amadeus Flight Create Orders API
        const response = await amadeus.booking.flightOrders.post(
            JSON.stringify({
                data: {
                    type: 'flight-order',
                    flightOffers: [flightOffer],
                    travelers: travelers
                }
            })
        );

        const amadeusOrder = response.data;
        const pnr = amadeusOrder.associatedRecords?.[0]?.reference || 'N/A';

        console.log(`Amadeus order created successfully. PNR: ${pnr}`);

        // Save to Supabase
        const supabase = getAdminClient();
        if (supabase) {
            try {
                const itinerary = flightOffer.itineraries?.[0];
                const departureSegment = itinerary?.segments?.[0];
                const lastItinerary = flightOffer.itineraries?.[flightOffer.itineraries.length - 1];
                const arrivalSegment = lastItinerary?.segments?.[lastItinerary.segments.length - 1];

                const { data: bookingData, error: bookingError } = await supabase
                    .from('bookings')
                    .insert({
                        PNR: pnr,
                        bookingid: amadeusOrder.id,
                        bookingstatus: 'confirmed',
                        status: 'confirmed',
                        airlines: flightOffer.validatingAirlineCodes?.join(', '),
                        origin: departureSegment?.departure?.iataCode,
                        destination: arrivalSegment?.arrival?.iataCode,
                        departureDate: departureSegment?.departure?.at,
                        returnDate: flightOffer.itineraries.length > 1 ? lastItinerary?.segments?.[0]?.departure?.at : null,
                        sellingprice: parseFloat(flightOffer.price?.grandTotal || flightOffer.price?.total),
                        currencycode: flightOffer.price?.currency,
                        travellers: travelers.map((t: any) => ({
                            firstName: t.name.firstName,
                            lastName: t.name.lastName,
                            dateOfBirth: t.dateOfBirth,
                            gender: t.gender
                        })),
                        itineraries: flightOffer.itineraries,
                        email: customerData?.email || travelers[0]?.contact?.emailAddress,
                        phone: customerData?.phone || travelers[0]?.contact?.phones?.[0]?.number,
                        customer: customerData?.name || `${travelers[0]?.name?.firstName} ${travelers[0]?.name?.lastName}`,
                        tripType: flightOffer.itineraries.length > 1 ? 'Round Trip' : 'One Way',
                    })
                    .select()
                    .single();

                if (bookingError) {
                    console.error('Error saving booking to Supabase:', bookingError);
                    // We don't fail the request here as Amadeus order was successful
                } else {
                    console.log('Booking saved to Supabase:', bookingData?.id);
                }
            } catch (dbErr) {
                console.error('Database insertion failed:', dbErr);
            }
        }

        return NextResponse.json({
            success: true,
            data: amadeusOrder,
            pnr: pnr
        });
    } catch (error: any) {
        const amadeusError = handleAmadeusError(error);
        return NextResponse.json(amadeusError, { status: error.response?.status || 500 });
    }
}
