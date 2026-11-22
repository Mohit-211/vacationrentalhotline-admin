import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import type { ApiData } from "@/api/types";

export interface Region {
  /** Such as "TX" or "ON". */
  code: string;
  name: string;
}

export interface Country {
  /** "US" or "CA". */
  code: string;
  name: string;
  /** "State" or "Province". */
  regionLabel: string;
  /** "Zip Code" or "Postal Code". */
  postalCodeLabel: string;
  postalCodeExample: string;
  regions: Region[];
}

export async function fetchCountries(): Promise<Country[]> {
  const { data } = await apiClient.get<ApiData<{ countries: Country[] }>>("/locations");
  return data.data.countries;
}

/** The countries and regions addresses can use. They don't change while the panel is open. */
export function useCountries() {
  return useQuery({ queryKey: ["locations"], queryFn: fetchCountries, staleTime: Infinity });
}

export interface PlaceParts {
  city?: string | null;
  regionCode?: string | null;
  countryCode?: string | null;
}

/** "Austin, Texas, United States", falling back to codes while names load. */
export function formatPlace(place: PlaceParts, countries: Country[] | undefined): string {
  const country = countries?.find((item) => item.code === place.countryCode);
  const region = country?.regions.find((item) => item.code === place.regionCode);
  return [place.city, region?.name ?? place.regionCode, country?.name ?? place.countryCode]
    .filter((part): part is string => Boolean(part?.trim()))
    .join(", ");
}
