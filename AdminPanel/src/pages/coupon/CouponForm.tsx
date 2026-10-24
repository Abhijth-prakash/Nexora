
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { couponSchema } from "../../utils/validation";
import type {
  CouponFormData,
  CouponFormInput,
} from "../../utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getallCategories } from "../../redux/features/categorySlice";
import {
  addCoupon,
  getCoupons,
  updateCoupon,
} from "../../redux/features/CouponSlice";
import { toast } from "react-toastify";

export type props = {
  onCLose: () => void;
  editId: string;
};

const CouponForm = ({ onCLose, editId }: props) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getallCategories());
  }, [dispatch]);

  const { categories } = useAppSelector(
    (state) => state.categoryData
  );

  const { loading, Coupons } = useAppSelector(
    (state) => state.couponData
  );

  const Coupon = Coupons?.find((item) => item._id === editId);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CouponFormInput, unknown, CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: 0,
      maxDiscount: null,
      minOrderAmount: 0,
      usageLimit: null,
      perUserLimit: 1,
      applicableCategories: [],
      isActive: true,
    },
  });

  useEffect(() => {
    if (Coupon) {
      reset({
        code: Coupon.code,
        description: Coupon.description ?? "",
        discountType: Coupon.discountType,
        discountValue: Coupon.discountValue,
        maxDiscount: Coupon.maxDiscount ?? null,
        minOrderAmount: Coupon.minOrderAmount,
        expiryDate: Coupon.expiryDate
          ? new Date(Coupon.expiryDate)
              .toISOString()
              .split("T")[0]
          : "",
        usageLimit: Coupon.usageLimit ?? null,
        perUserLimit: Coupon.perUserLimit,
        applicableCategories: Coupon.applicableCategories ?? [],
        isActive: Coupon.isActive,
      });
    } else {
      reset({
        code: "",
        description: "",
        discountType: "percentage",
        discountValue: 0,
        maxDiscount: null,
        minOrderAmount: 0,
        expiryDate: undefined,
        usageLimit: null,
        perUserLimit: 1,
        applicableCategories: [],
        isActive: true,
      });
    }
  }, [Coupon, reset, editId]);

  const discountType = watch("discountType");

  const dataHandle = async (data: CouponFormData) => {
    try {
      const page = 1;
      const search = "";
      const limit = 10;
      const filter = "";

      if (editId) {
        await dispatch(
          updateCoupon({
            id: editId,
            data,
          })
        ).unwrap();

        toast.success("Coupon updated successfully!");
      } else {
        await dispatch(addCoupon(data)).unwrap();

        toast.success("Coupon added successfully!");
      }

      await dispatch(
        getCoupons({ page, limit, search, filter })
      ).unwrap();

      onCLose();
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : editId
            ? "Failed to update coupon. Please try again."
            : "Failed to add coupon. Please try again."
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm sm:p-6"
      onClick={onCLose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="coupon-modal-title"
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-7">
          <div>
            <h2
              id="coupon-modal-title"
              className="text-xl font-bold text-slate-900"
            >
              {editId ? "Update Coupon" : "Add Coupon"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editId
                ? "Update the coupon details below."
                : "Create a discount coupon for your customers."}
            </p>
          </div>

          <button
            type="button"
            onClick={onCLose}
            aria-label="Close modal"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6l12 12M18 6 6 18"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Form Fields */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7">
          <form
            id="coupon-form"
            onSubmit={handleSubmit(dataHandle)}
            className="space-y-5"
          >
            {/* Coupon Code */}
            <div>
              <label
                htmlFor="code"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Coupon Code
              </label>

              <input
                id="code"
                type="text"
                placeholder="e.g. SAVE20"
                {...register("code")}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 uppercase outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

              {errors.code && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.code.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Description
              </label>

              <textarea
                id="description"
                rows={3}
                placeholder="Describe this coupon"
                {...register("description")}
                className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Discount Type */}
            <div>
              <label
                htmlFor="discountType"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Discount Type
              </label>

              <select
                id="discountType"
                {...register("discountType")}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>

              {errors.discountType && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.discountType.message}
                </p>
              )}
            </div>

            {/* Discount Value */}
            <div>
              <label
                htmlFor="discountValue"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Discount Value{" "}
                {discountType === "percentage" ? "(%)" : "(₹)"}
              </label>

              <input
                id="discountValue"
                type="number"
                min="0"
                step="any"
                placeholder="Enter discount value"
                {...register("discountValue", {
                  valueAsNumber: true,
                })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

              {errors.discountValue && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.discountValue.message}
                </p>
              )}
            </div>

            {/* Maximum Discount */}
            {discountType === "percentage" && (
              <div>
                <label
                  htmlFor="maxDiscount"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Maximum Discount (₹, optional)
                </label>

                <input
                  id="maxDiscount"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="No maximum"
                  {...register("maxDiscount", {
                    setValueAs: (value) =>
                      value === "" ? null : Number(value),
                  })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />

                {errors.maxDiscount && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.maxDiscount.message}
                  </p>
                )}
              </div>
            )}

            {/* Minimum Order Amount */}
            <div>
              <label
                htmlFor="minOrderAmount"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Minimum Order Amount (₹)
              </label>

              <input
                id="minOrderAmount"
                type="number"
                min="0"
                step="any"
                {...register("minOrderAmount", {
                  valueAsNumber: true,
                })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

              {errors.minOrderAmount && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.minOrderAmount.message}
                </p>
              )}
            </div>

            {/* Expiry Date */}
            <div>
              <label
                htmlFor="expiryDate"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Expiry Date
              </label>

              <input
                id="expiryDate"
                type="date"
                {...register("expiryDate")}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

              {errors.expiryDate && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.expiryDate.message}
                </p>
              )}
            </div>

            {/* Total Usage Limit */}
            <div>
              <label
                htmlFor="usageLimit"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Total Usage Limit (optional)
              </label>

              <input
                id="usageLimit"
                type="number"
                min="1"
                placeholder="Leave empty for unlimited"
                {...register("usageLimit", {
                  setValueAs: (value) =>
                    value === "" ? null : Number(value),
                })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

              {errors.usageLimit && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.usageLimit.message}
                </p>
              )}
            </div>

            {/* Per User Limit */}
            <div>
              <label
                htmlFor="perUserLimit"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Usage Limit Per User
              </label>

              <input
                id="perUserLimit"
                type="number"
                min="1"
                {...register("perUserLimit", {
                  valueAsNumber: true,
                })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

              {errors.perUserLimit && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.perUserLimit.message}
                </p>
              )}
            </div>

            {/* Applicable Categories */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Applicable Categories (optional)
              </label>

              <div className="max-h-48 space-y-1 overflow-y-auto rounded-xl border border-slate-200 p-3">
                {categories?.length > 0 ? (
                  categories.map((category) => (
                    <label
                      key={category._id}
                      className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition hover:bg-orange-50"
                    >
                      <input
                        type="checkbox"
                        value={category._id}
                        {...register("applicableCategories")}
                        className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                      />

                      <span className="text-sm text-slate-700">
                        {category.name}
                      </span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    No categories available.
                  </p>
                )}
              </div>

              <p className="mt-1.5 text-xs text-slate-500">
                Leave all unchecked to apply this coupon to all categories.
              </p>

              {errors.applicableCategories && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.applicableCategories.message ||
                    "Invalid category selection"}
                </p>
              )}
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
              <input
                id="isActive"
                type="checkbox"
                {...register("isActive")}
                className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
              />

              <label
                htmlFor="isActive"
                className="text-sm font-medium text-slate-700"
              >
                Activate coupon immediately
              </label>
            </div>
          </form>
        </div>

        {/* Fixed Footer - Outside Scrollable Content */}
        <div className="flex shrink-0 justify-end gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:px-7">
          <button
            type="button"
            onClick={onCLose}
            disabled={loading}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="coupon-form"
            disabled={loading}
            className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? editId
                ? "Updating Coupon..."
                : "Adding Coupon..."
              : editId
                ? "Update Coupon"
                : "Create Coupon"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CouponForm;
