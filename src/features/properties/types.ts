export interface PropertyNote {
  id?: number;
  notes: string;
}

export interface Property {
  id: number;
  user_id?: number | null;
  property_owner_name?: string | null;
  property_owner_email_1?: string | null;
  property_owner_email_2?: string | null;
  property_owner_mobile_number_1?: string | null;
  property_owner_mobile_number_2?: string | null;
  full_address?: string | null;
  address_line_1?: string | null;
  address_line_2?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  country?: string | null;
  /** "ACTIVATE" or "DEACTIVATE" from the API. */
  subscription_status?: string | null;
  subscription_start_date?: string | null;
  subscription_end_date?: string | null;
  validity?: string | number | null;
  property_notes?: PropertyNote[] | null;
}
