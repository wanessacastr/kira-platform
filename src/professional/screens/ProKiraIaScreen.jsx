// Kira IA Pro: o mesmo chat da Kira, no contexto da profissional autenticada · mock (conversa) + kira-backend (dados da conta)
import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../shared/api";
import { CHAT_STATUS } from "../../shared/api/chatContract";
import { proChatFor } from "../../shared/api/proChat";
import { ChatInput } from "../../shared/components/ChatInput";
import { chatMotionCss } from "../../shared/components/chatStyles";
import { DemoNotice, ErrorState } from "../../shared/components/states";
import { CHAT_CONTEXTS, chatContexts, contextForAccount } from "../../shared/chat/chatContexts";
import { colors } from "../../shared/theme";
import { useSession } from "../../context/SessionContext";
import { inputPlaceholder } from "../../client/chat/chatContent";
import { ChatHeader } from "../../client/components/chat/ChatHeader";
import { ChatSkeleton, ChatWelcome, ConnectionBanner } from "../../client/components/chat/ChatStates";
import { MessageList } from "../../client/components/chat/MessageList";
import { useChat } from "../../client/hooks/useChat";
import { useBusinessData, useBusinessHours } from "../hooks/useBusinessData";

const content = chatContexts[CHAT_CONTEXTS.PROFESSIONAL];
const noop = () => {};

export default function ProKiraIaScreen() {
  const { auth, accountType, setScreen } = useSession();
  // Só a conta profissional autenticada entra neste contexto; a conversa é separada por conta
  const allowed = contextForAccount(accountType) === CHAT_CONTEXTS.PROFESSIONAL;
  const gateway = useMemo(() => proChatFor(auth?.id), [auth?.id]);
  const chat = useChat(gateway);
  const business = useBusinessData();
  const hours = useBusinessHours();
  const portfolio = useQuery({
    queryKey: ["portfolio", "business", auth?.id],
    queryFn: () => api.portfolio.list(auth.id),
    enabled: allowed && auth?.id != null,
  });

  const ready = !business.loading && !business.error;
  useEffect(() => {
    gateway.setBusiness(
      ready
        ? {
            appointments: business.appointments,
            reviews: business.reviews,
            services: business.services,
            hours: hours.data ?? null,
            portfolioCount: portfolio.data ? portfolio.data.length : null,
          }
        : null,
    );
  }, [gateway, ready, business.appointments, business.reviews, business.services, hours.data, portfolio.data]);

  if (!allowed) return null;
  const { status, messages, agent, handoff, typing, online } = chat;
  const showWelcome = status === CHAT_STATUS.READY && messages.length === 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, background: colors.background }}>
      <style>{chatMotionCss}</style>
      <ChatHeader
        agent={agent}
        handoff={handoff}
        typing={typing}
        online={online}
        content={content}
        onBack={() => setScreen("proHome")}
      />
      <DemoNotice>{content.notice}</DemoNotice>
      {!online && <ConnectionBanner />}
      {status === CHAT_STATUS.LOADING && <ChatSkeleton />}
      {status === CHAT_STATUS.ERROR && (
        <ErrorState message="Não foi possível abrir a Kira agora." onRetry={chat.reload} />
      )}
      {showWelcome && <ChatWelcome onPick={chat.send} content={content} />}
      {status === CHAT_STATUS.READY && !showWelcome && (
        <MessageList
          messages={messages}
          typing={typing}
          agent={agent}
          handoff={handoff}
          onRetry={chat.retry}
          onSend={chat.send}
          onOpenProfessional={noop}
          onCancelHandoff={noop}
        />
      )}
      {status === CHAT_STATUS.READY && (
        <div
          style={{
            padding: "var(--space-8) var(--space-12) calc(var(--space-12) + env(safe-area-inset-bottom))",
            borderTop: `1px solid ${colors.border}`,
          }}
        >
          <ChatInput onSend={chat.send} placeholder={inputPlaceholder(false)} />
        </div>
      )}
    </div>
  );
}
