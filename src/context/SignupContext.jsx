// Cadastro: formulários do cliente e do profissional, erros, validação e preferências · APIs do navegador: FileReader · sem backend
import { createContext, useCallback, useContext, useState } from "react";
import { initialClientForm, initialProForm } from "../shared/data/forms";
import { addressSchema, clientPersonalSchema, proPersonalSchema, termsSchema, validate } from "../shared/schemas/forms";

const SignupContext = createContext(null);

const without = (obj, key) => {
  const next = { ...obj };
  delete next[key];
  return next;
};

export function SignupProvider({ children }) {
  const [cForm, setCForm] = useState(initialClientForm);
  const [cErrors, setCErrors] = useState({});
  const [pForm, setPForm] = useState(initialProForm);
  const [pErrors, setPErrors] = useState({});
  const [cPreferences, setCPreferences] = useState([]);

  const toggleCPreference = (id) => {
    setCPreferences((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  const setCField = (key, value) => {
    setCForm((f) => ({ ...f, [key]: value }));
    if (cErrors[key]) setCErrors((e) => without(e, key));
  };
  const setPField = (key, value) => {
    setPForm((f) => ({ ...f, [key]: value }));
    if (pErrors[key]) setPErrors((e) => without(e, key));
  };

  const handlePhoto = (file, setter) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setter(String(reader.result));
    reader.readAsDataURL(file);
  };
  const handleWorkPhotos = (files) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => setPForm((f) => ({ ...f, workPhotos: [...f.workPhotos, String(reader.result)] }));
      reader.readAsDataURL(file);
    });
  };

  const runValidation = (schema, data, setErrors) => {
    const { ok, errors } = validate(schema, data);
    setErrors(errors);
    return ok;
  };
  const validateClientPersonal = () => runValidation(clientPersonalSchema, cForm, setCErrors);
  const validateProPersonal = () => runValidation(proPersonalSchema, pForm, setPErrors);
  const validateAddress = (form, setErrors) => runValidation(addressSchema, form, setErrors);
  const validateTerms = (form, setErrors) => runValidation(termsSchema, form, setErrors);

  // Especialidades, serviços e fotos de trabalho do profissional
  const addSpecialty = (value) => {
    const trimmed = value.trim();
    if (!trimmed || pForm.specialties.some((s) => s.toLowerCase() === trimmed.toLowerCase())) return;
    setPForm((f) => ({ ...f, specialties: [...f.specialties, trimmed] }));
    setPErrors((e) => without(e, "specialties"));
  };
  const removeSpecialty = (value) => setPForm((f) => ({ ...f, specialties: f.specialties.filter((s) => s !== value) }));
  // Devolve true quando adicionou (a tela então limpa o rascunho)
  const addService = (draft) => {
    if (!draft.name.trim() || !draft.price.trim() || !draft.duration.trim()) return false;
    setPForm((f) => ({ ...f, services: [...f.services, { id: `${Date.now()}`, ...draft }] }));
    setPErrors((e) => without(e, "services"));
    return true;
  };
  const removeService = (id) => setPForm((f) => ({ ...f, services: f.services.filter((s) => s.id !== id) }));
  const removeWorkPhoto = (idx) => setPForm((f) => ({ ...f, workPhotos: f.workPhotos.filter((_, i) => i !== idx) }));

  // Reinicia o cadastro (botão "reiniciar protótipo")
  const reset = useCallback(() => {
    setCForm(initialClientForm);
    setCErrors({});
    setPForm(initialProForm);
    setPErrors({});
    setCPreferences([]);
  }, []);

  const value = {
    cForm,
    setCForm,
    cErrors,
    setCErrors,
    setCField,
    pForm,
    setPForm,
    pErrors,
    setPErrors,
    setPField,
    cPreferences,
    setCPreferences,
    toggleCPreference,
    handlePhoto,
    handleWorkPhotos,
    validateClientPersonal,
    validateProPersonal,
    validateAddress,
    validateTerms,
    addSpecialty,
    removeSpecialty,
    addService,
    removeService,
    removeWorkPhoto,
    reset,
  };
  return <SignupContext.Provider value={value}>{children}</SignupContext.Provider>;
}

export const useSignup = () => {
  const ctx = useContext(SignupContext);
  if (!ctx) throw new Error("useSignup precisa estar dentro de <SignupProvider>");
  return ctx;
};
