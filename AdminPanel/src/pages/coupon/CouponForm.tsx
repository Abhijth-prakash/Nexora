
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
import { addCoupon } from "../../redux/features/CouponSlice";
import { toast } from "react-toastify";
export type props = {
  onCLose: () => void;
};

const CouponForm = ({ onCLose }: props) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getallCategories());
  }, [dispatch]);

  const { categories } = useAppSelector(
    (state) => state.categoryData
  );
  const { loading } = useAppSelector((state) => state.couponData);

  const {
    register,
    handleSubmit,
    watch,
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

  const discountType = watch("discountType");




const dataHandle = async (data: CouponFormData) => {
  try {
    await dispatch(addCoupon(data)).unwrap();

    toast.success("Coupon added successfully!");
    onCLose();
  } catch (error) {
    toast.error(
      typeof error === "string"
        ? error
        : "Failed to add coupon. Please try again."
    );
  }
};







  return (
    <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Add Coupon
        </h2>

        <button
          type="button"
          onClick={onCLose}
          className="rounded-lg px-3 py-2 text-sm text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
        >
          Close
        </button>
      </div>

      <form onSubmit={handleSubmit(dataHandle)} className="space-y-5">
        {/* Coupon Code */}
        <div>
          <label htmlFor="code" className="mb-1.5 block text-sm font-medium text-gray-700">
            Coupon Code
          </label>

          <input
            id="code"
            type="text"
            placeholder="e.g. SAVE20"
            {...register("code")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 uppercase outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          {errors.code && (
            <p className="mt-1 text-sm text-red-500">{errors.code.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-gray-700">
            Description
          </label>

          <textarea
            id="description"
            rows={3}
            placeholder="Describe this coupon"
            {...register("description")}
            className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Discount Type */}
        <div>
          <label htmlFor="discountType" className="mb-1.5 block text-sm font-medium text-gray-700">
            Discount Type
          </label>

          <select
            id="discountType"
            {...register("discountType")}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount (₹)</option>
          </select>

          {errors.discountType && (
            <p className="mt-1 text-sm text-red-500">{errors.discountType.message}</p>
          )}
        </div>

        {/* Discount Value */}
        <div>
          <label htmlFor="discountValue" className="mb-1.5 block text-sm font-medium text-gray-700">
            Discount Value {discountType === "percentage" ? "(%)" : "(₹)"}
          </label>

          <input
            id="discountValue"
            type="number"
            min="0"
            step="any"
            placeholder="Enter discount value"
            {...register("discountValue", { valueAsNumber: true })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          {errors.discountValue && (
            <p className="mt-1 text-sm text-red-500">{errors.discountValue.message}</p>
          )}
        </div>

        {/* Maximum Discount */}
        {discountType === "percentage" && (
          <div>
            <label htmlFor="maxDiscount" className="mb-1.5 block text-sm font-medium text-gray-700">
              Maximum Discount (₹, optional)
            </label>

            <input
              id="maxDiscount"
              type="number"
              min="0"
              step="any"
              placeholder="No maximum"
              {...register("maxDiscount", {
                setValueAs: (value) => value === "" ? null : Number(value),
              })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            {errors.maxDiscount && (
              <p className="mt-1 text-sm text-red-500">{errors.maxDiscount.message}</p>
            )}
          </div>
        )}

        {/* Minimum Order Amount */}
        <div>
          <label htmlFor="minOrderAmount" className="mb-1.5 block text-sm font-medium text-gray-700">
            Minimum Order Amount (₹)
          </label>

          <input
            id="minOrderAmount"
            type="number"
            min="0"
            step="any"
            {...register("minOrderAmount", { valueAsNumber: true })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          {errors.minOrderAmount && (
            <p className="mt-1 text-sm text-red-500">{errors.minOrderAmount.message}</p>
          )}
        </div>

        {/* Expiry Date */}
        <div>
          <label htmlFor="expiryDate" className="mb-1.5 block text-sm font-medium text-gray-700">
            Expiry Date
          </label>

          <input
            id="expiryDate"
            type="date"
            {...register("expiryDate")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          {errors.expiryDate && (
            <p className="mt-1 text-sm text-red-500">{errors.expiryDate.message}</p>
          )}
        </div>

        {/* Total Usage Limit */}
        <div>
          <label htmlFor="usageLimit" className="mb-1.5 block text-sm font-medium text-gray-700">
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
/>

          {errors.usageLimit && (
            <p className="mt-1 text-sm text-red-500">{errors.usageLimit.message}</p>
          )}
        </div>

        {/* Per User Limit */}
        <div>
          <label htmlFor="perUserLimit" className="mb-1.5 block text-sm font-medium text-gray-700">
            Usage Limit Per User
          </label>

          <input
            id="perUserLimit"
            type="number"
            min="1"
            {...register("perUserLimit", { valueAsNumber: true })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          {errors.perUserLimit && (
            <p className="mt-1 text-sm text-red-500">{errors.perUserLimit.message}</p>
          )}
        </div>

        {/* Applicable Categories */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Applicable Categories (optional)
          </label>

          <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-gray-200 p-3">
            {categories?.length > 0 ? (
              categories.map((category) => (
                <label
                  key={category._id}
                  className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    value={category._id}
                    {...register("applicableCategories")}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />

                  <span className="text-sm text-gray-700">{category.name}</span>
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500">No categories available.</p>
            )}
          </div>

          <p className="mt-1.5 text-xs text-gray-500">
            Leave all unchecked to apply this coupon to all categories.
          </p>

          {errors.applicableCategories && (
            <p className="mt-1 text-sm text-red-500">
              {errors.applicableCategories.message || "Invalid category selection"}
            </p>
          )}
        </div>

        {/* Active Status */}
        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
          <input
            id="isActive"
            type="checkbox"
            {...register("isActive")}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />

          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
            Activate coupon immediately
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
          <button
            type="button"
            onClick={onCLose}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>

        <button
  type="submit"
  disabled={loading}
  className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
>
  {loading ? "Adding Coupon..." : "Create Coupon"}
</button>
        </div>
      </form>
    </div>
  );
};

export default CouponForm;
