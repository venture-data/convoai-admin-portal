export interface KnowledgeBase {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  qdrant_collection: string;
  document_count?: number;
}

export interface Document {
  id: string;
  filename: string;
  content_type: string;
  content: string;
  knowledge_base_id: string;
  created_at: string;
  updated_at: string;
  chunk_count: number;
}

export interface KnowledgeBaseResponse {
  items: KnowledgeBase[];
}

export interface DocumentsResponse {
  items: Document[];
}

export interface CreateKnowledgeBaseData {
  name: string;
  description?: string;
}

export interface UploadDocumentData {
  file: File;
} 