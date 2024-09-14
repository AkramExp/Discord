import ChatHeader from "@/components/chat/chat-header";
import { getOrCreateConversation } from "@/lib/conversations";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

interface MemberIdPageProps {
  params: {
    serverId: string;
    memberId: string;
  };
}

const MemberIdPage = async ({ params }: MemberIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) return auth().redirectToSignIn();

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!member) redirect("/");

  const conversation = await getOrCreateConversation(
    member.id,
    params.memberId
  );

  if (!conversation) redirect(`/servers/${params?.serverId}`);

  const { memberOne, memberTwo } = conversation;

  const otherMember =
    profile.id === memberOne.profileId ? memberTwo : memberOne;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        serverId={params.serverId}
        name={otherMember.profile.name}
        type="conversation"
        imageUrl={otherMember.profile.imageUrl}
      />
    </div>
  );
};

export default MemberIdPage;
