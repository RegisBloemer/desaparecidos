// components/ImageWithFallback.tsx
import Image, { ImageProps } from 'next/image';
import { useState, SyntheticEvent } from 'react';

interface ImageWithFallbackProps extends ImageProps {
  fallbackSrc: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  fallbackSrc,
  alt,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src as string);

  const handleError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt || 'Imagem'}
      onError={handleError}
      {...props}
    />
  );
};

export default ImageWithFallback;
