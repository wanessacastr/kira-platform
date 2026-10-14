// Edição do perfil · validação local · foto via FileReader
import { Check, CheckCircle2, ChevronRight, ImagePlus, Loader2, MapPin, User, X } from "lucide-react";
import { useKira } from "../../context/KiraContext";
import { Field, Header, PrimaryButton, SecondaryButton, inputStyle } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";
import { formatPhone } from "../../shared/utils/format";

// === PERFIL: EditProfileScreen ===
// Formulário de edição, reaproveitando cForm/cErrors direto (mesma fonte
// de verdade usada no resto do app) em vez de duplicar estado.
export default function ClientProfileEditScreen() {
  const { cErrors, cFileInputRef, cForm, handlePhoto, profileSaveStatus, saveProfileEdit, setCField, setScreen } =
    useKira();
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("clientProfile")} />
      <div style={{ flex: 1, padding: "0 var(--space-24) var(--space-32)", overflowY: "auto" }}>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: 22,
            color: colors.foreground,
            margin: "var(--space-4) 0 var(--space-4)",
          }}
        >
          Editar perfil
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: 12,
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          Atualize seus dados pessoais.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--space-10)",
            marginBottom: "var(--space-18)",
          }}
        >
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: "50%",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `2px solid ${colors.primary}`,
                background: colors.muted,
              }}
            >
              {cForm.photo ? (
                <img
                  src={cForm.photo}
                  alt="Foto de perfil"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <User size={30} color={colors.mutedForeground} />
              )}
            </div>
            <button
              onClick={() => cFileInputRef.current?.click()}
              aria-label="Trocar foto"
              style={{
                position: "absolute",
                bottom: -4,
                right: -4,
                width: 34,
                height: 34,
                borderRadius: "50%",
                border: "none",
                background: gradientKira,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <ImagePlus size={15} color={colors.primaryForeground} />
            </button>
          </div>
          <input
            ref={cFileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handlePhoto(e.target.files?.[0], (v) => setCField("photo", v))}
          />
        </div>

        <Field label="Nome completo" error={cErrors.name}>
          <input
            value={cForm.name}
            onChange={(e) => setCField("name", e.target.value)}
            placeholder="Ex.: Maria Almeida"
            style={inputStyle(cErrors.name)}
          />
        </Field>
        <Field label="E-mail" error={cErrors.email}>
          <input
            type="email"
            value={cForm.email}
            onChange={(e) => setCField("email", e.target.value)}
            placeholder="seu@email.com"
            style={inputStyle(cErrors.email)}
          />
        </Field>
        <Field label="Telefone" error={cErrors.phone}>
          <input
            value={cForm.phone}
            onChange={(e) => setCField("phone", formatPhone(e.target.value))}
            placeholder="(00) 00000-0000"
            style={inputStyle(cErrors.phone)}
          />
        </Field>

        <button
          onClick={() => setScreen("clientAddress")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-8)",
            width: "100%",
            padding: "var(--space-12) var(--space-14)",
            borderRadius: "var(--radius-lg)",
            border: `1px solid ${colors.border}`,
            background: colors.muted,
            marginBottom: "var(--space-18)",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <MapPin size={15} color={colors.mutedForeground} />
          <span style={{ flex: 1, fontFamily: fontBody, fontSize: 12, color: colors.foreground }}>
            {cForm.street ? `${cForm.street}, ${cForm.city}` : "Adicionar endereço"}
          </span>
          <ChevronRight size={15} color={colors.mutedForeground} />
        </button>

        {profileSaveStatus === "success" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-6)",
              padding: "var(--space-10) var(--space-14)",
              borderRadius: "var(--radius-lg)",
              background: "hsl(var(--primary-hsl) / 0.08)",
              marginBottom: "var(--space-12)",
            }}
          >
            <CheckCircle2 size={15} color={colors.primary} />
            <span style={{ fontFamily: fontBody, fontSize: 12, color: colors.primary, fontWeight: 600 }}>
              Perfil atualizado!
            </span>
          </div>
        )}

        <div style={{ display: "flex", gap: "var(--space-10)" }}>
          <div style={{ flex: 1 }}>
            <SecondaryButton onClick={() => setScreen("clientProfile")}>
              <X size={15} /> Cancelar
            </SecondaryButton>
          </div>
          <div style={{ flex: 1 }}>
            <PrimaryButton onClick={saveProfileEdit} disabled={profileSaveStatus === "saving"}>
              {profileSaveStatus === "saving" ? <Loader2 size={15} className="spin" /> : <Check size={15} />}{" "}
              {profileSaveStatus === "saving" ? "Salvando..." : "Salvar"}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
