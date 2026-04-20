"use client";

import { useState } from "react";

type Props = {
  images: string[];
  fallbackEmoji: string;
  name: string;
};

export function ProductGallery({ images, fallbackEmoji, name }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const hasImages = images.length > 0;
  const currentImage = hasImages ? images[selectedIndex] : null;

  return (
    <div>
      {/* Main image */}
      <div
        className={`aspect-square rounded-2xl bg-amber-50 flex items-center justify-center overflow-hidden ${hasImages ? "cursor-zoom-in" : ""}`}
        onClick={() => hasImages && setLightboxOpen(true)}
      >
        {currentImage ? (
          <img
            src={currentImage}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-8xl">{fallbackEmoji}</span>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                i === selectedIndex
                  ? "border-amber-500"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={url}
                alt={`${name} ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && currentImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute right-4 top-4 text-3xl text-white hover:text-gray-300"
            onClick={() => setLightboxOpen(false)}
          >
            &times;
          </button>
          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 text-4xl text-white hover:text-gray-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex((prev) =>
                    prev > 0 ? prev - 1 : images.length - 1,
                  );
                }}
              >
                ‹
              </button>
              <button
                className="absolute right-4 text-4xl text-white hover:text-gray-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex((prev) =>
                    prev < images.length - 1 ? prev + 1 : 0,
                  );
                }}
              >
                ›
              </button>
            </>
          )}
          <img
            src={images[selectedIndex]}
            alt={name}
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
