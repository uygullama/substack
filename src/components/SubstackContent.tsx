"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface SubstackContentProps {
  html: string;
}

export default function SubstackContent({ html }: SubstackContentProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Find closest anchor with 'image-link' class
    const target = e.target as HTMLElement;
    const anchor = target.closest("a.image-link");
    
    if (anchor) {
      e.preventDefault();
      const href = anchor.getAttribute("href");
      if (href) {
        setSelectedImage(href);
      }
    }
  };

  return (
    <>
      <style>{`
        .substack-content .image-link-expand {
          display: none !important;
        }
        .substack-content a.image-link {
          cursor: zoom-in;
        }
      `}</style>
      <div
        className="prose prose-lg dark:prose-invert max-w-none mt-8 substack-content"
        dangerouslySetInnerHTML={{ __html: html }}
        onClick={handleClick}
      />

      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        {/* Visually hidden title for accessibility */}
        <DialogTitle className="sr-only">Expand Image</DialogTitle>
        <DialogContent className="max-w-4xl p-1 bg-transparent border-none shadow-none flex justify-center items-center">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Expanded image"
              className="max-w-full max-h-[85vh] object-contain rounded-md"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
