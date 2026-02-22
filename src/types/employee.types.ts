export interface Address {
  city: string;
  state: string;
  country: string;
}

export interface Employee {
  id: number;
  name: string;
  email: string | null;
  department: string;
  role: string;
  salary: number;
  joinDate: string; // ISO date string
  isActive: boolean;
  skills: string[];
  address: Address;
  projects: number;
  lastReview: string | null;
  performanceRating: number;
}
