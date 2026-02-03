export type Conversation = {
  id: string;
  participant: {
    name: string;
    avatar: string;
    role: "analyst" | "subscriber";
  };
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
};

export type Message = {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isMe: boolean;
};

export const mockConversations: Conversation[] = [
  {
    id: "conv1",
    participant: {
      name: "Mike Sharp",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=mikesharp",
      role: "analyst",
    },
    lastMessage: "The Chiefs play is definitely my top pick for today. GL!",
    lastMessageTime: "2 hours ago",
    unread: 1,
  },
  {
    id: "conv2",
    participant: {
      name: "Sarah Hoops",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=sarahhoops",
      role: "analyst",
    },
    lastMessage: "I'll have the NBA plays posted by noon EST",
    lastMessageTime: "Yesterday",
    unread: 0,
  },
  {
    id: "conv3",
    participant: {
      name: "Chris Walker",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=chrisw",
      role: "subscriber",
    },
    lastMessage: "Thanks for the tips! Up 8 units this week",
    lastMessageTime: "3 days ago",
    unread: 0,
  },
];

export const mockMessages: Message[] = [
  {
    id: "m1",
    senderId: "mike",
    content: "Hey! Thanks for subscribing. Feel free to ask any questions about my picks.",
    timestamp: "10:00 AM",
    isMe: false,
  },
  {
    id: "m2",
    senderId: "me",
    content: "Thanks Mike! Quick question - what's your confidence level on the Chiefs spread today?",
    timestamp: "10:15 AM",
    isMe: true,
  },
  {
    id: "m3",
    senderId: "mike",
    content: "I'm very confident. The line has moved in our direction and I'm seeing sharp money on KC. This is a 3-unit play for me.",
    timestamp: "10:18 AM",
    isMe: false,
  },
  {
    id: "m4",
    senderId: "me",
    content: "Perfect. I'm tailing. What about the over/under?",
    timestamp: "10:22 AM",
    isMe: true,
  },
  {
    id: "m5",
    senderId: "mike",
    content: "The Chiefs play is definitely my top pick for today. GL!",
    timestamp: "10:25 AM",
    isMe: false,
  },
];
