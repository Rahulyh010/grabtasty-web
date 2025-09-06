import React, { Suspense } from "react";
import CheckoutPage from "./_components/Page";

export default function Subscribe() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutPage />
    </Suspense>
  );
}
