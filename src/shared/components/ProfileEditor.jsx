// Edição do perfil da conta logada (cliente ou estúdio) · api.profile: nome, telefone, foto e, no estúdio, descrição.
// E-mail e documentos aparecem só para leitura: o backend não os troca por aqui.
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Check, CheckCircle2, ImagePlus, Trash2, User, X } from "lucide-react";
import { useSession } from "../../context/SessionContext";
import { api } from "../api";
import { useMyProfile } from "../hooks/useMyProfile";
import { profileEditSchema } from "../schemas/forms";
import { colors, fontBody, fontDisplay, gradientKira } from "../theme";
import { formatPhone } from "../utils/format";
import { ErrorState, SkeletonLoading } from "./states";
import { Field, Header, PrimaryButton, SecondaryButton, inputStyle } from "./ui";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

function EditorForm({ profile, backScreen, withDescription }) {
  const { setScreen } = useSession();
  const queryClient = useQueryClient();
  const fileInput = useRef(null);
  const [photoError, setPhotoError] = useState("");
  const [saved, setSaved] = useState(false);
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: profile.name,
      phone: formatPhone(profile.phone ?? ""),
      description: profile.description ?? "",
    },
    resolver: zodResolver(profileEditSchema.pick({ name: true, phone: true })),
  });
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["profile"] });
  const upload = useMutation({ mutationFn: api.profile.setPhoto, onSuccess: refresh });
  const removePhoto = useMutation({ mutationFn: api.profile.removePhoto, onSuccess: refresh });
  const save = useMutation({
    mutationFn: (values) =>
      api.profile.saveMine({
        name: values.name,
        phone: values.phone,
        ...(withDescription && { description: values.description }),
      }),
    onSuccess: () => {
      refresh();
      setSaved(true);
      setTimeout(() => setScreen(backScreen), 700);
    },
  });
  const pickPhoto = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return setPhotoError("Escolha um arquivo de imagem.");
    if (file.size > MAX_PHOTO_BYTES) return setPhotoError("A foto deve ter até 5 MB.");
    setPhotoError("");
    upload.mutate(file);
  };
  const photoBusy = upload.isPending || removePhoto.isPending;
  const failure = save.error ?? upload.error ?? removePhoto.error;
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen(backScreen)} />
      <div style={{ flex: 1, padding: "0 var(--space-24) var(--space-32)", overflowY: "auto" }}>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: "var(--font-size-2xl)",
            color: colors.foreground,
            margin: "var(--space-4) 0 var(--space-4)",
          }}
        >
          Editar perfil
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: "var(--font-size-xs)",
            color: colors.mutedForeground,
            margin: "0 0 var(--space-18)",
          }}
        >
          Atualize seus dados. O e-mail não pode ser alterado por aqui.
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
                borderRadius: "var(--radius-round)",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `2px solid ${colors.primary}`,
                background: colors.muted,
                opacity: photoBusy ? 0.5 : 1,
              }}
            >
              {profile.photo ? (
                <img
                  src={profile.photo}
                  alt="Foto de perfil"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <User size={30} color={colors.mutedForeground} />
              )}
            </div>
            <button
              type="button"
              disabled={photoBusy}
              onClick={() => fileInput.current?.click()}
              aria-label="Trocar foto"
              style={{
                position: "absolute",
                bottom: -4,
                right: -4,
                width: 34,
                height: 34,
                borderRadius: "var(--radius-round)",
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
          <input ref={fileInput} type="file" accept="image/*" style={{ display: "none" }} onChange={pickPhoto} />
          {profile.photo && (
            <button
              type="button"
              disabled={photoBusy}
              onClick={() => removePhoto.mutate()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-4)",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontFamily: fontBody,
                fontSize: "var(--font-size-xs)",
                color: colors.destructiveText,
              }}
            >
              <Trash2 size={13} /> Remover foto
            </button>
          )}
          {photoError && (
            <p
              role="alert"
              style={{
                margin: 0,
                fontFamily: fontBody,
                fontSize: "var(--font-size-xs)",
                color: colors.destructiveText,
              }}
            >
              {photoError}
            </p>
          )}
        </div>

        <Field label="Nome completo" error={errors.name?.message}>
          <input {...register("name")} autoComplete="name" style={inputStyle(errors.name?.message)} />
        </Field>
        <Field label="E-mail">
          <input value={profile.email ?? ""} readOnly aria-readonly="true" style={{ ...inputStyle(), opacity: 0.7 }} />
        </Field>
        <Field label="Telefone" error={errors.phone?.message}>
          <input
            {...register("phone", { onChange: (e) => setValue("phone", formatPhone(e.target.value)) })}
            inputMode="tel"
            autoComplete="tel"
            placeholder="(00) 00000-0000"
            style={inputStyle(errors.phone?.message)}
          />
        </Field>
        {withDescription && (
          <Field label="Sobre o estúdio">
            <textarea
              {...register("description")}
              rows={4}
              maxLength={500}
              placeholder="Conte um pouco sobre o seu trabalho"
              style={{ ...inputStyle(), resize: "vertical" }}
            />
            <span style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.mutedForeground }}>
              {(watch("description") ?? "").length}/500
            </span>
          </Field>
        )}

        {failure && (
          <p
            role="alert"
            style={{ fontFamily: fontBody, fontSize: "var(--font-size-xs)", color: colors.destructiveText }}
          >
            {failure.message || "Não foi possível salvar agora. Tente de novo."}
          </p>
        )}
        {saved && (
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
            <span
              style={{
                fontFamily: fontBody,
                fontSize: "var(--font-size-xs)",
                color: colors.primaryText,
                fontWeight: 600,
              }}
            >
              Perfil atualizado!
            </span>
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "var(--space-10)",
            position: "sticky",
            bottom: "calc(-1 * var(--space-32))",
            zIndex: 1,
            padding: "var(--space-16) 0 var(--space-12)",
            background: `linear-gradient(to top, ${colors.background} 75%, transparent)`,
          }}
        >
          <div style={{ flex: 1 }}>
            <SecondaryButton onClick={() => setScreen(backScreen)}>
              <X size={15} /> Cancelar
            </SecondaryButton>
          </div>
          <div style={{ flex: 1 }}>
            <PrimaryButton
              onClick={handleSubmit((v) => save.mutate(v))}
              disabled={save.isPending || saved || photoBusy}
            >
              <Check size={15} /> {save.isPending ? "Salvando..." : "Salvar"}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileEditor({ backScreen, withDescription = false }) {
  const { setScreen } = useSession();
  const query = useMyProfile();
  if (!query.data) {
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
        <Header onBack={() => setScreen(backScreen)} />
        <div style={{ padding: "0 var(--space-24)" }}>
          {query.isError ? (
            <ErrorState onRetry={query.refetch} message="Não foi possível carregar seu perfil." />
          ) : (
            <SkeletonLoading count={3} />
          )}
        </div>
      </div>
    );
  }
  return <EditorForm profile={query.data} backScreen={backScreen} withDescription={withDescription} />;
}
