import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiServerResponseIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiServerResponseIo
) {
  try {
    const { content, fileUrl } = req.body;
    const { conversationId } = req.query;

    const profile = await currentProfilePages(req);

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!conversationId) {
      return res.status(400).json({ error: "Conversation ID missing" });
    }

    if (!content) {
      return res.status(400).json({ error: "Content missing" });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          { memberOne: { profileId: profile.id } },
          { memberTwo: { profileId: profile.id } },
        ],
      },
      include: {
        memberOne: { include: { profile: true } },
        memberTwo: { include: { profile: true } },
      },
    });

    if (!conversation)
      return res.status(404).json({ error: "Conversation not found" });

    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) return res.status(400).json({ error: "Member not found" });

    const message = await db.directMessage.create({
      data: {
        fileUrl,
        content,
        conversationId: conversationId as string,
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

    const conversationKey = `chat:${conversationId}:messages`;

    res?.socket?.server?.io.emit(conversationKey, message);

    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({ error: "Internal Error" });
  }
}
