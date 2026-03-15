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
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  booked_at: string;
}

export interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
}
