"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api-instance";
import { KnowledgeBase, KnowledgeBaseResponse, CreateKnowledgeBaseData, Document, DocumentsResponse } from "@/app/dashboard/knowledge-base/types";

export function useKnowledgeBase() {
  const queryClient = useQueryClient();

  // Fetch all knowledge bases
  const { data: knowledgeBases, isLoading, error } = useQuery({
    queryKey: ['knowledge-bases'],
    queryFn: async (): Promise<KnowledgeBaseResponse> => {
      const response = await api.get('api/v1/knowledge-base', {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - session expired, please login again');
        }
        throw new Error('Something went wrong, please try again or refresh the page');
      }

      const data = await response.json();
      // API returns an array directly, not wrapped in items
      return {
        items: Array.isArray(data) ? data : []
      };
    },
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  });

  // Create knowledge base
  const createKnowledgeBase = useMutation({
    mutationFn: async (data: CreateKnowledgeBaseData): Promise<KnowledgeBase> => {
      if (!api.isTokenAvailable()) {
        throw new Error("Knowledge base not created because token is not in local storage. Please refresh the page or log in again.");
      }

      const response = await api.post('api/v1/knowledge-base', {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to create knowledge base');
      }

      return responseData;
    },
    onMutate: async (newKB: CreateKnowledgeBaseData) => {
      await queryClient.cancelQueries({ queryKey: ['knowledge-bases'] });
      const previousKBs = queryClient.getQueryData<KnowledgeBaseResponse>(['knowledge-bases']);

      const optimisticKB: KnowledgeBase = {
        id: `temp-${Date.now()}`,
        name: newKB.name,
        description: newKB.description || null,
        owner_id: 'current-user',
        qdrant_collection: `temp-collection-${Date.now()}`,
        document_count: 0
      };

      queryClient.setQueryData<KnowledgeBaseResponse>(['knowledge-bases'], (old) => {
        if (!old) return { items: [optimisticKB] };
        return {
          ...old,
          items: [...old.items, optimisticKB]
        };
      });

      return { previousKBs };
    },
    onError: (err, newKB, context) => {
      if (context?.previousKBs) {
        queryClient.setQueryData(['knowledge-bases'], context.previousKBs);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-bases'] });
    }
  });

  // Delete knowledge base
  const deleteKnowledgeBase = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (!api.isTokenAvailable()) {
        throw new Error("Knowledge base not deleted because token is not in local storage. Please refresh the page or log in again.");
      }
      
      const response = await api.delete(`api/v1/knowledge-base/${id}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete knowledge base');
      }
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['knowledge-bases'] });
      const previousKBs = queryClient.getQueryData<KnowledgeBaseResponse>(['knowledge-bases']);

      queryClient.setQueryData<KnowledgeBaseResponse>(['knowledge-bases'], (old) => {
        if (!old) return { items: [] };
        return {
          ...old,
          items: old.items.filter((kb) => kb.id !== id)
        };
      });

      return { previousKBs };
    },
    onError: (err, id, context) => {
      if (context?.previousKBs) {
        queryClient.setQueryData(['knowledge-bases'], context.previousKBs);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-bases'] });
    }
  });

  return {
    knowledgeBases,
    isLoading,  
    error,
    createKnowledgeBase,
    deleteKnowledgeBase,
    isCreating: createKnowledgeBase.isPending,
    isDeleting: deleteKnowledgeBase.isPending
  };
}

export function useDocuments(knowledgeBaseId: string | null) {
  const queryClient = useQueryClient();

  // Fetch documents for a specific knowledge base
  const { data: documents, isLoading, error } = useQuery({
    queryKey: ['documents', knowledgeBaseId],
    queryFn: async (): Promise<DocumentsResponse> => {
      if (!knowledgeBaseId) {
        return { items: [] };
      }

      const response = await api.get(`api/v1/knowledge-base/${knowledgeBaseId}/documents`, {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - session expired, please login again');
        }
        throw new Error('Something went wrong, please try again or refresh the page');
      }

      const data = await response.json();
      // API returns an array directly, not wrapped in items
      return {
        items: Array.isArray(data) ? data : []
      };
    },
    enabled: !!knowledgeBaseId,
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  });

  // Upload document
  const uploadDocument = useMutation({
    mutationFn: async ({ knowledgeBaseId, file }: { knowledgeBaseId: string; file: File }): Promise<Document> => {
      if (!api.isTokenAvailable()) {
        throw new Error("Document not uploaded because token is not in local storage. Please refresh the page or log in again.");
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(`api/v1/knowledge-base/${knowledgeBaseId}/upload`, {
        body: formData,
        credentials: 'include'
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to upload document');
      }

      return responseData;
    },
    onMutate: async ({ knowledgeBaseId, file }) => {
      await queryClient.cancelQueries({ queryKey: ['documents', knowledgeBaseId] });
      const previousDocs = queryClient.getQueryData<DocumentsResponse>(['documents', knowledgeBaseId]);

      const optimisticDoc: Document = {
        id: `temp-${Date.now()}`,
        filename: file.name,
        content_type: file.type || 'application/octet-stream',
        content: 'Processing...',
        knowledge_base_id: knowledgeBaseId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        chunk_count: 0
      };

      queryClient.setQueryData<DocumentsResponse>(['documents', knowledgeBaseId], (old) => {
        if (!old) return { items: [optimisticDoc] };
        return {
          ...old,
          items: [...old.items, optimisticDoc]
        };
      });

      return { previousDocs };
    },
    onError: (err, { knowledgeBaseId }, context) => {
      if (context?.previousDocs) {
        queryClient.setQueryData(['documents', knowledgeBaseId], context.previousDocs);
      }
    },
    onSettled: (data, error, { knowledgeBaseId }) => {
      queryClient.invalidateQueries({ queryKey: ['documents', knowledgeBaseId] });
      queryClient.invalidateQueries({ queryKey: ['knowledge-bases'] });
    }
  });

  // Delete individual document
  const deleteDocument = useMutation({
    mutationFn: async ({ knowledgeBaseId, documentId }: { knowledgeBaseId: string; documentId: string }): Promise<void> => {
      if (!api.isTokenAvailable()) {
        throw new Error("Document not deleted because token is not in local storage. Please refresh the page or log in again.");
      }
      
      const response = await api.delete(`api/v1/knowledge-base/${knowledgeBaseId}/documents/${documentId}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete document');
      }
    },
    onMutate: async ({ knowledgeBaseId, documentId }) => {
      await queryClient.cancelQueries({ queryKey: ['documents', knowledgeBaseId] });
      const previousDocs = queryClient.getQueryData<DocumentsResponse>(['documents', knowledgeBaseId]);

      queryClient.setQueryData<DocumentsResponse>(['documents', knowledgeBaseId], (old) => {
        if (!old) return { items: [] };
        return {
          ...old,
          items: old.items.filter((doc) => doc.id !== documentId)
        };
      });

      return { previousDocs };
    },
    onError: (err, { knowledgeBaseId }, context) => {
      if (context?.previousDocs) {
        queryClient.setQueryData(['documents', knowledgeBaseId], context.previousDocs);
      }
    },
    onSettled: (data, error, { knowledgeBaseId }) => {
      queryClient.invalidateQueries({ queryKey: ['documents', knowledgeBaseId] });
      queryClient.invalidateQueries({ queryKey: ['knowledge-bases'] });
    }
  });

  return {
    documents,
    isLoading,
    error,
    uploadDocument,
    deleteDocument,
    isUploading: uploadDocument.isPending,
    isDeleting: deleteDocument.isPending
  };
} 