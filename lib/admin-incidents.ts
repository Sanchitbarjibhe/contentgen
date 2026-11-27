export type AdminIncidentRecord = {
  id: string;
  title: string;
  details: string | null;
  status: string;
  createdAt: string;
  resolvedAt: string | null;
};
