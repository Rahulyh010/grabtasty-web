import React, { Suspense } from "react";
import VerifyEmailPage from "./_Components/page";

export default function Page() {
  return (
    <Suspense fallback={<div> Loadig</div>}>
      <VerifyEmailPage />
    </Suspense>
  );
}
