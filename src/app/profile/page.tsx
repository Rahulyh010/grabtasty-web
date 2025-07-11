import React, { Suspense } from "react";
import ProfilePage from "./_components/Page";

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfilePage />
    </Suspense>
  );
}
