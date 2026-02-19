"use client";

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PdfViewerProps {
  pdfPath: string;
  pageNumber: number;
  setNumPages: (numPages: number) => void;
  setLoadingPdf: (loading: boolean) => void;
  containerWidth: number;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  pdfPath,
  pageNumber,
  setNumPages,
  setLoadingPdf,
  containerWidth,
}) => {
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    setNumPages(numPages);
    setLoadingPdf(false);
  };

  const onDocumentLoadError = (error: any) => {
    console.error('Error loading PDF document:', error);
    setLoadingPdf(false);
  };

  return (
    <Document
      file={pdfPath}
      onLoadSuccess={onDocumentLoadSuccess}
      onLoadError={onDocumentLoadError}
      loading={null} // Hide default loading text
      error={<p className="text-red-500">Failed to load PDF.</p>} // Custom error
    >
      <Page
        pageNumber={pageNumber}
        width={Math.min(containerWidth, 800)} // Responsive width
        loading={<p className="text-slate-500">Loading page...</p>} // Custom page loading
        renderTextLayer={false}
        renderAnnotationLayer={false}
      />
    </Document>
  );
};
