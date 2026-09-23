"use client";

import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from "react";
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";
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

const noop = () => { };

const TawkChatWidget = forwardRef<TawkChatWidgetRef, TawkChatWidgetProps>(
  (
    {
      propertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID || "6ab357a284951a34442d6c38",
      widgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID || "1k368sl56",
    },
    ref
  ) => {
    const [mounted, setMounted] = useState(false);
    const tawkRef = useRef<any>(null);
    const { user } = useAuthStore();

    useEffect(() => {
      setMounted(true);
    }, []);

    // Synchronize visitor attributes when user logs in or tawk loads
    const syncUserAttributes = () => {
      if (tawkRef.current && user) {
        try {
          tawkRef.current.setAttributes(
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

    const handleOnLoad = () => {
      syncUserAttributes();
    };

    useEffect(() => {
      if (mounted && user) {
        syncUserAttributes();
      }
    }, [user, mounted]);

    useImperativeHandle(ref, () => ({
      maximize: () => {
        try {
          tawkRef.current?.maximize();
        } catch (e) {
          console.warn("[Tawk] Maximize failed:", e);
        }
      },
      minimize: () => {
        try {
          tawkRef.current?.minimize();
        } catch (e) {
          console.warn("[Tawk] Minimize failed:", e);
        }
      },
      toggle: () => {
        try {
          tawkRef.current?.toggle();
        } catch (e) {
          console.warn("[Tawk] Toggle failed:", e);
        }
      },
      popup: () => {
        try {
          tawkRef.current?.popup();
        } catch (e) {
          console.warn("[Tawk] Popup failed:", e);
        }
      },
    }));

    if (!mounted || !propertyId || !widgetId) {
      return null;
    }

    return (
      <TawkMessengerReact
        ref={tawkRef}
        propertyId={propertyId}
        widgetId={widgetId}
        onLoad={handleOnLoad}
        onStatusChange={noop}
        onBeforeLoad={noop}
        onBeforeLoaded={noop}
        onChatMaximized={noop}
        onChatMinimized={noop}
        onChatHidden={noop}
        onChatStarted={noop}
        onChatEnded={noop}
        onPrechatSubmit={noop}
        onOfflineSubmit={noop}
        onChatMessageVisitor={noop}
        onChatMessageAgent={noop}
        onChatMessageSystem={noop}
        onAgentJoinChat={noop}
        onAgentLeaveChat={noop}
        onChatSatisfaction={noop}
        onVisitorNameChanged={noop}
        onFileUpload={noop}
        onTagsUpdated={noop}
        onUnreadCountChanged={noop}
      />
    );
  }
);

TawkChatWidget.displayName = "TawkChatWidget";

export default TawkChatWidget;
