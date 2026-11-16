// Atalhos do topo da Home: conversas (com contador de não lidas) e notificações · API: nenhuma (usa ConversationsContext)
import { Bell, MessageCircle } from "lucide-react";
import { useConversations } from "../../context/ConversationsContext";
import { useSession } from "../../context/SessionContext";
import { colors, fontBody } from "../theme";

const buttonStyle = {
  position: "relative",
  width: 42,
  height: 42,
  borderRadius: "var(--radius-round)",
  border: `2px solid ${colors.border}`,
  background: colors.card,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  flexShrink: 0,
  padding: 0,
};

export function HeaderShortcuts({ conversationsScreen, notificationsScreen }) {
  const { setScreen } = useSession();
  const { totalUnread } = useConversations();
  return (
    <div style={{ display: "flex", gap: "var(--space-8)" }}>
      <button
        type="button"
        onClick={() => setScreen(conversationsScreen)}
        aria-label={totalUnread > 0 ? `Conversas, ${totalUnread} não lidas` : "Conversas"}
        style={buttonStyle}
      >
        <MessageCircle size={18} color={colors.foreground} />
        {totalUnread > 0 && (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              minWidth: 18,
              height: 18,
              padding: "0 4px",
              boxSizing: "border-box",
              borderRadius: "var(--radius-round)",
              background: colors.primary,
              color: "hsl(var(--white-hsl))",
              fontFamily: fontBody,
              fontSize: 11,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {totalUnread > 9 ? "9+" : totalUnread}
          </span>
        )}
      </button>
      <button
        type="button"
        onClick={() => setScreen(notificationsScreen)}
        aria-label="Notificações"
        style={buttonStyle}
      >
        <Bell size={18} color={colors.foreground} />
      </button>
    </div>
  );
}
