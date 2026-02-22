import type { Employee } from "./employee.types";

export interface TableColumn {
  key: string;
  label: string;
  render?: (value: any, row: Employee) => React.ReactNode;
  sortable?: boolean;
}

export interface FilterResult {
  data: Employee[];
  total: number;
  filtered: number;
}
