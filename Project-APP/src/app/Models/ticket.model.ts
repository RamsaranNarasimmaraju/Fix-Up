export interface TicketCreateDto {
    userId?: number;  // Optional user ID
    issueType: string;
    description: string;
    createdDate?: string;  // The date can be represented as a string in ISO format
    fileUpload?:File;  
  }
  export interface TicketReadDto {
    ticketId: number;
    userId?: number;  // Optional user ID
    issueType: string;
    description: string;
    createdDate?: string;  // The date can be represented as a string in ISO format
    tstatus?: string;  // Status of the ticket
    resolvedDate?: string;  // The resolved date in ISO string format
    fileUpload?: string;  // This will store the file as a byte array
  }
  export interface TicketUpdateDto {
    ticketId: number;
    userId?: number;  // Optional user ID
    issueType: string;
    description: string;
    createdDate?: string;  // The date can be represented as a string in ISO format
    tstatus?: string;  // Status of the ticket
    resolvedDate?: string;  // The resolved date in ISO string format
  
  }
    
  export interface ClosureEmailRequest {
    ticketId: number;
  }