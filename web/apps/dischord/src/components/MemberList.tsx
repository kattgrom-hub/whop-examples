"use client";

import { members, ROLE_COLORS, type Role, type Member } from "@/data/mock";

export default function MemberList() {
  const onlineMembers = members.filter((m) => m.online);
  const offlineMembers = members.filter((m) => !m.online);

  // Group by role
  const groupByRole = (memberList: Member[]): Record<Role, Member[]> => {
    const groups: Record<Role, Member[]> = {
      Producer: [],
      Vocalist: [],
      Engineer: [],
      "A&R": [],
    };
    memberList.forEach((m) => {
      groups[m.role].push(m);
    });
    return groups;
  };

  const onlineByRole = groupByRole(onlineMembers);
  const roles: Role[] = ["Producer", "Vocalist", "Engineer", "A&R"];

  return (
    <div className="flex w-60 flex-col bg-[#12122a] overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div className="px-4 pt-6">
        {/* Online members by role */}
        {roles.map((role) => {
          const group = onlineByRole[role];
          if (group.length === 0) return null;
          return (
            <div key={role} className="mb-4">
              <h4
                className="mb-1 px-1 text-[11px] font-semibold uppercase tracking-wide"
                style={{ color: ROLE_COLORS[role] }}
              >
                {role} &mdash; {group.length}
              </h4>
              {group.map((member) => (
                <MemberItem key={member.id} member={member} />
              ))}
            </div>
          );
        })}

        {/* Offline */}
        {offlineMembers.length > 0 && (
          <div className="mb-4">
            <h4 className="mb-1 px-1 text-[11px] font-semibold uppercase tracking-wide text-gray-600">
              Offline &mdash; {offlineMembers.length}
            </h4>
            {offlineMembers.map((member) => (
              <MemberItem key={member.id} member={member} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MemberItem({ member }: { member: Member }) {
  return (
    <button
      className={`group mb-0.5 flex w-full items-center gap-3 rounded-md px-2 py-1.5 transition-colors duration-200 hover:bg-[#1E1B4B]/40 ${
        !member.online ? "opacity-40" : ""
      }`}
    >
      {/* Avatar with status */}
      <div className="relative">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold"
          style={{
            backgroundColor: ROLE_COLORS[member.role] + "22",
            color: ROLE_COLORS[member.role],
          }}
        >
          {member.avatar}
        </div>
        <div
          className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#12122a] ${
            member.online ? "bg-[#22C55E]" : "bg-gray-600"
          }`}
        />
      </div>

      {/* Name and activity */}
      <div className="min-w-0 flex-1 text-left">
        <p
          className="truncate text-sm font-medium"
          style={{ color: member.online ? ROLE_COLORS[member.role] : "#6b7280" }}
        >
          {member.name}
        </p>
        {member.activity && member.online && (
          <p className="truncate text-[11px] text-gray-500">
            {member.activity}
          </p>
        )}
      </div>
    </button>
  );
}
