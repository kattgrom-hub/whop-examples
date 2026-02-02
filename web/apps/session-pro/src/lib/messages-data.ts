export type Conversation = {
  id: string;
  participant: {
    name: string;
    avatar: string;
    role: "coach" | "student";
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
      name: "Alex Chen",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=alex",
      role: "coach",
    },
    lastMessage: "See you at our session tomorrow at 10am!",
    lastMessageTime: "2 hours ago",
    unread: 1,
  },
  {
    id: "conv2",
    participant: {
      name: "Sarah Mitchell",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=sarah",
      role: "coach",
    },
    lastMessage: "Great progress on the chord transitions!",
    lastMessageTime: "Yesterday",
    unread: 0,
  },
  {
    id: "conv3",
    participant: {
      name: "Jamie Wilson",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=jamie",
      role: "student",
    },
    lastMessage: "Thanks for the session, really helpful!",
    lastMessageTime: "3 days ago",
    unread: 0,
  },
];

export const mockMessages: Message[] = [
  {
    id: "m1",
    senderId: "alex",
    content: "Hey! Thanks for booking a session with me.",
    timestamp: "10:00 AM",
    isMe: false,
  },
  {
    id: "m2",
    senderId: "me",
    content: "Hi Alex! Really excited to improve my aim.",
    timestamp: "10:02 AM",
    isMe: true,
  },
  {
    id: "m3",
    senderId: "alex",
    content: "We'll work on crosshair placement and pre-aim spots first. Those usually give the biggest improvement quickly.",
    timestamp: "10:03 AM",
    isMe: false,
  },
  {
    id: "m4",
    senderId: "me",
    content: "Sounds good! I've been stuck in Platinum for a while now.",
    timestamp: "10:05 AM",
    isMe: true,
  },
  {
    id: "m5",
    senderId: "alex",
    content: "See you at our session tomorrow at 10am!",
    timestamp: "10:10 AM",
    isMe: false,
  },
];
