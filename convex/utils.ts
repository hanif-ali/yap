// Utility functions for generating custom IDs

export function generateThreadId(): string {
  return `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateStreamId(): string {
  return `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Generic ID generator with prefix
export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
} 