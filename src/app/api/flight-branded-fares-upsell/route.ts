import { NextRequest, NextResponse } from "next/server";
import { getAmadeus } from "@/lib/amadeusClient";

export const runtime = "nodejs";

/**
 * @swagger
 * /api/flight-branded-fares-upsell:
 *   post:
 *     summary: Get flight branded fares upsell
 *     description: Retrieve branded fare options (upsells) for a specific flight offer.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Full flight offer object from search results
 *     responses:
 *       200:
 *         description: Successfully retrieved branded fares
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Amadeus API or server error
 */
export async function POST(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get("page") || "1");
        const limit = Number(searchParams.get("limit") || "10");

        const body = await req.json().catch(() => null);
        if (!body) {
            return NextResponse.json({ ok: false, error: "invalid_body", message: "Flight offer required in body" }, { status: 400 });
        }

        const amadeus = getAmadeus();

        try {
            // Reusing the same logic as price/route.ts for consistency and to avoid SDK method override issues
            const token = await amadeus.client.accessToken.bearerToken(amadeus.client);
            const baseUrl = process.env.AMADEUS_BASE_URL?.replace(/\/+$/, '') || 'https://travel.api.amadeus.com';
            const url = `${baseUrl}/v1/shopping/flight-offers/upselling`;

            const rawResponse = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/vnd.amadeus+json",
                    "Accept": "application/json, application/vnd.amadeus+json"
                },
                body: JSON.stringify({
                    data: {
                        type: "flight-offers-upselling",
                        flightOffers: [body],
                    },
                })
            });

            const json = await rawResponse.json();

            if (!rawResponse.ok) {
                throw {
                    response: {
                        statusCode: rawResponse.status,
                        body: JSON.stringify(json)
                    }
                };
            }

            const data = json.data || [];
            const dictionaries = json.dictionaries || {};

            // Pagination matching skytrips_backend logic
            const total = data.length;
            const startIndex = (page - 1) * limit;
            const paginatedData = data.slice(startIndex, startIndex + limit);

            return NextResponse.json({
                ok: true,
                data: paginatedData,
                dictionaries: dictionaries,
                meta: {
                    limit,
                    page,
                    total,
                },
            });

        } catch (amadeusError: any) {
            console.error("Amadeus Branded Fares Upsell Error:", JSON.stringify(amadeusError, null, 2));

            let message = "Unknown Amadeus error";
            let details = null;
            let statusCode = 500;

            if (amadeusError?.response) {
                statusCode = amadeusError.response.statusCode || 500;
                try {
                    const parsed = typeof amadeusError.response.body === 'string'
                        ? JSON.parse(amadeusError.response.body)
                        : amadeusError.response.body;
                    if (parsed.errors && Array.isArray(parsed.errors)) {
                        message = parsed.errors.map((e: any) => `${e.title}: ${e.detail}`).join(" | ");
                        details = parsed.errors;
                    } else if (parsed.error_description) {
                        message = parsed.error_description;
                    }
                } catch {
                    message = `API Error: ${amadeusError.response.statusCode}`;
                }
            } else if (amadeusError instanceof Error) {
                message = amadeusError.message;
            }

            return NextResponse.json({
                ok: false,
                error: "amadeus_error",
                message,
                details
            }, { status: statusCode });
        }

    } catch (err: unknown) {
        console.error("Server Error in branded-fares-upsell:", err);
        const message = err instanceof Error ? err.message : "Internal server error";
        return NextResponse.json({ ok: false, error: "server_error", message }, { status: 500 });
    }
}
