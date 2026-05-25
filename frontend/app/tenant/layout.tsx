"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { api, type ConsentOut } from "@/lib/api";
import ConsentModal from "@/components/ConsentModal";

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [consentChecked, setConsentChecked] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
      return;
    }
    if (loading || !user) return;

    api.get<ConsentOut>("/consent/me")
      .then((record) => setHasConsent(!!record && !record.withdrawn_at))
      .catch(() => setHasConsent(false))
      .finally(() => setConsentChecked(true));
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-950">
        <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      {children}
      {consentChecked && !hasConsent && (
        <ConsentModal onConsented={() => setHasConsent(true)} />
      )}
    </>
  );
}
