import axios from "axios";
import React, { useEffect, useState } from "react";
import HorSlider from "./HorSlider";
import { TOP_BRAND_ITEMS } from "./GenInfo";

const BestSellersTopBrands = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const base = import.meta.env.VITE_BASE_URL;
        const responses = await Promise.all(
          TOP_BRAND_ITEMS.map((b) =>
            axios.get(
              `${base}/api/products/search?q=${encodeURIComponent(b.searchQuery)}`
            )
          )
        );
        const seen = new Set();
        const merged = [];
        for (const res of responses) {
          const list = Array.isArray(res.data) ? res.data : [];
          for (const p of list) {
            const id = p._id ?? p.id;
            if (id && !seen.has(String(id))) {
              seen.add(String(id));
              merged.push(p);
            }
          }
        }
        if (isMounted) {
          setProducts(merged);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error(`Error while fetching products: ${err.message}`);
          setError(err);
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <div className="mt-10 mb-2 text-2xl">Best Sellers</div>
      <div className="overflow-x-auto overflow-y-hidden md:max-w-full scroll-container mb-10 mx-auto relative scroll-container">
        {loading && <p>Loading...</p>}
        {error && <p>Error while fetching: {error.message}</p>}

        <div className="flex flex-nowrap space-x-4">
          {(Array.isArray(products) ? products : []).map((elem) => (
            <HorSlider
              product={elem}
              key={elem._id || elem.id}
              className="inline-block"
              home={true}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default BestSellersTopBrands;
