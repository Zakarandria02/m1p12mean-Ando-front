export interface Appointment {
    id: string;
    client: string;
    vehicle: string;
    service: string;
    date: Date;
    time: string;
    status: string;
  }

  export interface Invoice {
    _id?: string;
    invoiceNumber: string;
    date: Date;
    client: {
      name: string;
      address: string;
      city: string;
      email: string;
    };
    items: {
      description: string;
      amount: number;
    }[];
    total: number;
    status: 'unpaid' | 'paid' | 'cancelled';
    paymentTerms: string;
    notes?: string;
  }