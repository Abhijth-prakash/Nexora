
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useEffect, useRef } from "react";
import { UserProfile } from "../redux/features/userSlice";

import { getCategories, getProducts } from "../redux/features/productSlice";
import {
  getCart,
  mergeGuestCart,
  setGuestItems,
} from "../redux/features/cartSlice";
import { clearGuestCart } from "../utils/guestCart";

const features = [
  { title: "Free Shipping", text: "On orders over $50" },
  { title: "Secure Payments", text: "100% secure checkout" },
  { title: "Easy Returns", text: "30-day return policy" },
  { title: "24/7 Support", text: "Always here to help" },
];

const Home = () => {
  const { isStale, logged } = useAppSelector(
    (state) => state.userData
  );

  const { guestItems } = useAppSelector(
    (state) => state.cartData
  );

  const {
    products,
    page,
    brand,
    category,
    subCategory,
    categories,
  } = useAppSelector((state) => state.productData);

  const dispatch = useAppDispatch();
  const mergeStarted = useRef(false);

  useEffect(() => {
    if (isStale) {
      dispatch(UserProfile());
    }
  }, [dispatch, isStale]);

  // Merge guest cart after authentication
  useEffect(() => {
    if (
      !logged ||
      isStale ||
      mergeStarted.current ||
      guestItems.length === 0
    ) {
      return;
    }

    mergeStarted.current = true;

    const mergeCart = async () => {
      try {
        const items = guestItems.map(
          ({ productId, variantId, size, quantity }) => ({
            productId,
            variantId,
            size,
            quantity,
          })
        );

        await dispatch(mergeGuestCart(items)).unwrap();

        clearGuestCart();
        dispatch(setGuestItems([]));

        await dispatch(getCart()).unwrap();
      } catch (error) {
        console.error("Guest cart merge failed:", error);
        mergeStarted.current = false;
      }
    };

    void mergeCart();
  }, [dispatch, logged, isStale, guestItems]);

  useEffect(() => {
    const limit = 6;

    dispatch(getCategories(limit));

    const slug = "";
    const minprice = 0;
    const maxprice = 0;
    const sort = "";

    dispatch(
      getProducts({
        limit,
        slug,
        page,
        brand,
        category,
        subCategory,
        minprice,
        maxprice,
        sort,
      })
    );
  }, [dispatch]);

  const renderStars = (rating: number) => {
    const filled = Math.round(rating);

    return (
      <span className="text-[11px] tracking-tight text-[#ff624d]">
        {"★".repeat(filled)}
        <span className="text-gray-300">
          {"★".repeat(5 - filled)}
        </span>
      </span>
    );
  };

  const categoryList = categories?.map((item) => (
    <li key={item._id}>
      <Link
        to={`/category/products/${item._id}`}
        className="group block"
      >
        <div className="aspect-[4/3] w-full overflow-hidden rounded-md bg-[#fff0ed]">
          {item.image?.url ? (
            <img
              src={item.image.url}
              alt={item.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-bold uppercase text-[#ff624d]">
              {item.name.substring(0, 2)}
            </div>
          )}
        </div>

        <p className="mt-2 text-sm font-semibold text-gray-900">
          {item.name}
        </p>
        <p className="mt-0.5 text-[11px] text-gray-400 group-hover:text-[#ff624d]">
          Shop Now →
        </p>
      </Link>
    </li>
  ));

  const productList = products?.map((item) => (
    <li key={item._id}>
      <Link
        to={`/product/${item._id}`}
        className="group relative block rounded-xl border border-gray-200 bg-white p-3 transition-shadow hover:shadow-md"
      >
        <span className="absolute left-4 top-4 z-10 rounded bg-black px-2 py-0.5 text-[10px] font-semibold text-white">
          NEW
        </span>

        <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
          <img
            src={item.images[0]}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="mt-3 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-xs font-semibold text-gray-900">
              {item.name}
            </h3>
            <p className="mt-1 text-sm font-bold text-gray-900">
              ₹{item.price}
            </p>
            <div className="mt-1 flex items-center gap-1">
              {renderStars(item.rating)}
              <span className="text-[10px] text-gray-400">
                ({item.numReviews})
              </span>
            </div>
          </div>

          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-sm text-white">
            +
          </span>
        </div>
      </Link>
    </li>
  ));

  return (
    <div className="min-h-screen w-full bg-[#f7f6f5]">
      {/* ================= HERO (static for now) ================= */}
      <section className="w-full bg-white">
        <div className="grid w-full items-center gap-10 px-6 py-12 lg:grid-cols-2 lg:px-16 lg:py-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#ff624d]">
              Trending Now
            </p>

            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
              Discover Products
              <br />
              You'll Love
            </h1>

            <p className="mt-4 max-w-sm text-sm text-gray-500">
              Shop the latest trending products curated for modern lifestyles.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/"
                className="rounded-md bg-[#ff624d] px-6 py-3 text-xs font-semibold text-white transition hover:bg-[#ed5744]"
              >
                Shop Now →
              </Link>

              <Link
                to="/"
                className="rounded-md border border-gray-300 bg-white px-6 py-3 text-xs font-semibold text-gray-900 transition hover:bg-gray-50"
              >
                Explore Collection
              </Link>
            </div>

            <p className="mt-6 text-xs text-gray-400">
              Loved by 50,000+ customers worldwide
            </p>
          </div>

          <div className="relative mx-auto flex h-80 w-full max-w-md items-center justify-center lg:h-96">
            <div className="absolute h-64 w-64 rounded-full bg-[#ffd9d1] lg:h-80 lg:w-80" />
            <div className="absolute h-52 w-52 rounded-full bg-[#ff8a75] lg:h-64 lg:w-64" />

            <div className="absolute left-0 top-6 rounded-lg bg-white px-3 py-2 shadow-md">
              <p className="text-xs font-semibold text-gray-900">Air Max 270</p>
              <p className="text-[10px] text-gray-400">$129.99</p>
            </div>

            <div className="absolute right-0 top-10 rounded-lg bg-white px-3 py-2 shadow-md">
              <p className="text-xs font-semibold text-gray-900">Smart Watch</p>
              <p className="text-[10px] text-gray-400">$199.99</p>
            </div>

            <div className="absolute bottom-10 left-2 rounded-lg bg-white px-3 py-2 shadow-md">
              <p className="text-xs font-semibold text-gray-900">
                Wireless Headphones
              </p>
              <p className="text-[10px] text-gray-400">$99.99</p>
            </div>

            <div className="absolute bottom-4 right-2 rounded-lg bg-white px-3 py-2 shadow-md">
              <p className="text-xs font-semibold text-gray-900">Water Bottle</p>
              <p className="text-[10px] text-gray-400">$24.99</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="w-full border-t border-gray-100 bg-white">
        <ul className="grid w-full grid-cols-2 gap-6 px-6 py-6 lg:grid-cols-4 lg:px-16">
          {features.map((f) => (
            <li key={f.title}>
              <p className="text-xs font-semibold text-gray-900">{f.title}</p>
              <p className="mt-0.5 text-[11px] text-gray-400">{f.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ================= SHOP BY CATEGORIES ================= */}
      <section className="w-full bg-white px-6 pb-10 pt-8 lg:px-16">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            Shop by Categories
          </h2>

          <Link
            to="/"
            className="text-[11px] text-gray-400 hover:text-[#ff624d]"
          >
            View All Categories →
          </Link>
        </div>

        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categoryList}
        </ul>
      </section>

      {/* ================= NEW ARRIVALS ================= */}
      <section className="w-full bg-white px-6 pb-12 lg:px-16">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">New Arrivals</h2>

          <Link
            to="/"
            className="text-[11px] text-gray-400 hover:text-[#ff624d]"
          >
            View All New Arrivals →
          </Link>
        </div>

        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {productList}
        </ul>
      </section>
    </div>
  );
};

export default Home;
