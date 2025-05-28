'use client';

import Image from 'next/image';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  image: string;
  brand?: string;
  stock_quantity: number;
  rating?: number;
  reviewCount?: number;
  discount?: number;
  isNew?: boolean;
  isSale?: boolean;
  variant?: 'default' | 'compact' | 'featured' | 'minimal';
  showQuickActions?: boolean;
  showWishlist?: boolean;
  showQuickView?: boolean;
  customLink?: string;
  onAddToCart?: (product: any) => void;
  onWishlist?: (productId: string) => void;
  onQuickView?: (productId: string) => void;
  className?: string;
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  originalPrice,
  image,
  brand,
  stock_quantity,
  rating = 0,
  reviewCount = 0,
  discount,
  isNew = false,
  isSale = false,
  variant = 'default',
  showQuickActions = true,
  showWishlist = true,
  showQuickView = true,
  customLink,
  onAddToCart,
  onWishlist,
  onQuickView,
  className = '',
}: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const productLink = customLink || `/product/${id}`;
  const isOutOfStock = stock_quantity === 0;
  const discountPercentage = discount || (originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (isOutOfStock) return;

    const product = { id, name, price, image, quantity: 1 };
    setError(null);

    // Check if user is logged in by checking for JWT token
    const token = localStorage.getItem('token');

    if (token) {
      // Logged-in user: Sync to database
      try {
        const response = await fetch('http://localhost:8383/api/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            productItemId: id, // Assuming 'id' is the productItemId
            quantity: 1,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to add item to cart in database');
        }

        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error adding to cart');
        setTimeout(() => setError(null), 3000);
      }
    } else {
      // Guest user: Use cookies
      if (onAddToCart) {
        onAddToCart(product);
      } else {
        const cart = JSON.parse(Cookies.get('cart') || '[]');
        const existingItem = cart.find((item: any) => item.id === id);

        if (!existingItem) {
          cart.push(product);
        } else {
          existingItem.quantity += 1;
        }

        Cookies.set('cart', JSON.stringify(cart), { expires: 7 });
      }

      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (onWishlist) {
      onWishlist(id);
    }
    setIsWishlisted(!isWishlisted);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (onQuickView) {
      onQuickView(id);
    }
  };

  const renderBadges = () => (
    <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
      {isNew && (
        <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          NEW
        </span>
      )}
      {isSale && discountPercentage > 0 && (
        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          -{discountPercentage}%
        </span>
      )}
      {isOutOfStock && (
        <span className="bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          SOLD OUT
        </span>
      )}
    </div>
  );

  const renderQuickActions = () => (
    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      {showWishlist && (
        <button
          onClick={handleWishlist}
          className={`p-2 rounded-full shadow-lg transition-all duration-200 ${
            isWishlisted 
              ? 'bg-red-500 text-white' 
              : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-500'
          }`}
        >
          <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      )}
      {showQuickView && (
        <button
          onClick={handleQuickView}
          className="p-2 bg-white text-gray-700 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200"
        >
          <Eye size={16} />
        </button>
      )}
    </div>
  );

  const renderRating = () => {
    if (rating === 0) return null;
    
    return (
      <div className="flex items-center gap-1 mb-2">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={14}
              className={`${
                star <= rating 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-gray-500">
          ({reviewCount})
        </span>
      </div>
    );
  };

  const getCardClasses = () => {
    const baseClasses = "group bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100";
    
    switch (variant) {
      case 'compact':
        return `${baseClasses} hover:scale-102`;
      case 'featured':
        return `${baseClasses} ring-2 ring-blue-500 ring-opacity-20 hover:scale-105`;
      case 'minimal':
        return `${baseClasses} shadow-none border-0 hover:shadow-md`;
      default:
        return `${baseClasses} hover:scale-105`;
    }
  };

  const getImageHeight = () => {
    switch (variant) {
      case 'compact':
        return 'h-40';
      case 'featured':
        return 'h-64';
      case 'minimal':
        return 'h-48';
      default:
        return 'h-52';
    }
  };

  return (
    <div className={`${getCardClasses()} ${className}`}>
      <Link href={productLink} className="block">
        {/* Image Container */}
        <div className={`relative ${getImageHeight()} overflow-hidden bg-gray-50`}>
          <Image
            src={image}
            alt={name}
            fill
            className={`object-cover transition-transform duration-500 group-hover:scale-110 ${
              imageLoading ? 'blur-sm' : 'blur-0'
            }`}
            onLoad={() => setImageLoading(false)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Overlay for out of stock */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
              <span className="text-gray-600 font-semibold text-lg">Out of Stock</span>
            </div>
          )}

          {renderBadges()}
          {showQuickActions && renderQuickActions()}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Brand */}
          {brand && (
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              {brand}
            </p>
          )}

          {/* Title */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
            {name}
          </h3>

          {/* Description */}
          {description && variant !== 'compact' && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {description}
            </p>
          )}

          {/* Rating */}
          {renderRating()}

          {/* Price */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg font-bold text-gray-900">
              ${price.toFixed(2)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-gray-500 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Info */}
          <div className="flex items-center justify-between mb-4">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              stock_quantity > 10 
                ? 'bg-green-100 text-green-800' 
                : stock_quantity > 0 
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
            }`}>
              {stock_quantity > 0 ? `${stock_quantity} in stock` : 'Out of stock'}
            </span>
          </div>
        </div>
      </Link>

      {/* Error Message */}
      {error && (
        <div className="px-4 pb-2">
          <p className="text-red-500 text-sm text-center">{error}</p>
        </div>
      )}

      {/* Add to Cart Button */}
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
            isOutOfStock
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : added
                ? 'bg-green-500 text-white'
                : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-95'
          }`}
        >
          {isOutOfStock ? (
            'Out of Stock'
          ) : added ? (
            <>
              <span>✓</span>
              Added to Cart!
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}