"use client";

import Messages from "./messages";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Channel, Chat } from "stream-chat-react";
import { DevToken, StreamChat } from "stream-chat";
import { Textarea } from "@/components/ui/textarea";
import { generateUsername } from "unique-username-generator";

export default function () {
  const [channel, setChannel] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const watchChannel = () => {
    const channel = chatClient.channel("messaging", "livestreaming_chat", {
      name: "Live Streaming Chat",
    });
    channel.watch().then(() => setChannel(channel));
  };
  const loadChatClient = async () => {
    const newChatClient = new StreamChat(
      process.env.NEXT_PUBLIC_STREAM_API_KEY,
      {
        enableWSFallback: true,
      }
    );
    if (newChatClient.user) await newChatClient.disconnectUser();
    const localUser = localStorage.getItem("local_user");
    if (!localUser) localStorage.setItem("local_user", generateUsername());
    const id = localStorage.getItem("local_user");
    const userToConnect = { id };
    await newChatClient.connectUser(userToConnect, DevToken(userToConnect.id));
    setChatClient(newChatClient);
  };
  useEffect(() => {
    loadChatClient();
  }, []);
  useEffect(() => {
    if (chatClient) watchChannel();
  }, [chatClient]);
  return (
    <div className="flex max-w-[300px] flex-col gap-y-3 p-5">
      <div className="flex w-[300px] flex-col gap-y-3">
        <span className="border-b border-gray-100 font-semibold">Chat</span>
        {channel && (
          <Chat client={chatClient}>
            <Channel channel={channel}>
              <Messages />
            </Channel>
          </Chat>
        )}
        <Textarea
          id="message_text"
          name="message_text"
          placeholder="Message..."
          className="min-h-[100px] w-full"
        />
        <Button
          className="max-w-max"
          onClick={() => {
            if (channel) {
              channel.sendMessage({
                text: document.getElementById("message_text").value,
              });
              document.getElementById("message_text").value = "";
            }
          }}
        >
          Send Message &rarr;
        </Button>
      </div>
    </div>
  );
}
