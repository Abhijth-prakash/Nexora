
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";


const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch()

  const { reservationId, expiresAt,} = location.state ?? {};
    
  if (!reservationId) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">No active checkout</h2>
        <button
          onClick={() => navigate("/users/cart")}
          className="mt-4 rounded-lg bg-red-700 px-5 py-3 text-white"
        >
          Return to cart
        </button>
      </div>
    );
  }



  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold">Payment</h1>

      <p className="mt-3 text-gray-600">
        Your items are reserved while you complete checkout.
      </p>

      <p className="mt-2 text-sm text-gray-500">
        Reservation expires: {new Date(expiresAt).toLocaleString()}
      </p>

      <p className="mt-4 text-sm">
        Reservation ID: {reservationId}
      </p>

    
    </div>
  );
};

export default Payment;