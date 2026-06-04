"use client";

export default function CancelBookingButton() {
  return (
    <button
      type="submit"
      onClick={(e) => {
        const confirmed = window.confirm(
          "Are you sure you want to cancel this booking? This action cannot be undone."
        );

        if (!confirmed) {
          e.preventDefault();
        }
      }}
      className="mt-4 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
    >
      Cancel Booking
    </button>
  );
}