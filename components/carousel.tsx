"use client";

import Stripe from "stripe";

interface CarouselProps {
  products?: Stripe.Product[];
}

export function Carousel({ products = [] }: CarouselProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {products.map((product) => (
        <div
          key={product.id}
          className="rounded border p-4"
        >
          <h2 className="text-xl font-bold">
            {product.name}
          </h2>

          <p>{product.description}</p>

          {product.images?.[0] && (
            <img
              src={product.images[0]}
              alt={product.name}
              className="mt-4 rounded"
            />
          )}
        </div>
      ))}
    </div>
  );
}