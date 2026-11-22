import { downloadCsv } from "@/utils/csv";
import type { Property } from "./types";

export function exportPropertiesCsv(properties: Property[], fileName: string): void {
  downloadCsv(
    fileName,
    [
      "ID",
      "Property owner",
      "Owner email 1",
      "Owner email 2",
      "Owner mobile 1",
      "Owner mobile 2",
      "Full address",
      "Address line 1",
      "Address line 2",
      "City",
      "State",
      "Zip code",
      "Country",
    ],
    properties.map((property) => [
      property.id,
      property.property_owner_name,
      property.property_owner_email_1,
      property.property_owner_email_2,
      property.property_owner_mobile_number_1,
      property.property_owner_mobile_number_2,
      property.full_address,
      property.address_line_1,
      property.address_line_2,
      property.city,
      property.state,
      property.zip_code,
      property.country,
    ]),
  );
}
