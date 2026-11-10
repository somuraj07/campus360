

export type Status = "pending" | "approved" | "rejected" | "ended";

export type Chat = {
  id: string;
  parent: string;
  student: string;
  lastMessage: string;
  status: Status;
  avatar: string;
};

type Props = {
  chats: Chat[];
  onSelect: (chat: Chat) => void;
};

export default function ChatList({ chats, onSelect }: Props) {
  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-2">
      {chats.map(chat => (
        <button
          key={chat.id}
          onClick={() => onSelect(chat)}
          className="w-full p-3 rounded-xl flex gap-3 bg-elev-1 hover:bg-elev-3 transition text-left"
        >
          <img
            src={chat.avatar}
            className="w-12 h-12 rounded-full object-cover"
            alt={chat.parent}
          />

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate text-fg">
              {chat.parent}
            </p>
            <p className="text-xs text-primary truncate">
              Parent of {chat.student}
            </p>
            <p className="text-xs text-fg-muted truncate">
              {chat.lastMessage}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
