// Central de notificações do profissional · demonstração visual, dados de exemplo
import { useBack } from "../../shared/hooks/useBack";
import { DemoBanner } from "../../shared/components/demo";
import { NotificationCenter } from "../../shared/components/notifications";
import { ScreenFrame } from "../../shared/components/ScreenFrame";
import { notificationsDemo } from "../../shared/data/demo";

export default function ProNotificationsScreen() {
  const back = useBack("proProfileMenu");
  return (
    <ScreenFrame onBack={back} title="Notificações" subtitle="Lembretes e avisos dos seus atendimentos.">
      <DemoBanner />
      <NotificationCenter items={notificationsDemo} />
    </ScreenFrame>
  );
}
