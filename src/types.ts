export interface Booking {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  address: string;
  guests: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  booked_at: string;
}

export interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
}
