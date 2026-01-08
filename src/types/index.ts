export interface Booking {
  id?: number;
  travellerFirstName: string;
  travellerLastName: string;
  PNR: string;
  ticketNumber: string;
  airlines: string;
  origin: string;
  transit: string;
  destination: string;
  tripType: string;
  issueMonth: string;
  IssueDay: string;
  issueYear: string;
  buyingPrice: string;
  payment: string;
  created_at?: string;
  updated_at?: string;
}

export interface Customer {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  userType: string;
  isActive: string;
  country: string;
  address: any;
  phoneCountryCode: string;
  isDisabled: string;
  isVerified: string;
  passport: any;
  socialProvider: string;
  socialId: string;
  referralCode: string;
  created_at?: string;
}
