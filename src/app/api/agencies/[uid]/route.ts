import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase-server";

export async function GET(_: Request, { params }: { params: Promise<{ uid: string }> }) {
  const { uid } = await params;
  const supabase = getAdminClient();
  if (!supabase) return NextResponse.json({ error: "Server config missing" }, { status: 500 });
  const { data, error } = await supabase.from("agencies").select("*").eq("uid", uid).maybeSingle();
  if (error || !data) return NextResponse.json({ error: error?.message || "Not found" }, { status: 404 });
  const refs = await supabase.from("agency_booking_refs").select("booking_id").eq("agency_uid", uid);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let fullBookings: any[] = [];
  const bookingIds = new Set<number>();

  // 1. Collect IDs from manual refs
  if (refs.data && refs.data.length > 0) {
    refs.data.forEach(r => bookingIds.add(r.booking_id));
  }

  // 2. Fetch bookings directly linked by agency name (issuedthroughagency)
  if (data.agency_name) {
    const nameRes = await supabase
      .from("bookings")
      .select("id")
      .eq("issuedthroughagency", data.agency_name);
    
    if (nameRes.data) {
      nameRes.data.forEach((b: { id: number }) => bookingIds.add(b.id));
    }
  }

  // 3. Fetch full details for all collected IDs
  if (bookingIds.size > 0) {
    const bookingsRes = await supabase
      .from("bookings")
      .select("*")
      .in("id", Array.from(bookingIds))
      .order("created_at", { ascending: false })
      .limit(500); // Limit to 500 recent bookings to prevent timeouts
    fullBookings = bookingsRes.data || [];
  }

  return NextResponse.json({ 
    agency: data, 
    bookings: refs.data || [], 
    fullBookings: fullBookings,
    stats: { totalBookings: fullBookings.length } 
  });
}

export async function PUT(req: Request, { params }: { params: Promise<{ uid: string }> }) {
  const { uid } = await params;
  const supabase = getAdminClient();
  if (!supabase) return NextResponse.json({ error: "Server config missing" }, { status: 500 });
  const body = await req.json().catch(() => null);
  const { agency_name, contact_person, number, iata_code, status, booking_ids, draft } = body || {};
  const { error } = await supabase.from("agencies").update({ agency_name, contact_person, number, iata_code, status, draft }).eq("uid", uid);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (Array.isArray(booking_ids)) {
    await supabase.from("agency_booking_refs").delete().eq("agency_uid", uid);
    if (booking_ids.length > 0) {
      const rows = booking_ids.map((id: number) => ({ agency_uid: uid, booking_id: id }));
      const refRes = await supabase.from("agency_booking_refs").insert(rows);
      if (refRes.error) return NextResponse.json({ error: refRes.error.message }, { status: 500 });
    }
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ uid: string }> }) {
  const { uid } = await params;
  const supabase = getAdminClient();
  if (!supabase) return NextResponse.json({ error: "Server config missing" }, { status: 500 });
  
  // Log the deletion attempt
  console.log(`[DELETE] Attempting to delete agency: ${uid}`);

  const body = await req.json().catch(() => null);
  const mode = body?.mode || "soft";

  try {
    // Check if agency exists first
    const { data: existing, error: checkError } = await supabase
      .from("agencies")
      .select("uid, agency_name")
      .eq("uid", uid)
      .single();

    if (checkError || !existing) {
        console.error(`[DELETE] Agency not found: ${uid}`, checkError);
        return NextResponse.json({ error: "Agency not found" }, { status: 404 });
    }

    if (mode === "soft") {
        console.log(`[DELETE] Soft deleting agency: ${existing.agency_name} (${uid})`);
        const { error } = await supabase
            .from("agencies")
            .update({ status: "inactive", deleted_at: new Date().toISOString() })
            .eq("uid", uid);
        
        if (error) {
            console.error(`[DELETE] Soft delete failed for ${uid}:`, error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ ok: true });
    }

    // Hard delete
    console.log(`[DELETE] Hard deleting agency: ${existing.agency_name} (${uid})`);
    
    // First remove related booking refs to satisfy foreign key constraints if cascading isn't set
    const { error: refError } = await supabase
        .from("agency_booking_refs")
        .delete()
        .eq("agency_uid", uid);

    if (refError) {
        console.error(`[DELETE] Failed to delete booking refs for ${uid}:`, refError);
        // We might continue if it's just that there were no refs, but error usually implies DB issue.
        // If the error is foreign key violation elsewhere, we need to know.
    }

    const { error } = await supabase.from("agencies").delete().eq("uid", uid);
    if (error) {
        console.error(`[DELETE] Hard delete failed for ${uid}:`, error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });

  } catch (err) {
      console.error(`[DELETE] Unexpected error deleting ${uid}:`, err);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
