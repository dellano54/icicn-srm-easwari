"use client";

import React from 'react';
import { markReviewViewed } from '@/app/actions/reviewer';

interface ReviewLinkProps {
  url: string;
  reviewId: string;
  label: string;
  className?: string;
}

export const ReviewLink: React.FC<ReviewLinkProps> = ({ url, reviewId, label, className }) => {
  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!url) {
      e.preventDefault();
      alert('File not available.');
      return;
    }
    // Fire and forget view tracking
    await markReviewViewed(reviewId);
  };

  return (
    <a 
        href={url || '#'} 
        target="_blank" 
        rel="noopener noreferrer"
        onClick={handleClick}
        className={`${className} ${!url ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        {label}
    </a>
  );
};
