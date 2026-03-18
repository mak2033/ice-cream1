export interface Booking {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  address: string;
  guests: number;
  googleMapsUrl: string;
  price: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  booked_at: string;
}

export interface PricingTier {
  id: string;
  minGuests: number;
  maxGuests: number;
  price: number;
}

export interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
}
