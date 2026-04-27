import { ClubCategory, ClubViewFilter } from "../types/club";

export const CATEGORY_OPTIONS = [
  "Academics",
  "Culture and Performing Arts",
  "Socio Politics",
];

export const CATEGORY_LABEL_MAP: Record<ClubCategory, string> = {
  academics: "Academics",
  culture_and_performing_arts: "Culture and Performing Arts",
  socio_politics: "Socio Politics",
};

export const CATEGORY_VALUE_MAP: Record<string, ClubCategory> = {
  Academics: "academics",
  "Culture and Performing Arts": "culture_and_performing_arts",
  "Socio Politics": "socio_politics",
};

export const VIEW_FILTER_OPTIONS = ["All clubs", "My clubs", "Pending"];

export const VIEW_FILTER_VALUE_MAP: Record<string, ClubViewFilter> = {
  "All clubs": "all",
  "My clubs": "my",
  Pending: "pending",
};

export const VIEW_FILTER_LABEL_MAP: Record<ClubViewFilter, string> = {
  all: "All clubs",
  my: "My clubs",
  pending: "Pending",
};
