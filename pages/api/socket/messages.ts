import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiServerResponseIo } from "@/types";
import { NextApiRequest } from "next";

export async function handler(
  req: NextApiRequest,
  res: NextApiServerResponseIo
) {
  try {
    const { content, fileUrl } = req.body;
    const { channelId, serverId } = req.query;

    const profile = await currentProfilePages(req);

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!channelId) {
      return res.status(400).json({ error: "Channel ID missing" });
    }

    if (!serverId) {
      return res.status(400).json({ error: "Server ID missing" });
    }

    if (!content) {
      return res.status(400).json({ error: "Content missing" });
    }

    const server = await db.server.findUnique({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: { members: true },
    });

    if (!server) return res.status(400).json({ error: "Server not found" });

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) return res.status(400).json({ error: "Channel not found" });

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member) return res.status(400).json({ error: "Member not found" });

    const message = db.message.create({
      data: {
        fileUrl,
        content,
        channelId: channelId as string,
        memberId: member.id as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${channelId}:messages`;

    res?.socket?.server?.io.emit(channelKey, message);
  } catch (error) {
    return res.status(500).json({ error: "Internal Error" });
  }
}
