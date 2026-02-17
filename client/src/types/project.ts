export type ProjectStatus = 'active' | 'on_hold' | 'completed';

export interface Project {
  id: string;
  name: string;
  clientName: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string | null;
  description: string;
}
