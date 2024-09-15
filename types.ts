import { Socket } from "net";
import { NextApiResponse } from "next";
import { Server as NetServer } from "http";
import { Server as SockerIOServer } from "socket.io";

export type NextApiServerResponseIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SockerIOServer;
    };
  };
};
