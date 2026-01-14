'use client';
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';

const Viewer = forwardRef(
  (
    {
      images = [],
      zoomLevel = 1,
      minZoom = 1,
      maxZoom = 3,
      touchDragInterval = 5.5,
      dragInterval = 5.5,
      className = '',
      style = {},
      onImageChange,
      loadingComponent,
    },
    ref,
  ) => {
    const containerRef = useRef(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [loadedImages, setLoadedImages] = useState(new Set());
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [currentZoom, setCurrentZoom] = useState(zoomLevel);
    const dragSensitivity = dragInterval || 5.5;

    // Update zoom and reset pan when zoom changes
    useEffect(() => {
      setCurrentZoom(zoomLevel);
      // Reset pan offset when zoom returns to 1
      if (zoomLevel === 1) {
        setPanOffset({ x: 0, y: 0 });
      }
    }, [zoomLevel]);

    // Navigation functions
    const goToNext = useCallback(() => {
      if (images.length === 0) return;
      const newIndex = (currentImageIndex + 1) % images.length;
      setCurrentImageIndex(newIndex);
      onImageChange?.(newIndex);
    }, [images.length, currentImageIndex, onImageChange]);

    const goToPrevious = useCallback(() => {
      if (images.length === 0) return;
      const newIndex = (currentImageIndex - 1 + images.length) % images.length;
      setCurrentImageIndex(newIndex);
      onImageChange?.(newIndex);
    }, [images.length, currentImageIndex, onImageChange]);

    const goToImage = useCallback(
      (index) => {
        if (index >= 0 && index < images.length) {
          setCurrentImageIndex(index);
          onImageChange?.(index);
        }
      },
      [images.length, onImageChange],
    );

    // Expose methods to match your Controls component expectations
    useImperativeHandle(ref, () => ({
      next: goToNext,
      prev: goToPrevious,
      getCurrentImageIndex: () => currentImageIndex,
      setImageIndex: goToImage,
      nextImage: goToNext,
      previousImage: goToPrevious,
      getContainer: () => containerRef.current,
      getCurrentZoom: () => currentZoom,
      resetPan: () => setPanOffset({ x: 0, y: 0 }),
    }));

    // Preload images with progress tracking
    useEffect(() => {
      const loadImage = (src, index) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            setLoadedImages((prev) => {
              const newSet = new Set([...prev, index]);
              setLoadingProgress((newSet.size / images.length) * 100);
              return newSet;
            });
            resolve(img);
          };
          img.onerror = reject;
          img.src = src;
        });
      };

      const loadAllImages = async () => {
        if (images.length === 0) {
          setIsLoading(false);
          return;
        }

        try {
          setIsLoading(true);
          setLoadedImages(new Set());
          setLoadingProgress(0);

          await Promise.all(images.map((src, index) => loadImage(src, index)));
          setIsLoading(false);
        } catch (error) {
          console.error('Failed to load some images:', error);
          setIsLoading(false);
        }
      };

      loadAllImages();
    }, [images]);

    // Calculate pan boundaries based on zoom level
    const calculatePanBoundaries = useCallback(() => {
      if (!containerRef.current || currentZoom <= 1) {
        return { maxX: 0, maxY: 0 };
      }

      const containerRect = containerRef.current.getBoundingClientRect();
      const scaledWidth = containerRect.width * currentZoom;
      const scaledHeight = containerRect.height * currentZoom;

      const maxX = Math.max(0, (scaledWidth - containerRect.width) / 2);
      const maxY = Math.max(0, (scaledHeight - containerRect.height) / 2);

      return { maxX, maxY };
    }, [currentZoom]);

    // Constrain pan offset within boundaries
    const constrainPan = useCallback(
      (offset) => {
        const { maxX, maxY } = calculatePanBoundaries();
        return {
          x: Math.max(-maxX, Math.min(maxX, offset.x)),
          y: Math.max(-maxY, Math.min(maxY, offset.y)),
        };
      },
      [calculatePanBoundaries],
    );

    // Handle mouse events
    const handleMouseDown = useCallback(
      (e) => {
        if (isLoading) return;
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
      },
      [isLoading],
    );

    const handleMouseMove = useCallback(
      (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        if (currentZoom > 1) {
          // When zoomed in, pan the image
          const panSpeed = 1.5; // Adjust this to control pan sensitivity
          const newPanOffset = {
            x: panOffset.x + deltaX * panSpeed,
            y: panOffset.y + deltaY * panSpeed,
          };
          setPanOffset(constrainPan(newPanOffset));
          setDragStart({ x: e.clientX, y: e.clientY });
        } else {
          // When not zoomed, rotate through 360° images
          if (images.length === 0) return;

          const threshold = dragSensitivity;
          if (Math.abs(deltaX) > threshold) {
            const direction = deltaX > 0 ? -1 : 1;
            const newIndex = (currentImageIndex + direction + images.length) % images.length;
            setCurrentImageIndex(newIndex);
            setDragStart({ x: e.clientX, y: e.clientY });
            onImageChange?.(newIndex);
          }
        }
      },
      [
        isDragging,
        dragStart,
        currentImageIndex,
        images.length,
        dragSensitivity,
        onImageChange,
        currentZoom,
        panOffset,
        constrainPan,
      ],
    );

    const handleMouseUp = useCallback(() => {
      setIsDragging(false);
    }, []);

    // Handle touch events
    const handleTouchStart = useCallback(
      (e) => {
        if (isLoading) return;
        const touch = e.touches[0];
        setIsDragging(true);
        setDragStart({ x: touch.clientX, y: touch.clientY });
      },
      [isLoading],
    );

    const handleTouchMove = useCallback(
      (e) => {
        if (!isDragging) return;

        const touch = e.touches[0];
        const deltaX = touch.clientX - dragStart.x;
        const deltaY = touch.clientY - dragStart.y;

        if (currentZoom > 1) {
          // When zoomed in, pan the image
          const panSpeed = 1.5;
          const newPanOffset = {
            x: panOffset.x + deltaX * panSpeed,
            y: panOffset.y + deltaY * panSpeed,
          };
          setPanOffset(constrainPan(newPanOffset));
          setDragStart({ x: touch.clientX, y: touch.clientY });
        } else {
          // When not zoomed, rotate through 360° images
          if (images.length === 0) return;

          const threshold = touchDragInterval;
          if (Math.abs(deltaX) > threshold) {
            const direction = deltaX > 0 ? -1 : 1;
            const newIndex = (currentImageIndex + direction + images.length) % images.length;
            setCurrentImageIndex(newIndex);
            setDragStart({ x: touch.clientX, y: touch.clientY });
            onImageChange?.(newIndex);
          }
        }
      },
      [
        isDragging,
        dragStart,
        currentImageIndex,
        images.length,
        touchDragInterval,
        onImageChange,
        currentZoom,
        panOffset,
        constrainPan,
      ],
    );

    const handleTouchEnd = useCallback(() => {
      setIsDragging(false);
    }, []);

    useEffect(() => {
      const handleGlobalMouseMove = (e) => handleMouseMove(e);
      const handleGlobalMouseUp = () => handleMouseUp();

      if (isDragging) {
        document.addEventListener('mousemove', handleGlobalMouseMove);
        document.addEventListener('mouseup', handleGlobalMouseUp);
      }

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const handleWheel = useCallback(
      (e) => {
        if (isLoading) return;
        e.preventDefault();

        const delta = e.deltaY < 0 ? 0.1 : -0.1;
        const newZoom = Math.max(minZoom, Math.min(maxZoom, currentZoom + delta));
        setCurrentZoom(newZoom);

        if (newZoom === 1) {
          setPanOffset({ x: 0, y: 0 });
        }
      },
      [isLoading, currentZoom, minZoom, maxZoom],
    );

    if (images.length === 0) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-gray-100">
          <p className="text-gray-500">No images to display</p>
        </div>
      );
    }

    const DefaultLoadingComponent = () => (
      <div className="white absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="mb-2 font-medium text-gray-700">360° View</p>
          <div className="h-2 w-64 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-JDGreen transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {Math.round(loadingProgress)}% ({loadedImages.size}/{images.length})
          </p>
        </div>
      </div>
    );

    const getCursorStyle = () => {
      if (isLoading) return 'default';
      if (isDragging) {
        return currentZoom > 1 ? 'move' : 'grabbing';
      }
      return currentZoom > 1 ? 'move' : 'grab';
    };

    return (
      <div
        ref={containerRef}
        className={`relative h-full w-full select-none overflow-hidden ${className}`}
        style={{
          cursor: getCursorStyle(),
          ...style,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        role="img"
        aria-label={`360° view, image ${currentImageIndex + 1} of ${images.length}${
          currentZoom > 1 ? ', zoomed in' : ''
        }`}
        tabIndex={0}>
        {isLoading && (loadingComponent || <DefaultLoadingComponent />)}

        <img
          src={images[currentImageIndex]}
          alt={`360° view ${currentImageIndex + 1}`}
          className={`h-full w-full object-contain transition-transform duration-150 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            transform: `scale(${currentZoom}) translate(${panOffset.x / currentZoom}px, ${
              panOffset.y / currentZoom
            }px)`,
            transformOrigin: 'center center',
          }}
          draggable={false}
        />

        {/* Zoom indicator (optional) */}
        {currentZoom > 1 && (
          <div className="absolute bottom-4 right-4 rounded bg-black/50 px-2 py-1 text-sm text-white">
            {Math.round(currentZoom * 100)}%
          </div>
        )}
      </div>
    );
  },
);

Viewer.displayName = 'Viewer';
export default Viewer;
