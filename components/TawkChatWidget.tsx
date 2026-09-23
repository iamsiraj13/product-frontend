"use client";

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import Script from "next/script";
import { useAuthStore } from "@/store/useAuthStore";

export interface TawkChatWidgetRef {
  maximize: () => void;
  minimize: () => void;
  toggle: () => void;
  popup: () => void;
}

interface TawkChatWidgetProps {
  propertyId?: string;
  widgetId?: string;
}

const TawkChatWidget = forwardRef<TawkChatWidgetRef, TawkChatWidgetProps>(
  (
    {
      propertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID || "6ab357a284951a34442d6c38",
      widgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID || "1k368sl56",
    },
    ref
  ) => {
    const { user } = useAuthStore();
    const isLoadedRef = useRef(false);

    const syncUserAttributes = () => {
      if (typeof window !== "undefined" && window.Tawk_API && typeof window.Tawk_API.setAttributes === "function" && user) {
        try {
          window.Tawk_API.setAttributes(
            {
              name: user.username || "Visitor",
              email: user.email || "",
              phone: user.phone || "",
              hash: user.id || "",
              accountType: user.accountType || "",
              invitationCode: user.invitationCode || "",
            },
            (error: any) => {
              if (error) {
                console.warn("[Tawk] Failed to set attributes:", error);
              }
            }
          );
        } catch (err) {
          console.warn("[Tawk] Error setting user attributes:", err);
        }
      }
    };

    useEffect(() => {
      if (typeof window !== "undefined") {
        window.Tawk_API = window.Tawk_API || {};
        window.Tawk_LoadStart = new Date();

        const existingOnLoad = window.Tawk_API.onLoad;
        window.Tawk_API.onLoad = function () {
          isLoadedRef.current = true;
          if (typeof existingOnLoad === "function") {
            existingOnLoad();
          }
          syncUserAttributes();
        };
      }
    }, []);

    useEffect(() => {
      if (user) {
        syncUserAttributes();
      }
    }, [user]);

    useImperativeHandle(ref, () => ({
      maximize: () => {
        try {
          window.Tawk_API?.maximize?.();
        } catch (e) {
          console.warn("[Tawk] Maximize failed:", e);
        }
      },
      minimize: () => {
        try {
          window.Tawk_API?.minimize?.();
        } catch (e) {
          console.warn("[Tawk] Minimize failed:", e);
        }
      },
      toggle: () => {
        try {
          window.Tawk_API?.toggle?.();
        } catch (e) {
          console.warn("[Tawk] Toggle failed:", e);
        }
      },
      popup: () => {
        try {
          window.Tawk_API?.popup?.();
        } catch (e) {
          console.warn("[Tawk] Popup failed:", e);
        }
      },
    }));

    if (!propertyId || !widgetId) {
      return null;
    }

    return (
      <Script
        id="tawk-script"
        strategy="afterInteractive"
        src={`https://embed.tawk.to/${propertyId}/${widgetId}`}
        charSet="UTF-8"
        crossOrigin="anonymous"
      />
    );
  }
);

TawkChatWidget.displayName = "TawkChatWidget";

export default TawkChatWidget;
