export type Conversation = {
  id: string;
  participant: {
    name: string;
    avatar: string;
    role: "talent" | "client";
  };
  gigTitle?: string;
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
      name: "VeroSkills",
      avatar: "https://api.dicebear.com/9.x/initials/svg?seed=VS",
      role: "client",
    },
    gigTitle: "Product Photography",
    lastMessage: "Great! The initial shots look fantastic. Can we add a few more angles?",
    lastMessageTime: "2 hours ago",
    unread: 2,
  },
  {
    id: "conv2",
    participant: {
      name: "Maya Rodriguez",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=maya",
      role: "talent",
    },
    gigTitle: "UGC Campaign",
    lastMessage: "I'll have the first draft ready by tomorrow morning!",
    lastMessageTime: "Yesterday",
    unread: 0,
  },
  {
    id: "conv3",
    participant: {
      name: "FoodFluence",
      avatar: "https://api.dicebear.com/9.x/initials/svg?seed=FF",
      role: "client",
    },
    gigTitle: "App Launch Content",
    lastMessage: "Thanks for applying! We'd love to see more of your food content samples.",
    lastMessageTime: "3 days ago",
    unread: 1,
  },
  {
    id: "conv4",
    participant: {
      name: "James Chen",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=james",
      role: "talent",
    },
    lastMessage: "Payment received, thank you!",
    lastMessageTime: "1 week ago",
    unread: 0,
  },
];

export const mockMessages: Message[] = [
  {
    id: "m1",
    senderId: "client",
    content: "Hi! Thanks for accepting the project. Really excited to work with you!",
    timestamp: "10:00 AM",
    isMe: false,
  },
  {
    id: "m2",
    senderId: "me",
    content: "Thank you! I'm excited too. I've reviewed the brief and have a few questions.",
    timestamp: "10:05 AM",
    isMe: true,
  },
  {
    id: "m3",
    senderId: "client",
    content: "Sure, fire away!",
    timestamp: "10:06 AM",
    isMe: false,
  },
  {
    id: "m4",
    senderId: "me",
    content: "For the lifestyle shots, do you want them on white background or in a real environment? I'm thinking a modern desk setup could work well for your target audience.",
    timestamp: "10:10 AM",
    isMe: true,
  },
  {
    id: "m5",
    senderId: "client",
    content: "Great question! Let's do both - white background for the main product shots, and lifestyle for the hero images. The desk setup idea sounds perfect!",
    timestamp: "10:15 AM",
    isMe: false,
  },
  {
    id: "m6",
    senderId: "me",
    content: "Perfect, I'll plan for both. I can have the initial concepts ready by Thursday. I'll share a mood board first for your approval.",
    timestamp: "10:18 AM",
    isMe: true,
  },
  {
    id: "m7",
    senderId: "client",
    content: "Great! The initial shots look fantastic. Can we add a few more angles?",
    timestamp: "2:30 PM",
    isMe: false,
  },
];
