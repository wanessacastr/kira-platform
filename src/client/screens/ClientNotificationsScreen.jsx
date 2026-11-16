// Central de notificações do cliente · demonstração visual, dados de exemplo
import { useBack } from "../../shared/hooks/useBack";
import { DemoBanner } from "../../shared/components/demo";
import { NotificationCenter } from "../../shared/components/notifications";
import { ScreenFrame } from "../../shared/components/ScreenFrame";
import { notificationsDemo } from "../../shared/data/demo";

export default function ClientNotificationsScreen() {
  const back = useBack("clientProfile");
  return (
    <ScreenFrame onBack={back} title="Notificações" subtitle="Lembretes e avisos dos seus agendamentos.">
      <DemoBanner />
      <NotificationCenter items={notificationsDemo} />
    </ScreenFrame>
  );
}
