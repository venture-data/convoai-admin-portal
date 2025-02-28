"use client"

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
}

export function PdfModal({ isOpen, onClose, pdfUrl }: ModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const session = useSession();

  
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf-worker/pdf.worker.min.js";

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoading(false);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-4 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Knowledge Base PDF</h2>
          <div className="flex items-center gap-2">
            <button
              className="px-2 py-1 bg-gray-200 rounded"
              onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
              disabled={pageNumber <= 1}
            >
              Previous
            </button>
            <span>
              Page {pageNumber} of {numPages || '--'}
            </span>
            <button
              className="px-2 py-1 bg-gray-200 rounded"
              onClick={() => setPageNumber(prev => numPages ? Math.min(numPages, prev + 1) : prev)}
              disabled={numPages === null || pageNumber >= numPages}
            >
              Next
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          {isLoading ? (
            <div className="flex items-center justify-center h-[600px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          ) : (
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadStart={() => setIsLoading(true)}
              loading={
                <div className="flex items-center justify-center h-[600px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                </div>
              }
            >
              <Page 
                pageNumber={pageNumber} 
                renderTextLayer={true}
                renderAnnotationLayer={true}
                scale={1.2}
              />
            </Document>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}