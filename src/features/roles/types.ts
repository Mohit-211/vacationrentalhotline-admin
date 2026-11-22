export interface Role {
  id: number;
  name: string;
  abbreviation?: string | null;
}

export interface RoleFormValues {
  name: string;
  abbreviation: string;
}
