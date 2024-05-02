import { cn } from "@/lib/utils";
import { useChannelStateContext } from "stream-chat-react";
import { Message, MessageList } from "@chatscope/chat-ui-kit-react";

export default function () {
  const { messages } = useChannelStateContext();
  return (
    <MessageList>
      {messages?.map((i, index: number) => (
        <Message
          key={i.id}
          model={{
            position: "normal",
            sender: i.user?.id,
            direction: "incoming",
            message: `${i.user?.id}: ${i.text}`,
            sentTime: i.created_at?.toString(),
          }}
          className={cn(
            "bg-white rounded text-black py-2 text-xs",
            index !== messages.length - 1 && "border-b"
          )}
        />
      ))}
    </MessageList>
  );
}
