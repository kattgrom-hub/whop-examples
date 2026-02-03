export type Conversation = {
  id: string;
  participant: {
    name: string;
    avatar: string;
    role: "buyer" | "seller";
  };
  listingTitle: string;
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
      name: "Emma Chen",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=emma",
      role: "seller",
    },
    listingTitle: "Vintage Nike Dunk Low",
    lastMessage: "Meet at Bruin Plaza tomorrow at 2pm?",
    lastMessageTime: "2 hours ago",
    unread: 1,
  },
  {
    id: "conv2",
    participant: {
      name: "Sophie Williams",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=sophie",
      role: "seller",
    },
    listingTitle: 'MacBook Pro 14"',
    lastMessage: "Yes, still available! When can you meet?",
    lastMessageTime: "Yesterday",
    unread: 0,
  },
  {
    id: "conv3",
    participant: {
      name: "Chris Wilson",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=chris",
      role: "buyer",
    },
    listingTitle: "Supreme Box Logo Hoodie",
    lastMessage: "Thanks! Great doing business with you",
    lastMessageTime: "3 days ago",
    unread: 0,
  },
  {
    id: "conv4",
    participant: {
      name: "Jamie Santos",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=jamie",
      role: "buyer",
    },
    listingTitle: "Wireless Headphones",
    lastMessage: "Is the price negotiable?",
    lastMessageTime: "5 hours ago",
    unread: 2,
  },
];

export const mockMessages: Message[] = [
  {
    id: "m1",
    senderId: "emma",
    content: "Hi! I'm interested in the Nike Dunks. Are they still available?",
    timestamp: "10:00 AM",
    isMe: false,
  },
  {
    id: "m2",
    senderId: "me",
    content: "Hey! Yes, they're still available. Size 9, barely worn.",
    timestamp: "10:02 AM",
    isMe: true,
  },
  {
    id: "m3",
    senderId: "emma",
    content: "Perfect! That's exactly my size. Can you do $100?",
    timestamp: "10:05 AM",
    isMe: false,
  },
  {
    id: "m4",
    senderId: "me",
    content: "I can do $110, that's the lowest I can go. They're in great condition.",
    timestamp: "10:08 AM",
    isMe: true,
  },
  {
    id: "m5",
    senderId: "emma",
    content: "Deal! When and where can we meet?",
    timestamp: "10:10 AM",
    isMe: false,
  },
  {
    id: "m6",
    senderId: "me",
    content: "How about Bruin Plaza tomorrow at 2pm?",
    timestamp: "10:12 AM",
    isMe: true,
  },
  {
    id: "m7",
    senderId: "emma",
    content: "Meet at Bruin Plaza tomorrow at 2pm?",
    timestamp: "10:15 AM",
    isMe: false,
  },
];
