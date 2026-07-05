/**
 * Notification Model
 * Represents a notification for real-time system events
 *
 * @interface Notification
 * @property {number} id - Unique identifier
 * @property {number} user_id - User who receives the notification
 * @property {NotificationType} type - Type of notification
 * @property {string} title - Notification title (max 255 chars)
 * @property {string} message - Notification message content
 * @property {string} [entity_type] - Type of related entity (project, opportunity, review, client, etc)
 * @property {number} [entity_id] - ID of the related entity
 * @property {boolean} read - Whether notification has been read
 * @property {Record<string, any>} [metadata] - Additional contextual data in JSON format
 * @property {Date} created_at - Timestamp when notification was created
 */
export interface Notification {
  id: number;
  user_id: number;
  type: NotificationType;
  title: string;
  message: string;
  entity_type?: string;
  entity_id?: number;
  read: boolean;
  metadata?: Record<string, any>;
  created_at: Date;
}

/**
 * Notification Types Enum
 * Defines all possible notification types in the system
 */
export enum NotificationType {
  COMMENT = 'comment',
  STATUS_CHANGE = 'status_change',
  NEW_OPPORTUNITY = 'new_opportunity',
  DEADLINE_APPROACHING = 'deadline_approaching',
  CHAT_MESSAGE = 'chat_message',
  APPROVAL_PENDING = 'approval_pending',
  PROJECT_ASSIGNED = 'project_assigned',
  COLLABORATOR_ADDED = 'collaborator_added',
}

/**
 * Input for creating a new notification
 */
export interface CreateNotificationInput {
  user_id: number;
  type: NotificationType;
  title: string;
  message: string;
  entity_type?: string;
  entity_id?: number;
  metadata?: Record<string, any>;
}

/**
 * Database representation of a notification
 * Used for raw database queries (with snake_case fields)
 */
export interface DbNotification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  entity_type: string | null;
  entity_id: number | null;
  read: number; // SQLite uses 0/1 for boolean
  metadata: string | null; // SQLite stores JSON as string
  created_at: string; // SQLite stores dates as ISO strings
}
