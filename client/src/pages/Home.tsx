
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useEffect, useState } from "react";
import { logout, UserProfile } from "../redux/features/userSlice";
import Navbar from "../components/Navbar";
import { getCategories, getProducts } from "../redux/features/productSlice";
import PriceRangeFilter from "../components/PriceRangeFilter";

const Home = () => {
  const { logged, isStale } = useAppSelector(
    (state) => state.userData
  );

  const { categories, products } = useAppSelector(
    (state) => state.productData
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [priceRange, setPriceRange] = useState({
    minPrice: 0,
    maxPrice: 10000,
  });

  useEffect(() => {
    if (isStale) {
      dispatch(UserProfile());
    }
  }, [dispatch, isStale]);

  useEffect(() => {
    const limit = 6;

    dispatch(getCategories(limit));

    const slug = "";
    const page = 1;

    dispatch(getProducts({ limit, slug, page }));
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/auth/login", { replace: true });
    } catch (error) {
      console.log("Logout failed:", error);
    }
  };

  const handlePriceChange = ({
    minPrice,
    maxPrice,
  }: {
    minPrice: number;
    maxPrice: number;
  }) => {
    setPriceRange({ minPrice, maxPrice });
  };

  const handleApplyPrice = () => {
    console.log("Minimum price:", priceRange.minPrice);
    console.log("Maximum price:", priceRange.maxPrice);
  };

  const handleResetPrice = () => {
    setPriceRange({
      minPrice: 0,
      maxPrice: 0,
    });
  };

  const categoryList = categories?.map((item) => (
    <li key={item._id}>
      <span>{item.name}</span>{" "}
      <Link to={`/products/${item._id}`}>Click</Link>
    </li>
  ));

  const productList = products?.map((item) => (
    <li key={item._id}>
      <span>{item.name}</span>

      <Link to={`/product/${item._id}`}>
        <img src={item.images[0]} alt={item.name} />
      </Link>
    </li>
  ));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mx-auto max-w-sm space-y-3 px-4 py-6">
        <PriceRangeFilter
          minPrice={priceRange.minPrice}
          maxPrice={priceRange.maxPrice}
          onChange={handlePriceChange}
        />

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleApplyPrice}
            className="flex-1 rounded-lg bg-red-700 px-4 py-2 font-medium text-white hover:bg-red-800"
          >
            Apply
          </button>

          <button
            type="button"
            onClick={handleResetPrice}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-100"
          >
            Reset
          </button>
        </div>

        <div className="text-sm text-gray-600">
          <p>Minimum price: ₹{priceRange.minPrice}</p>
          <p>Maximum price: ₹{priceRange.maxPrice}</p>
        </div>
      </div>

      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm space-y-6 rounded-xl bg-white p-8 text-center shadow-md">
          <ul className="space-y-2">{categoryList}</ul>

          {logged ? (
            <p className="text-green-700">
              You are logged in.
            </p>
          ) : (
            <p className="text-gray-600">
              You are not logged in.
            </p>
          )}

          <ul className="space-y-4">{productList}</ul>

          {!logged && (
            <div className="flex justify-center gap-4">
              <Link
                to="/auth/register"
                className="rounded-lg bg-red-700 px-4 py-2 text-white hover:bg-red-800"
              >
                Register
              </Link>

              <Link
                to="/auth/login"
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Sign In
              </Link>
            </div>
          )}

          {logged && (
            <div className="flex flex-col gap-3">
              <Link
                to="/profile"
                className="rounded-lg bg-gray-100 px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                My Profile
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-red-700 px-4 py-2 text-white hover:bg-red-800"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
