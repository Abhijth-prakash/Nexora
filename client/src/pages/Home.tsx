import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useEffect } from "react";
import { logout, UserProfile } from "../redux/features/userSlice";
import Navbar from "../components/Navbar";
import { getCategories, getProducts } from "../redux/features/productSlice";


const Home = () => {
  const { logged, isStale } = useAppSelector(
    (state) => state.userData
  );

 const {products,page,totalpages,brand,category,subCategory,categories} = useAppSelector(state=> state.productData)

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isStale) {
      dispatch(UserProfile());
    }
  }, [dispatch, isStale]);

  useEffect(() => {
    const limit = 6;

    dispatch(getCategories(limit));

    const slug = "";
    const minprice = 0
    const maxprice = 0
    const sort = ""
    dispatch(getProducts({ limit, slug, page,brand,category,subCategory,minprice,maxprice,sort }));
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/auth/login", { replace: true });
    } catch (error) {
      console.log("Logout failed:", error);
    }
  };

  const categoryList = categories?.map((item) => (
    <li key={item._id}>
      <span>{item.name}</span>{" "}
      <Link to={`/category/products/${item._id}`}>Click</Link>
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