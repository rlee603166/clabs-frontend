export interface TableNode {
  id: string
  name: string
  type: string
  columns: string[]
  x: number
  y: number
  // Additional metadata from backend
  source_file?: string
  record_count?: number
  description?: string
  sample_data?: Record<string, any>
}

export interface Connection {
  id: string
  sourceTable: string
  targetTable: string
  sourceField: string
  targetField: string
  type: 'primary-foreign' | 'foreign-foreign' | 'inferred'
  confidence: number
}

/**
 * Detects connections between tables based on matching field names
 */
export class ConnectionDetector {
  /**
   * Auto-detect connections between tables based on field name patterns
   */
  static detectConnections(tables: TableNode[]): Connection[] {
    const connections: Connection[] = []
    const connectionId = () => Math.random().toString(36).substr(2, 9)

    // Compare each table with every other table
    for (let i = 0; i < tables.length; i++) {
      for (let j = i + 1; j < tables.length; j++) {
        const table1 = tables[i]
        const table2 = tables[j]

        // Find matching field names
        const matchingFields = this.findMatchingFields(table1.columns, table2.columns)

        matchingFields.forEach(({ field1, field2, confidence, type }) => {
          connections.push({
            id: connectionId(),
            sourceTable: table1.id,
            targetTable: table2.id,
            sourceField: field1,
            targetField: field2,
            type,
            confidence
          })
        })
      }
    }

    return connections
  }

  /**
   * Find matching fields between two tables
   */
  private static findMatchingFields(
    columns1: string[], 
    columns2: string[]
  ): Array<{
    field1: string
    field2: string
    confidence: number
    type: Connection['type']
  }> {
    const matches: Array<{
      field1: string
      field2: string
      confidence: number
      type: Connection['type']
    }> = []

    columns1.forEach(col1 => {
      columns2.forEach(col2 => {
        const match = this.calculateFieldMatch(col1, col2)
        if (match.confidence > 0.7) { // Only include high-confidence matches
          matches.push({
            field1: col1,
            field2: col2,
            ...match
          })
        }
      })
    })

    return matches
  }

  /**
   * Calculate how likely two fields are to be related
   */
  private static calculateFieldMatch(field1: string, field2: string): {
    confidence: number
    type: Connection['type']
  } {
    const f1 = field1.toLowerCase()
    const f2 = field2.toLowerCase()

    // Exact match - highest confidence
    if (f1 === f2) {
      return {
        confidence: 1.0,
        type: this.determineConnectionType(f1, f2)
      }
    }

    // ID field patterns
    if (this.isIdField(f1) && this.isIdField(f2)) {
      // Both are ID fields
      if (this.getIdBase(f1) === this.getIdBase(f2)) {
        return {
          confidence: 0.95,
          type: 'primary-foreign'
        }
      }
    }

    // Similar naming patterns
    const similarity = this.calculateStringSimilarity(f1, f2)
    if (similarity > 0.8) {
      return {
        confidence: similarity * 0.9, // Reduce confidence for non-exact matches
        type: 'inferred'
      }
    }

    return { confidence: 0, type: 'inferred' }
  }

  /**
   * Check if a field is likely an ID field
   */
  private static isIdField(field: string): boolean {
    const f = field.toLowerCase()
    return f.includes('id') || f.includes('_id') || f.endsWith('id')
  }

  /**
   * Extract the base name from an ID field (e.g., 'customer_id' -> 'customer')
   */
  private static getIdBase(field: string): string {
    const f = field.toLowerCase()
    return f.replace(/_?id$/, '').replace(/^id_?/, '')
  }

  /**
   * Determine connection type based on field characteristics
   */
  private static determineConnectionType(field1: string, field2: string): Connection['type'] {
    const f1 = field1.toLowerCase()
    const f2 = field2.toLowerCase()

    // If one ends with _id and the other is just id, it's likely PK->FK
    if ((f1.endsWith('_id') && f2 === 'id') || (f2.endsWith('_id') && f1 === 'id')) {
      return 'primary-foreign'
    }

    // If both end with _id, it's likely FK->FK
    if (f1.endsWith('_id') && f2.endsWith('_id')) {
      return 'foreign-foreign'
    }

    return 'inferred'
  }

  /**
   * Calculate string similarity using Levenshtein distance
   */
  private static calculateStringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1

    if (longer.length === 0) return 1.0

    const distance = this.levenshteinDistance(longer, shorter)
    return (longer.length - distance) / longer.length
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix = []

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }

    return matrix[str2.length][str1.length]
  }
}