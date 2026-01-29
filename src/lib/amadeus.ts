import Amadeus from 'amadeus';
import { env } from './env';

// Initialize the Amadeus client
// This is intended for server-side use only.
export const amadeus = new Amadeus({
    clientId: env.amadeus.clientId,
    clientSecret: env.amadeus.clientSecret,
    hostname: env.amadeus.env === 'production' ? 'production' : 'test'
});

/**
 * Helper to handle Amadeus API errors
 */
export function handleAmadeusError(error: any) {
    console.error('[Amadeus Error]:', error);
    if (error.response && error.response.data) {
        return error.response.data;
    }
    return { errors: [{ status: 500, title: 'Amadeus Integration Error', detail: error.message }] };
}
