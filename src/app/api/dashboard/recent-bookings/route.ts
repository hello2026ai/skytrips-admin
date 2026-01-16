import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type') || 'upcoming'; // 'upcoming' or 'recent'
    
    // Validate pagination params
    const pageNumber = isNaN(page) || page < 1 ? 1 : page;
    const pageSize = isNaN(limit) || limit < 1 || limit > 100 ? 10 : limit;
    const offset = (pageNumber - 1) * pageSize;

    let query = supabase.from('bookings').select('*', { count: 'exact' });

    const now = new Date();
    const todayStr = now.toISOString();

    if (type === 'upcoming') {
      // Upcoming: departureDate >= today
      const futureDate = new Date();
      futureDate.setDate(now.getDate() + 30); // Next 30 days
      const futureDateStr = futureDate.toISOString();

      query = query
        .gte('departureDate', todayStr)
        // .lte('departureDate', futureDateStr) // Optional: restrict to 30 days? Let's keep it open or user defined
        .order('departureDate', { ascending: true });
    } else {
      // Recent: created_at descending (newly created bookings)
      query = query.order('created_at', { ascending: false });
    }
    
    const { data, error, count } = await query.range(offset, offset + pageSize - 1);

    if (error) {
      console.error('Database query error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch booking data', 
          details: error.message 
        },
        { status: 500 }
      );
    }

    const bookings = data?.map(booking => ({
      bookingId: booking.id,
      customerName: `${booking.travellerFirstName} ${booking.travellerLastName}`.trim(),
      bookingDate: booking.departureDate || booking.travelDate || 'N/A', // Fallback
      serviceType: booking.airlines || 'Flight',
      status: booking.status || 'Pending',
      tripType: booking.tripType,
      route: `${booking.origin || 'N/A'} → ${booking.destination || 'N/A'}`,
      origin: booking.origin,
      destination: booking.destination,
      createdAt: booking.created_at
    })) || [];

    return NextResponse.json({
      success: true,
      data: bookings,
      meta: {
        page: pageNumber,
        limit: pageSize,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
        timestamp: new Date().toISOString()
      }
    });

  } catch (err: unknown) {
    console.error('API Error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal Server Error', 
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}
