// Conversas do estúdio com as clientes, uma por agendamento · API: kira-backend (api.messages)
import { useScheduling } from "../../context/SchedulingContext";
import { useSession } from "../../context/SessionContext";
import { useBack } from "../../shared/hooks/useBack";
import { RealConversationList } from "../../shared/components/RealConversationList";
import { ScreenFrame } from "../../shared/components/ScreenFrame";

export default function ProConversationsScreen() {
  const { setScreen } = useSession();
  const back = useBack("proProfileMenu");
  const { setSelectedAppointmentId } = useScheduling();
  return (
    <ScreenFrame onBack={back} title="Conversas" subtitle="Suas conversas com clientes.">
      <RealConversationList
        onOpen={(id) => {
          setSelectedAppointmentId(id);
          setScreen("proConversation");
        }}
      />
    </ScreenFrame>
  );
}
