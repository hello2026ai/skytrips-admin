export const AIRLINE_LOGOS: Record<string, string> = {
  // Thai Airways
  "TG": "https://content.r9cdn.net/rimg/provider-logos/airlines/v/TG.png",
  // Emirates
  "EK": "https://content.r9cdn.net/rimg/provider-logos/airlines/v/EK.png",
  // Qatar Airways
  "QR": "https://content.r9cdn.net/rimg/provider-logos/airlines/v/QR.png",
  // Singapore Airlines
  "SQ": "https://content.r9cdn.net/rimg/provider-logos/airlines/v/SQ.png",
  // British Airways
  "BA": "https://content.r9cdn.net/rimg/provider-logos/airlines/v/BA.png",
  // Lufthansa
  "LH": "https://content.r9cdn.net/rimg/provider-logos/airlines/v/LH.png",
  // Air France
  "AF": "https://content.r9cdn.net/rimg/provider-logos/airlines/v/AF.png",
  // American Airlines
  "AA": "https://content.r9cdn.net/rimg/provider-logos/airlines/v/AA.png",
  // Delta
  "DL": "https://content.r9cdn.net/rimg/provider-logos/airlines/v/DL.png",
  // United
  "UA": "https://content.r9cdn.net/rimg/provider-logos/airlines/v/UA.png",
  // Turkish Airlines
  "TK": "https://content.r9cdn.net/rimg/provider-logos/airlines/v/TK.png",
  // Etihad
  "EY": "https://content.r9cdn.net/rimg/provider-logos/airlines/v/EY.png",
  // Cathay Pacific
  "CX": "https://content.r9cdn.net/rimg/provider-logos/airlines/v/CX.png",
  // Generic Fallback
  "DEFAULT": "https://cdn-icons-png.flaticon.com/512/7893/7893979.png"
};

export const getAirlineLogo = (code: string): string => {
  return AIRLINE_LOGOS[code.toUpperCase()] || AIRLINE_LOGOS["DEFAULT"];
};
