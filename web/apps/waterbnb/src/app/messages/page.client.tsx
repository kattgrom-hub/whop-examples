"use client";

import { useCallback, useMemo, useState } from "react";
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
};

async function getToken() {
  const response = await fetch("/api/chat/token");
  const data = await response.json();
  return data.token;
}

export function MessagesClient() {
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
      companyId: process.env.NEXT_PUBLIC_WHOP_COMPANY_ID,
      selectedChannel: channelId,
      onEvent: handleDmsEvent,
    };
  }, [channelId, handleDmsEvent]);

  const chatOptions: ChatElementOptions = useMemo(() => {
    return {
      channelId: channelId ?? "",
    };
  }, [channelId]);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6 text-[#222222]">Messages</h1>

        <div className="bg-white rounded-xl border border-[#DDDDDD] overflow-hidden shadow-sm" style={{ height: "calc(100vh - 200px)" }}>
          <Elements appearance={appearance} elements={elements}>
            <ChatSession token={getToken}>
              <div className="flex h-full">
                <div className="w-80 h-full border-r border-[#DDDDDD] overflow-hidden">
                  <DmsListElement
                    options={dmsOptions}
                    style={{ height: "100%" }}
                    fallback={
                      <div className="flex items-center justify-center h-full">
                        <div className="w-6 h-6 border-2 spinner-airbnb rounded-full animate-spin" />
                      </div>
                    }
                  />
                </div>
                <div className="flex-1">
                  {channelId ? (
                    <ChatElement
                      key={channelId}
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
