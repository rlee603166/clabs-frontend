# Streaming AI Chat Implementation

## Overview

This document outlines the streaming response structure for real-time AI interactions in the frontend. The system is designed to handle chunked responses where AI can dynamically send different types of content (text, function calls, tables, etc.) as they become available, rather than a fixed chat-table-functions format.

## Backend Response Structure

### WebSocket/SSE Message Format

```json
{
  "type": "chunk",
  "conversation_id": "conv-123",
  "message_id": "msg-456", 
  "chunk": {
    "id": "chunk-789",
    "type": "text|function_call|function_result|table|thinking|error",
    "timestamp": 1640995200000,
    "status": "pending|complete|error",
    "content": { /* type-specific content */ }
  }
}
```

### Chunk Types

#### 1. Text Chunk
AI text responses, can be streamed incrementally:
```json
{
  "id": "chunk-1",
  "type": "text",
  "timestamp": 1640995200000,
  "status": "pending|complete",
  "content": {
    "text": "I'm analyzing your customer data...",
    "append": false
  }
}
```

#### 2. Function Call Chunk
When AI decides to call a function:
```json
{
  "id": "chunk-2", 
  "type": "function_call",
  "timestamp": 1640995200000,
  "status": "pending|complete|error",
  "content": {
    "name": "find_similar_customers",
    "args": {
      "company": "Acme Corp",
      "criteria": ["industry", "size"]
    },
    "description": "Finding customers with similar profiles"
  }
}
```

#### 3. Function Result Chunk
Result of function execution:
```json
{
  "id": "chunk-3",
  "type": "function_result", 
  "timestamp": 1640995200000,
  "status": "complete",
  "content": {
    "function_call_id": "chunk-2",
    "result": {
      "found": 12,
      "processing_time": "45ms"
    },
    "success": true,
    "error_message": null
  }
}
```

#### 4. Table Chunk
Structured data display:
```json
{
  "id": "chunk-4",
  "type": "table",
  "timestamp": 1640995200000, 
  "status": "complete",
  "content": {
    "title": "Similar Customers",
    "headers": ["Company", "Industry", "Size", "Similarity"],
    "rows": [
      ["TechFlow Inc", "Technology", "Medium", "94%"],
      ["DataCorp Solutions", "Technology", "Medium", "89%"]
    ],
    "description": "Customers ranked by similarity score",
    "caption": "Top 10 results shown"
  }
}
```

#### 5. Thinking Chunk
AI reasoning process (optional visibility):
```json
{
  "id": "chunk-5",
  "type": "thinking",
  "timestamp": 1640995200000,
  "status": "complete", 
  "content": {
    "text": "Let me analyze the customer data to find patterns...",
    "visible": true
  }
}
```

#### 6. Error Chunk
Error handling:
```json
{
  "id": "chunk-6",
  "type": "error",
  "timestamp": 1640995200000,
  "status": "error",
  "content": {
    "message": "Failed to connect to customer database",
    "code": "DB_CONNECTION_ERROR",
    "details": {
      "timeout": "30s",
      "retries": 3
    }
  }
}
```

## Streaming Flow

### Example Conversation Flow

1. **User Input**: "Show me customers similar to Acme Corp"

2. **AI Response Stream** (multiple chunks sent over time):
   ```
   Chunk 1: Text - "I'll help you find similar customers..."
   Chunk 2: Function Call - find_similar_customers()
   Chunk 3: Function Result - {found: 12, time: "45ms"}
   Chunk 4: Text - "Found 12 similar customers. Here are the top matches:"
   Chunk 5: Table - Customer similarity results
   Chunk 6: Text - "Would you like me to analyze their support tickets as well?"
   ```

### Message Status States

- **streaming**: Message is actively receiving chunks
- **complete**: All chunks received, message is final
- **error**: Message encountered an error during streaming

### Chunk Status States

- **pending**: Chunk is being processed (shows loading/pulse animation)
- **complete**: Chunk processing finished successfully
- **error**: Chunk processing failed

## Frontend Implementation

### Key Components

1. **StreamingConversation**: Container for all messages
2. **StreamingMessage**: Contains array of chunks
3. **Chunk Renderers**: Specialized components for each chunk type
4. **Auto-scrolling**: Messages area scrolls as new chunks arrive
5. **Real-time Updates**: UI updates immediately as chunks stream in

### State Management

```typescript
interface StreamingConversation {
  id: string
  messages: StreamingMessage[]
  is_streaming: boolean
}

interface StreamingMessage {
  id: string
  chunks: StreamChunk[]
  status: 'streaming' | 'complete' | 'error'
  created_at: number
}
```

## Backend Implementation Guide

### WebSocket Handler
```python
async def handle_ai_query(websocket, message):
    conversation_id = message['conversation_id']
    user_message = message['content']
    
    # Send acknowledgment
    await websocket.send(json.dumps({
        "type": "message_started",
        "conversation_id": conversation_id,
        "message_id": generate_id()
    }))
    
    # Stream AI response chunks
    async for chunk in ai_model.stream_response(user_message):
        await websocket.send(json.dumps({
            "type": "chunk",
            "conversation_id": conversation_id, 
            "message_id": message_id,
            "chunk": chunk
        }))
    
    # Mark message complete
    await websocket.send(json.dumps({
        "type": "message_complete",
        "conversation_id": conversation_id,
        "message_id": message_id
    }))
```

### AI Model Integration
```python
async def stream_response(self, query):
    # Initial thinking
    yield create_chunk("thinking", {
        "text": "Analyzing the query...",
        "visible": True
    })
    
    # Function call decision
    if self.needs_function_call(query):
        func_call_chunk = create_chunk("function_call", {
            "name": "search_database",
            "args": {"query": query},
            "description": "Searching customer database"
        })
        yield func_call_chunk
        
        # Execute function
        try:
            result = await self.execute_function(func_call_chunk)
            yield create_chunk("function_result", {
                "function_call_id": func_call_chunk["id"],
                "result": result,
                "success": True
            })
        except Exception as e:
            yield create_chunk("error", {
                "message": str(e),
                "code": "FUNCTION_ERROR"
            })
    
    # Generate response text
    async for text in self.generate_text_stream(query):
        yield create_chunk("text", {
            "text": text,
            "append": True
        })
    
    # Add table if data available
    if self.has_tabular_data():
        yield create_chunk("table", {
            "title": "Results",
            "headers": ["Name", "Value"],
            "rows": self.get_table_data()
        })
```

## Usage Examples

### Simple Text Response
```
User: "Hello"
AI Stream: [Text: "Hello! How can I help you today?"]
```

### Complex Data Query
```
User: "Show me our top customers and their recent orders"
AI Stream: [
  Text: "I'll analyze your customer and order data...",
  Function Call: get_top_customers(),
  Function Result: {customers: [...], processing_time: "120ms"},
  Text: "Here are your top 10 customers:",
  Table: Customer data with names, revenue, etc.,
  Function Call: get_recent_orders(),
  Function Result: {orders: [...], processing_time: "85ms"}, 
  Text: "And here are their recent orders:",
  Table: Order data with dates, amounts, etc.,
  Text: "Would you like me to analyze any trends in this data?"
]
```

This structure allows for flexible, real-time AI interactions where content appears dynamically based on what the AI needs to do, rather than forcing a rigid format.