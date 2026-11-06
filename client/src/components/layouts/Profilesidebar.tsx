
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout } from "../../redux/features/userSlice";

export const getInitials = (name?: string) => {
  if (!name) return "?";

  const parts = name.trim().split(/\s+/);

  const initials =
    parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : parts[0].slice(0, 2);

  return initials.toUpperCase();
};

const ProfileSidebar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.userData);

  const logoutHandle = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/auth/login", { replace: true });
    } catch (error) {
      console.log("logout failed", error);
    }
  };

  return (
    <aside className="flex h-full min-h-[calc(100vh-105px)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:sticky lg:top-5">

      {/* USER */}
      <div className="border-b border-gray-100 px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#ff5a1f] text-lg font-bold text-white shadow-sm">
            {getInitials(user?.name)}

            {user?.verified && (
              <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-green-500">
                <svg
                  className="h-3 w-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12l4 4L19 6"
                  />
                </svg>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-base font-semibold text-gray-900">
                {user?.name || "My Account"}
              </p>
            </div>

            {!user?.verified && (
              <Link
                to="/veirification"
                className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-[#ff5a1f] transition hover:bg-orange-100"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff5a1f]" />
                Verification required
              </Link>
            )}

            {user?.verified && (
              <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-600">
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-green-500 text-white">
                  <svg
                    className="h-2.5 w-2.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12l4 4L19 6"
                    />
                  </svg>
                </span>
                Verified account
              </div>
            )}

            <p className="mt-1 truncate text-xs text-gray-400">
              {user?.email || "Manage your account"}
            </p>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="flex-1 p-5">

        {/* MANAGE ACCOUNT */}
        <div className="mb-7">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
            Manage Account
          </p>

          {/* Profile */}
          <Link
            to="/myprofile"
            className="flex items-center gap-3 rounded-xl bg-[#fff1eb] px-3 py-3 text-sm font-semibold text-[#ff5a1f] transition hover:bg-[#ffe5d9]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ff5a1f] text-white">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0"
                />
              </svg>
            </div>

            <span>My Profile</span>
          </Link>

          {/* Address */}
          <Link
            to="/profile/address"
            aria-disabled={!user?.verified}
            tabIndex={user?.verified ? undefined : -1}
            title={
              user?.verified
                ? undefined
                : "Verify your account to manage addresses"
            }
            onClick={(e) => {
              if (!user?.verified) e.preventDefault();
            }}
            className={`mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
              user?.verified
                ? "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                : "cursor-not-allowed text-gray-400 opacity-50"
            }`}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21s7-5.25 7-11a7 7 0 10-14 0c0 5.75 7 11 7 11z"
                />
                <circle cx="12" cy="10" r="2.2" />
              </svg>
            </div>

            <span>Address Book</span>
          </Link>

          {/* Wallet */}
          <Link
            to="/users/Wallet"
            className="mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5A2.5 2.5 0 015.5 5h13A2.5 2.5 0 0121 7.5v9a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 16.5v-9z"
                />
                <path strokeLinecap="round" d="M16 13h2" />
              </svg>
            </div>

            <span>My Wallet</span>
          </Link>
        </div>

        {/* ORDERS */}
        <div className="mb-7">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
            Orders
          </p>

          {/* All Orders */}
          <Link
            to="/users/orders"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 3h12l1 4H5l1-4zM5 7h14v13H5V7z"
                />
                <path strokeLinecap="round" d="M9 11h6M9 15h4" />
              </svg>
            </div>

            <span>All Orders</span>
          </Link>

          {/* My Returns */}
       <Link
  to="/users/orders/returns"
  className="mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
>
  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 7H5m0 0l3-3M5 7a7 7 0 111.5 7.5"
      />
    </svg>
  </div>

  <span>My Returns</span>
</Link>

          {/* Cancellations */}
        
<Link
  to="/users/orders/cancelled"
  className="mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
>
  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 6l12 12M18 6L6 18"
      />
    </svg>
  </div>

  <span>Cancellations</span>
</Link>
        </div>

        {/* SETTINGS */}
        <div>
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
            Settings
          </p>

          {/* Payment Methods */}
          <div className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-500 transition hover:bg-gray-50 hover:text-gray-900">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 10h18" />
              </svg>
            </div>

            <span>Payment Methods</span>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={logoutHandle}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-gray-500 transition hover:bg-red-50 hover:text-red-500"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 17l5-5-5-5M15 12H3"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 19V5a2 2 0 00-2-2h-6"
                />
              </svg>
            </div>

            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
