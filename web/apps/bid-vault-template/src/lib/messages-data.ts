export type Conversation = {
  id: string;
  participant: {
    name: string;
    avatar: string;
    role: "seller" | "buyer";
    verified: boolean;
  };
  auctionId?: string;
  auctionTitle?: string;
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
      name: "Elite Cards",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=elitecards",
      role: "seller",
      verified: true,
    },
    auctionId: "1",
    auctionTitle: "1986 Fleer Michael Jordan Rookie Card PSA 10",
    lastMessage: "Happy to provide additional photos of the corners if helpful",
    lastMessageTime: "2 hours ago",
    unread: 1,
  },
  {
    id: "conv2",
    participant: {
      name: "Sole Legacy",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=sole",
      role: "seller",
      verified: true,
    },
    auctionId: "2",
    auctionTitle: "Nike Air Jordan 1 'Chicago' 2015",
    lastMessage: "Shipping will go out same day once payment clears!",
    lastMessageTime: "Yesterday",
    unread: 0,
  },
  {
    id: "conv3",
    participant: {
      name: "CardKing23",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=cardking",
      role: "buyer",
      verified: false,
    },
    auctionId: "6",
    auctionTitle: "Pokemon Base Set Charizard 1st Edition PSA 9",
    lastMessage: "Would you consider a Buy It Now offer?",
    lastMessageTime: "3 days ago",
    unread: 0,
  },
  {
    id: "conv4",
    participant: {
      name: "Chrono Luxe",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=chrono",
      role: "seller",
      verified: true,
    },
    lastMessage: "Thanks for your interest! Let me know if you have questions",
    lastMessageTime: "1 week ago",
    unread: 0,
  },
];

export const mockMessages: Message[] = [
  {
    id: "m1",
    senderId: "elitecards",
    content: "Hi! Thanks for your interest in the Jordan rookie card.",
    timestamp: "10:00 AM",
    isMe: false,
  },
  {
    id: "m2",
    senderId: "me",
    content: "Hi! The card looks amazing. Can you tell me more about the centering?",
    timestamp: "10:05 AM",
    isMe: true,
  },
  {
    id: "m3",
    senderId: "elitecards",
    content: "Absolutely! PSA noted it at approximately 60/40 left-right and 55/45 top-bottom. For a PSA 10, this is exceptional centering.",
    timestamp: "10:08 AM",
    isMe: false,
  },
  {
    id: "m4",
    senderId: "me",
    content: "That's great. Any chance you have more photos showing the corners up close?",
    timestamp: "10:15 AM",
    isMe: true,
  },
  {
    id: "m5",
    senderId: "elitecards",
    content: "Happy to provide additional photos of the corners if helpful",
    timestamp: "10:20 AM",
    isMe: false,
  },
];

export function getConversation(id: string): Conversation | undefined {
  return mockConversations.find((c) => c.id === id);
}
