// Streaming AI Response Types

export interface BaseStreamChunk {
  id: string
  type: 'text' | 'function_call' | 'function_result' | 'table' | 'thinking' | 'error'
  timestamp: number
  status?: 'pending' | 'complete' | 'error'
}

export interface TextChunk extends BaseStreamChunk {
  type: 'text'
  content: {
    text: string
    append?: boolean // whether to append to previous text or create new block
  }
}

export interface FunctionCallChunk extends BaseStreamChunk {
  type: 'function_call'
  content: {
    name: string
    args: Record<string, any>
    description?: string
  }
}

export interface FunctionResultChunk extends BaseStreamChunk {
  type: 'function_result'
  content: {
    function_call_id: string
    result: any
    success: boolean
    error_message?: string
  }
}

export interface TableChunk extends BaseStreamChunk {
  type: 'table'
  content: {
    title?: string
    headers: string[]
    rows: any[][]
    description?: string
    caption?: string
  }
}

export interface ThinkingChunk extends BaseStreamChunk {
  type: 'thinking'
  content: {
    text: string
    visible: boolean // whether user can see thinking
  }
}

export interface ErrorChunk extends BaseStreamChunk {
  type: 'error'
  content: {
    message: string
    code?: string
    details?: any
  }
}

export type StreamChunk = 
  | TextChunk 
  | FunctionCallChunk 
  | FunctionResultChunk 
  | TableChunk 
  | ThinkingChunk 
  | ErrorChunk

export interface StreamingMessage {
  id: string
  chunks: StreamChunk[]
  status: 'streaming' | 'complete' | 'error'
  created_at: number
}

export interface StreamingConversation {
  id: string
  messages: StreamingMessage[]
  is_streaming: boolean
}

// Component Props
export interface StreamingLeftPaneProps {
  conversation: StreamingConversation
  onSendMessage?: (message: string) => void
  onClearConversation?: () => void
  isStreaming: boolean
}

// Utility type for chunk renderers
export interface ChunkRendererProps<T extends StreamChunk> {
  chunk: T
  isLatest: boolean
}