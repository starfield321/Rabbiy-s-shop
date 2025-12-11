// src/components/ProductCard.tsx
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  id: number;
  title: string;
  vendor: string;
  price: number;
  imageUrl: string;
  isNew: boolean;
  isSoldOut: boolean;
}

const formatPrice = (price: number) => {
  return price.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' });
};

export const ProductCard = ({ id, title, vendor, price, imageUrl, isNew, isSoldOut }: ProductCardProps) => {
  // 元のHTMLの複雑なクラスを、Next.js/Tailwindでわかりやすいシンプルなデザインに変換します
  return (
    <li className="group relative">
      <Link href={`/products/${id}`} className="block">
        <div className="relative overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
          
          {/* New Item Badge */}
          {isNew && (
            <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded shadow-md">
              NEW
            </div>
          )}

          {/* Sold Out Badge (画像の上に来るように) */}
          {isSoldOut && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-10">
              <span className="text-white text-xl font-bold p-2 border-2 border-white">
                SOLD OUT
              </span>
            </div>
          )}

          {/* Product Image (元のHTMLの long-padding は aspect-square で代替) */}
          <div className="w-full aspect-square bg-gray-100">
            <Image
              src={imageUrl}
              alt={title}
              width={533}
              height={533}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              priority={isNew} // 新着商品なら優先的にロード
            />
          </div>
        </div>

        {/* Product Info (元の .card-information__wrapper に相当) */}
        <div className="mt-3 text-left">
          {/* Vendor */}
          <p className="text-xs text-gray-500 font-medium tracking-wider mb-1">{vendor}</p>
          
          {/* Title */}
          <h3 className="text-sm font-bold leading-tight line-clamp-2 min-h-[2.5rem]">
            {title}
          </h3>
          
          {/* Price */}
          <div className="mt-1">
            <p className={`text-lg font-semibold ${isSoldOut ? 'text-gray-400' : 'text-red-600'}`}>
              {formatPrice(price)}<span className="text-xs text-gray-600 ml-1">(税込)</span>
            </p>
          </div>
        </div>
      </Link>
    </li>
  );
};