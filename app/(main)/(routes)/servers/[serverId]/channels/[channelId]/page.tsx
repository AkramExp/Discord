import ChatHeader from "@/components/chat/chat-header";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const profile = await currentProfile();
  if (!profile) return auth().redirectToSignIn();

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  const member = db.member.findFirst({
    where: {
      profileId: profile.id,
      serverId: params.serverId,
    },
  });

  if (!channel || !member) redirect("/");

  return (
    <div className="bg-white dark:bg-[#313338]">
      <ChatHeader
        serverId={channel.serverId}
        name={channel.name}
        type="channel"
      />
    </div>
  );
};

export default ChannelIdPage;
