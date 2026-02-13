"use client";

import { useCallback, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
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
    appearance: "dark" as const,
    grayColor: "slate" as const,
  },
  variables: {
    "--color-background": "#1A1A1A",
  },
};

export default function MessagesPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { data: session } = useSession();
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

  // Stable token callback using the OAuth access token from the session.
  // Chat components require an OAuth token with DM scopes (dms:read, etc.),
  // not a server-generated access token from accessTokens.create().
  const getToken = useCallback(async () => {
    return session?.accessToken ?? "";
  }, [session?.accessToken]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 spinner-ocean rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-4xl mb-4">💬</div>
          <h1 className="text-xl font-bold mb-2">Sign In to View Messages</h1>
          <p className="text-gray-400 mb-6">You need to be logged in to access your messages.</p>
          <Link
            href="/auth/login?redirect=/messages"
            className="px-6 py-3 bg-[#0077B6] text-white rounded-lg hover:bg-[#023E8A] transition-colors font-semibold"
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
        <h1 className="text-2xl font-bold mb-6">Messages</h1>

        <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] overflow-hidden" style={{ height: "calc(100vh - 200px)" }}>
          <Elements appearance={appearance} elements={elements}>
            <ChatSession token={getToken}>
              <div className="flex h-full">
                <div className="w-80 border-r border-[#2A2A2A] overflow-y-auto">
                  <DmsListElement
                    options={dmsOptions}
                    fallback={
                      <div className="flex items-center justify-center py-12">
                        <div className="w-6 h-6 border-2 spinner-ocean rounded-full animate-spin" />
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
                          <div className="w-6 h-6 border-2 spinner-ocean rounded-full animate-spin" />
                        </div>
                      }
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
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
