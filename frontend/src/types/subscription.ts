export interface SubscriptionPlan {
  id: number;
  documentId: string;
  name: string;
  user_type: "company" | "investor" | "expert";
  price_monthly: number;
  price_yearly: number | null;
  stripe_price_id_monthly: string | null;
  stripe_price_id_yearly: string | null;
  features: string[];
  is_popular: boolean;
  call_minutes: number;
  directory_listings: number;
  max_contacts: number;
  createdAt: string;
  updatedAt: string;
}
