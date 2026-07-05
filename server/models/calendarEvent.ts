export interface CalendarEvent {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  type: EventType;
  project_id?: number;
  start_date: Date;
  end_date: Date;
  all_day: boolean;
  color?: string;
  created_at: Date;
}

export enum EventType {
  PROJECT = 'project',
  DEADLINE = 'deadline',
  MEETING = 'meeting',
  SHOOTING = 'shooting',
  DELIVERY = 'delivery',
  OTHER = 'other',
}

export interface CreateCalendarEventInput {
  user_id: number;
  title: string;
  description?: string;
  type: EventType;
  project_id?: number;
  start_date: Date;
  end_date: Date;
  all_day?: boolean;
  color?: string;
}
