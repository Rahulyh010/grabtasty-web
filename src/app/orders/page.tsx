import React, { Suspense } from "react";
import OrdersPage from "./_components/Page";

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrdersPage />
    </Suspense>
  );
}
