"use client";

import { useCallback, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import {
  ChatElement,
  ChatSession,
  DmsListElement,
  Elements,
} from "@whop/embedded-components-react-js";
import { loadWhopElements } from "@whop/embedded-components-vanilla-js";
import type {
  DmsListElementEvent,
  DmsListElementOptions,
  ChatElementOptions,
} from "@whop/embedded-components-vanilla-js/types";

const elements = loadWhopElements();

const appearance = {
  theme: {
    appearance: "light" as const,
    grayColor: "slate" as const,
  },
  variables: {
    "--color-background": "#1A1A1A",
  },
};

export default function MessagesPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [channelId, setChannelId] = useState<string>();

  const handleDmsEvent = useCallback((event: DmsListElementEvent) => {
    switch (event.type) {
      case "channelSelected":
        setChannelId(event.detail.id);
        break;
    }
  }, []);

  const dmsOptions: DmsListElementOptions = useMemo(() => {
    return {
      selectedChannel: channelId,
      onEvent: handleDmsEvent,
    };
  }, [channelId, handleDmsEvent]);

  const chatOptions: ChatElementOptions | undefined = useMemo(() => {
    if (!channelId) return undefined;
    return {
      channelId,
    };
  }, [channelId]);

  // Fetch a short-lived access token from our API route, which calls
  // accessTokens.create() server-side. Embedded components require this
  // token format, not the raw OAuth access token.
  const getToken = useCallback(async () => {
    if (!user?.id) return "";
    const res = await fetch(`/api/chat/token?userId=${user.id}`);
    if (!res.ok) return "";
    const data = await res.json();
    return data.token ?? "";
  }, [user?.id]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 spinner-airbnb rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-4xl mb-4">💬</div>
          <h1 className="text-xl font-bold mb-2 text-[#222222]">Sign In to View Messages</h1>
          <p className="text-[#717171] mb-6">You need to be logged in to access your messages.</p>
          <Link
            href="/auth/login?redirect=/messages"
            className="px-6 py-3 bg-[#FF385C] text-white rounded-lg hover:bg-[#D70466] transition-colors font-semibold"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6 text-[#222222]">Messages</h1>

        <div className="bg-white rounded-xl border border-[#DDDDDD] overflow-hidden shadow-sm" style={{ height: "calc(100vh - 200px)" }}>
          <Elements appearance={appearance} elements={elements}>
            <ChatSession token={getToken}>
              <div className="flex h-full">
                <div className="w-80 border-r border-[#DDDDDD] overflow-y-auto">
                  <DmsListElement
                    options={dmsOptions}
                    fallback={
                      <div className="flex items-center justify-center py-12">
                        <div className="w-6 h-6 border-2 spinner-airbnb rounded-full animate-spin" />
                      </div>
                    }
                  />
                </div>
                <div className="flex-1">
                  {chatOptions ? (
                    <ChatElement
                      options={chatOptions}
                      style={{ height: "100%", width: "100%" }}
                      fallback={
                        <div className="flex items-center justify-center h-full">
                          <div className="w-6 h-6 border-2 spinner-airbnb rounded-full animate-spin" />
                        </div>
                      }
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-[#717171]">
                      Select a conversation
                    </div>
                  )}
                </div>
              </div>
            </ChatSession>
          </Elements>
        </div>
      </div>
    </div>
  );
}
