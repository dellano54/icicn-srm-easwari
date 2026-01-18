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
  const handleClick = async () => {
    // Fire and forget view tracking
    await markReviewViewed(reviewId);
  };

  return (
    <a 
        href={url} 
        target="_blank" 
        onClick={handleClick}
        className={className}
    >
        {label}
    </a>
  );
};
