"use client";

import { useState } from "react";
import { mockConversations, mockMessages } from "@/lib/messages-data";

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim()) {
      // In production, this would send via Chat API
      setNewMessage("");
    }
  };

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
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 rounded-full text-xs flex items-center justify-center">
                      {conv.unread}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{conv.participant.name}</span>
                      {conv.participant.verified && (
                        <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{conv.lastMessageTime}</span>
                  </div>
                  {conv.participant.role === "seller" && (
                    <span className="text-xs text-purple-400">Seller</span>
                  )}
                  {conv.auctionTitle && (
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      Re: {conv.auctionTitle}
                    </p>
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
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={selectedConversation.participant.avatar}
                alt={selectedConversation.participant.name}
                className="w-10 h-10 rounded-full bg-gray-700"
              />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{selectedConversation.participant.name}</p>
                  {selectedConversation.participant.verified && (
                    <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                {selectedConversation.participant.role === "seller" && (
                  <p className="text-sm text-purple-400">Verified Seller</p>
                )}
              </div>
            </div>
            {selectedConversation.auctionId && (
              <a
                href={`/auction/${selectedConversation.auctionId}`}
                className="px-3 py-1.5 bg-gray-700 text-sm rounded-lg hover:bg-gray-600 transition-colors"
              >
                View Auction
              </a>
            )}
          </div>

          {/* Auction Context */}
          {selectedConversation.auctionTitle && (
            <div className="px-4 py-3 bg-gray-800/50 border-b border-gray-800">
              <p className="text-sm text-gray-400">
                Regarding: <span className="text-white">{selectedConversation.auctionTitle}</span>
              </p>
            </div>
          )}

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
                      ? "bg-purple-600 text-white"
                      : "bg-gray-800 text-white"
                  }`}
                >
                  <p>{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.isMe ? "text-purple-200" : "text-gray-500"
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}

            {/* Chat Integration Note */}
            <div className="text-center py-4">
              <p className="text-sm text-gray-600">
                Chat system will power real-time messaging
              </p>
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={handleSend}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
