"use client";

import { useState } from "react";
import { mockConversations, mockMessages } from "@/lib/messages-data";

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);

  return (
    <main className="h-[calc(100vh-73px)]">
      <div className="max-w-6xl mx-auto h-full flex">
        {/* Conversations List */}
        <div className="w-80 border-r border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <h1 className="text-xl font-bold">Messages</h1>
          </div>
          <div className="flex-1 overflow-y-auto">
            {mockConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-800/50 transition-colors text-left ${
                  selectedConversation.id === conv.id ? "bg-gray-800" : ""
                }`}
              >
                <div className="relative">
                  <img
                    src={conv.participant.avatar}
                    alt={conv.participant.name}
                    className="w-12 h-12 rounded-full bg-gray-700"
                  />
                  {conv.unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full text-xs flex items-center justify-center">
                      {conv.unread}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{conv.participant.name}</span>
                    <span className="text-xs text-gray-500">{conv.lastMessageTime}</span>
                  </div>
                  {conv.participant.role === "coach" && (
                    <span className="text-xs text-blue-400">Coach</span>
                  )}
                  <p className="text-sm text-gray-400 truncate mt-1">
                    {conv.lastMessage}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-800 flex items-center gap-3">
            <img
              src={selectedConversation.participant.avatar}
              alt={selectedConversation.participant.name}
              className="w-10 h-10 rounded-full bg-gray-700"
            />
            <div>
              <p className="font-semibold">{selectedConversation.participant.name}</p>
              {selectedConversation.participant.role === "coach" && (
                <p className="text-sm text-blue-400">Coach</p>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mockMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-md px-4 py-3 rounded-2xl ${
                    message.isMe
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-white"
                  }`}
                >
                  <p>{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.isMe ? "text-blue-200" : "text-gray-500"
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}

            {/* Whop Chat Integration Note */}
            <div className="text-center py-4">
              <p className="text-sm text-gray-600">
                Whop Chat SDK will power real-time messaging
              </p>
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
