import { NextResponse } from "next/server";
import { getAmadeus } from "@/lib/amadeusClient";

export const runtime = "nodejs";

export async function GET(_: Request, ctx: { params: { id: string } }) {
  try {
    const id = ctx.params?.id;
    if (!id) {
      return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });
    }
    const amadeus = getAmadeus();
    const response = await amadeus.booking.flightOrder(id).get();
    return NextResponse.json({ ok: true, raw: response.result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: "server_error", message }, { status: 500 });
  }
}

