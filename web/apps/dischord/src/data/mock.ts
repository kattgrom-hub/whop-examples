export interface Server {
  id: string;
  name: string;
  icon: string;
  unreadCount: number;
}

export interface Channel {
  id: string;
  name: string;
  type: "text" | "voice";
  category: string;
  unread?: boolean;
  activeUsers?: number;
}

export type Role = "Producer" | "Vocalist" | "Engineer" | "A&R";

export interface Member {
  id: string;
  name: string;
  avatar: string;
  role: Role;
  online: boolean;
  activity?: string;
}

export interface Message {
  id: string;
  author: Member;
  content: string;
  timestamp: string;
  channelId: string;
}

export const ROLE_COLORS: Record<Role, string> = {
  Producer: "#22C55E",
  Vocalist: "#A78BFA",
  Engineer: "#3B82F6",
  "A&R": "#F59E0B",
};

export const servers: Server[] = [
  { id: "1", name: "Producer Hub", icon: "PH", unreadCount: 3 },
  { id: "2", name: "Vocalist Lounge", icon: "VL", unreadCount: 0 },
  { id: "3", name: "Beat Market", icon: "BM", unreadCount: 7 },
  { id: "4", name: "A&R Network", icon: "AR", unreadCount: 1 },
  { id: "5", name: "Sample Library", icon: "SL", unreadCount: 0 },
];

export const channels: Channel[] = [
  { id: "ch-1", name: "general", type: "text", category: "Text Channels", unread: true },
  { id: "ch-2", name: "collabs", type: "text", category: "Text Channels", unread: false },
  { id: "ch-3", name: "feedback", type: "text", category: "Text Channels", unread: true },
  { id: "ch-4", name: "drops", type: "text", category: "Text Channels", unread: false },
  { id: "ch-5", name: "samples", type: "text", category: "Text Channels", unread: true },
  { id: "ch-6", name: "Studio A", type: "voice", category: "Voice Channels", activeUsers: 3 },
  { id: "ch-7", name: "Mixing Room", type: "voice", category: "Voice Channels", activeUsers: 0 },
  { id: "ch-8", name: "Open Mic", type: "voice", category: "Voice Channels", activeUsers: 1 },
];

export const members: Member[] = [
  { id: "m-1", name: "KaiBeats", avatar: "KB", role: "Producer", online: true, activity: "Ableton Live" },
  { id: "m-2", name: "VoxQueen", avatar: "VQ", role: "Vocalist", online: true, activity: "Recording vocals" },
  { id: "m-3", name: "MixMasterJ", avatar: "MJ", role: "Engineer", online: true, activity: "Pro Tools" },
  { id: "m-4", name: "A&R_Marcus", avatar: "AM", role: "A&R", online: true, activity: "Reviewing demos" },
  { id: "m-5", name: "SynthLord", avatar: "SY", role: "Producer", online: true, activity: "FL Studio" },
  { id: "m-6", name: "MelodyMae", avatar: "MM", role: "Vocalist", online: true },
  { id: "m-7", name: "BassDropper", avatar: "BD", role: "Producer", online: true, activity: "Logic Pro" },
  { id: "m-8", name: "StudioTech", avatar: "ST", role: "Engineer", online: true },
  { id: "m-9", name: "LabelScout", avatar: "LS", role: "A&R", online: false },
  { id: "m-10", name: "RhythmKid", avatar: "RK", role: "Producer", online: false },
  { id: "m-11", name: "SoulSinger", avatar: "SS", role: "Vocalist", online: false },
  { id: "m-12", name: "AudioPhile", avatar: "AP", role: "Engineer", online: false },
  { id: "m-13", name: "TrapArchitect", avatar: "TA", role: "Producer", online: true, activity: "MPC Live" },
  { id: "m-14", name: "VocalFry", avatar: "VF", role: "Vocalist", online: false },
];

export const messages: Message[] = [
  {
    id: "msg-1",
    author: members[0],
    content: "Just dropped a new lo-fi beat tape -- 12 tracks, all vinyl-sampled. Anyone want to hop on a collab?",
    timestamp: "Today at 2:14 PM",
    channelId: "ch-1",
  },
  {
    id: "msg-2",
    author: members[1],
    content: "I'd be down! I've been looking for some chill instrumentals to lay vocals on. Can you send me the stems?",
    timestamp: "Today at 2:16 PM",
    channelId: "ch-1",
  },
  {
    id: "msg-3",
    author: members[2],
    content: "Heads up everyone -- I just upgraded the studio to Dolby Atmos. If anyone needs spatial mixing, hit me up. Running a discounted rate this month.",
    timestamp: "Today at 2:20 PM",
    channelId: "ch-1",
  },
  {
    id: "msg-4",
    author: members[3],
    content: "We're looking for fresh R&B/Soul demos for a new playlist placement. 3-minute max, mastered, send links here or DM me.",
    timestamp: "Today at 2:25 PM",
    channelId: "ch-1",
  },
  {
    id: "msg-5",
    author: members[4],
    content: "That new Serum wavetable pack is insane. Been making these huge supersaws with it. Check out this preview:",
    timestamp: "Today at 2:31 PM",
    channelId: "ch-1",
  },
  {
    id: "msg-6",
    author: members[5],
    content: "Anyone else having trouble with the new Logic update? My Kontakt plugins keep crashing mid-session.",
    timestamp: "Today at 2:35 PM",
    channelId: "ch-1",
  },
  {
    id: "msg-7",
    author: members[6],
    content: "808 pattern question -- do you guys prefer a straight sub or a distorted 808 for trap beats? I keep going back and forth.",
    timestamp: "Today at 2:40 PM",
    channelId: "ch-1",
  },
  {
    id: "msg-8",
    author: members[7],
    content: "Distorted for energy, clean sub for vibes. Depends on the track honestly. Layer both and automate between them.",
    timestamp: "Today at 2:42 PM",
    channelId: "ch-1",
  },
  {
    id: "msg-9",
    author: members[12],
    content: "Just finished a sample pack -- 50 one-shots, 20 loops, all original. Dropping it free for the community this Friday.",
    timestamp: "Today at 2:48 PM",
    channelId: "ch-1",
  },
  {
    id: "msg-10",
    author: members[0],
    content: "Real talk -- what's everyone's go-to reverb plugin? I've been using Valhalla Room but thinking of switching to FabFilter Pro-R 2.",
    timestamp: "Today at 2:52 PM",
    channelId: "ch-1",
  },
  {
    id: "msg-11",
    author: members[2],
    content: "Pro-R 2 is worth every penny. The EQ on the decay is a game changer for mixing vocals.",
    timestamp: "Today at 2:54 PM",
    channelId: "ch-1",
  },
  {
    id: "msg-12",
    author: members[1],
    content: "I recorded 3 vocal takes for that boom-bap track. Can someone give me feedback on which one sits best in the mix?",
    timestamp: "Today at 3:01 PM",
    channelId: "ch-1",
  },
  {
    id: "msg-13",
    author: members[3],
    content: "Reminder: A&R listening session starts in Studio A voice channel at 5 PM. Bring your best unreleased tracks.",
    timestamp: "Today at 3:10 PM",
    channelId: "ch-1",
  },
  {
    id: "msg-14",
    author: members[4],
    content: "Who else is going to NAMM this year? We should link up and do a live beat battle.",
    timestamp: "Today at 3:15 PM",
    channelId: "ch-1",
  },
  {
    id: "msg-15",
    author: members[6],
    content: "Just signed my first sync deal! Background music for an indie film. This community helped me level up fr. Thank you all.",
    timestamp: "Today at 3:22 PM",
    channelId: "ch-1",
  },
  {
    id: "msg-16",
    author: members[5],
    content: "Congrats!! That's huge. Sync is where the real money is at. What library did you go through?",
    timestamp: "Today at 3:24 PM",
    channelId: "ch-1",
  },
];
