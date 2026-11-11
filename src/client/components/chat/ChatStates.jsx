// Estados do chat: boas-vindas (vazio), carregando (esqueleto) e aviso de sem conexão · API: nenhuma
import { WifiOff } from "lucide-react";
import { CHAT_AGENTS } from "../../../shared/api/chatContract";
import { Heading, Text } from "../../../shared/components/primitives";
import { colors } from "../../../shared/theme";
import { CHAT_CONTEXTS, chatContexts } from "../../../shared/chat/chatContexts";
import { AgentAvatar } from "./AgentAvatar";
import { QuickReplies } from "./QuickReplies";

export const ChatWelcome = ({ onPick, content = chatContexts[CHAT_CONTEXTS.CLIENT] }) => (
  <div style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column" }}>
    {/* margin auto centraliza sem cortar o topo quando a tela é baixa (justify-content: center cortava) */}
    <div
      style={{
        margin: "auto 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--space-14)",
        padding: "var(--space-24) var(--space-24) var(--space-16)",
        textAlign: "center",
      }}
    >
      <AgentAvatar agent={CHAT_AGENTS.AI} size={80} />
      <Heading as="h2" size="3xl" style={{ lineHeight: 1.15 }}>
        {content.title}
      </Heading>
      {content.lines.map((line) => (
        <Text key={line} size="base" color={colors.mutedForeground} style={{ maxWidth: 290, lineHeight: 1.5 }}>
          {line}
        </Text>
      ))}
      {content.tagline && (
        <Text
          size="xs"
          weight={600}
          color={colors.primaryText}
          style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}
        >
          {content.tagline}
        </Text>
      )}
      {content.prompt && (
        <Text size="sm" weight={600} style={{ marginTop: "var(--space-8)" }}>
          {content.prompt}
        </Text>
      )}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <QuickReplies options={content.shortcuts} onPick={onPick} indent={false} />
      </div>
    </div>
  </div>
);

const SkeletonBubble = ({ width, align, lines }) => (
  <div
    className="k-chat-pulse"
    style={{
      alignSelf: align,
      width,
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-8)",
      padding: "var(--space-14) var(--space-16)",
      borderRadius: "var(--radius-4xl)",
      background: colors.muted,
      boxSizing: "border-box",
    }}
  >
    {lines.map((line) => (
      <div
        key={line}
        style={{ height: 10, width: line, borderRadius: "var(--radius-xs)", background: colors.border }}
      />
    ))}
  </div>
);

export const ChatSkeleton = () => (
  <div
    role="status"
    aria-label="Carregando mensagens"
    style={{
      flex: 1,
      minHeight: 0,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      gap: "var(--space-14)",
      padding: "var(--space-16)",
    }}
  >
    <SkeletonBubble width="72%" align="flex-start" lines={["90%", "60%"]} />
    <SkeletonBubble width="56%" align="flex-end" lines={["100%", "45%"]} />
    <SkeletonBubble width="72%" align="flex-start" lines={["80%", "95%", "50%"]} />
  </div>
);

export const ConnectionBanner = () => (
  <Text
    as="div"
    size="sm"
    role="status"
    style={{
      display: "flex",
      alignItems: "center",
      gap: "var(--space-10)",
      padding: "var(--space-12) var(--space-16)",
      background: "hsl(var(--accent-hsl) / 0.14)",
      borderBottom: `1px solid ${colors.border}`,
      lineHeight: 1.35,
    }}
  >
    <WifiOff size={18} aria-hidden="true" style={{ flexShrink: 0 }} />
    Você está sem conexão. Suas mensagens serão enviadas assim que a internet voltar.
  </Text>
);
