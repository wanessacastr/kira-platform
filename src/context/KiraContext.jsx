// Estado e ações globais (useKira); a tela atual vem da URL (React Router) · APIs do navegador: geolocation, câmera (getUserMedia), FileReader · demais fluxos simulados com setTimeout, sem backend
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { bottomNavItems, defaultSearchFilters } from "../client/data/mocks";
import { recommendProfessionals } from "../client/recommendation";
import {
  initialLoyaltySettings,
  proAgendaMock,
  proBottomNavItems,
  proMonthlyRevenue,
  proWeeklyRevenue,
} from "../professional/data/mocks";
import { keyFor, pathFor } from "../routes";
import { initialClientForm, initialProForm } from "../shared/data/forms";
import { mockProfessionals } from "../shared/data/professionals";
import { startOfDay, startOfMonth } from "../shared/utils/date";
import { isValidCnpj, isValidCpf, onlyDigits } from "../shared/utils/format";

const KiraContext = createContext(null);

// Estado global do protótipo. Mesma lógica do componente único original,
// agora exposta via contexto para as telas por feature.
export function KiraProvider({ children }) {
  // A tela atual vem da URL; setScreen(chave) navega para a rota da tela (botão voltar do navegador funciona).
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const screen = keyFor(pathname) ?? "splash";
  const setScreen = useCallback((key) => navigate(pathFor(key)), [navigate]);
  const [accountType, setAccountType] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [cForm, setCForm] = useState(initialClientForm);
  const [cErrors, setCErrors] = useState({});
  const [cShowPassword, setCShowPassword] = useState(false);
  const [cShowConfirm, setCShowConfirm] = useState(false);
  const [cCepLoading, setCCepLoading] = useState(false);
  const [cLocationStatus, setCLocationStatus] = useState("idle");
  const cFileInputRef = useRef(null);
  const cDocFrontRef = useRef(null);
  const cDocBackRef = useRef(null);
  const [cSelfieStatus, setCSelfieStatus] = useState("idle"); // idle | streaming | error | captured
  const [cSelfieError, setCSelfieError] = useState("");
  const cSelfieVideoRef = useRef(null);
  const cSelfieCanvasRef = useRef(null);
  const cSelfieStreamRef = useRef(null);
  const [cPreferences, setCPreferences] = useState([]);
  const toggleCPreference = (id) => {
    setCPreferences((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };
  // ---------- Busca de profissionais ----------
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("todos");
  const [appliedFilters, setAppliedFilters] = useState(defaultSearchFilters);
  const [draftFilters, setDraftFilters] = useState(defaultSearchFilters);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterModalMounted, setFilterModalMounted] = useState(false);
  const [searchLoading, setSearchLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProId, setSelectedProId] = useState(null);
  const [homeMapSelectedId, setHomeMapSelectedId] = useState(null);
  const [bookedSlot, setBookedSlot] = useState(null);
  const [viewMonth, setViewMonth] = useState(startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(null);
  const [scheduleTime, setScheduleTime] = useState(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState(false);
  const [monthAnimKey, setMonthAnimKey] = useState(0);
  const retriedDatesRef = useRef(new Set());
  const today = startOfDay(new Date());
  const loadSchedule = (date) => {
    setScheduleLoading(true);
    setScheduleError(false);
    setScheduleTime(null);
    setTimeout(() => {
      const key = date.toDateString();
      const simulateError = date.getDate() % 13 === 0 && !retriedDatesRef.current.has(key);
      setScheduleLoading(false);
      setScheduleError(simulateError);
    }, 500);
  };
  const selectScheduleDate = (date) => {
    setSelectedDate(date);
    loadSchedule(date);
  };
  const retrySchedule = () => {
    if (!selectedDate) return;
    retriedDatesRef.current.add(selectedDate.toDateString());
    loadSchedule(selectedDate);
  };
  const changeMonth = (delta) => {
    setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
    setMonthAnimKey((k) => k + 1);
  };
  const searchListRef = useRef(null);
  const pullStartY = useRef(null);
  const [pullDistance, setPullDistance] = useState(0);
  const filteredProfessionals = mockProfessionals
    .filter((p) => {
      if (categoryFilter !== "todos" && p.category !== categoryFilter) return false;
      const q = searchQuery.trim().toLowerCase();
      if (q && q !== "erro") {
        const haystack = `${p.name} ${p.role} ${p.category} ${p.services.join(" ")}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (p.price > appliedFilters.price) return false;
      if (appliedFilters.minRating > 0 && p.rating < appliedFilters.minRating) return false;
      if (p.distance > appliedFilters.maxDistance) return false;
      if (appliedFilters.mode !== "ambos" && p.mode !== "ambos" && p.mode !== appliedFilters.mode) return false;
      return true;
    })
    .sort((a, b) => {
      if (appliedFilters.sort === "avaliado") return b.rating - a.rating;
      if (appliedFilters.sort === "preco") return a.price - b.price;
      if (appliedFilters.sort === "recomendado") return b.reviews - a.reviews;
      return a.distance - b.distance;
    });
  const searchHasError = searchQuery.trim().toLowerCase() === "erro";
  const openFilterModal = () => {
    setDraftFilters(appliedFilters);
    setFilterModalOpen(true);
    setTimeout(() => setFilterModalMounted(true), 10);
  };
  const closeFilterModal = () => {
    setFilterModalMounted(false);
    setTimeout(() => setFilterModalOpen(false), 200);
  };
  const applyFilters = () => {
    setAppliedFilters(draftFilters);
    closeFilterModal();
  };
  const clearFilters = () => {
    setDraftFilters(defaultSearchFilters);
    setAppliedFilters(defaultSearchFilters);
    setCategoryFilter("todos");
    closeFilterModal();
  };
  const runSearchLoad = () => {
    setSearchLoading(true);
    setVisibleCount(8);
    setTimeout(() => setSearchLoading(false), 650);
  };
  useEffect(() => {
    if (screen === "clientSearch") runSearchLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);
  useEffect(() => {
    setVisibleCount(8);
  }, [searchQuery, categoryFilter, appliedFilters]);
  const handleSearchScroll = (e) => {
    const el = e.target;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 80) {
      setVisibleCount((v) => Math.min(v + 8, filteredProfessionals.length));
    }
  };
  const handlePullStart = (e) => {
    if (searchListRef.current && searchListRef.current.scrollTop === 0) {
      pullStartY.current = e.touches[0].clientY;
    }
  };
  const handlePullMove = (e) => {
    if (pullStartY.current === null) return;
    const diff = e.touches[0].clientY - pullStartY.current;
    if (diff > 0) setPullDistance(Math.min(diff, 80));
  };
  const handlePullEnd = () => {
    if (pullDistance > 55) {
      setRefreshing(true);
      setTimeout(() => {
        setRefreshing(false);
        runSearchLoad();
      }, 600);
    }
    setPullDistance(0);
    pullStartY.current = null;
  };
  const goToTab = (key) => {
    const tabKeys = bottomNavItems.map((i) => i.key);
    if (!tabKeys.includes(key)) return;
    setScreen(key);
  };
  const [pForm, setPForm] = useState(initialProForm);
  const [pErrors, setPErrors] = useState({});
  const [pShowPassword, setPShowPassword] = useState(false);
  const [pShowConfirm, setPShowConfirm] = useState(false);
  const [pCepLoading, setPCepLoading] = useState(false);
  const [pLocationStatus, setPLocationStatus] = useState("idle");
  const [specialtyInput, setSpecialtyInput] = useState("");
  const [serviceDraft, setServiceDraft] = useState({ name: "", price: "", duration: "" });
  const pFileInputRef = useRef(null);
  const pWorkPhotosInputRef = useRef(null);
  const pDocFrontRef = useRef(null);
  const pDocBackRef = useRef(null);
  // ---------- NOVO: Painel do profissional ----------
  const goToProTab = (key) => {
    const tabKeys = proBottomNavItems.map((i) => i.key);
    if (!tabKeys.includes(key)) return;
    setScreen(key);
  };
  const [proViewMonth, setProViewMonth] = useState(startOfMonth(new Date()));
  const [proSelectedDate, setProSelectedDate] = useState(startOfDay(new Date()));
  const [proMonthAnimKey, setProMonthAnimKey] = useState(0);
  const changeProMonth = (delta) => {
    setProViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
    setProMonthAnimKey((k) => k + 1);
  };
  const getProDayAppointments = (date) =>
    proAgendaMock[`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`] || [];
  const [loyaltySettings, setLoyaltySettings] = useState(initialLoyaltySettings);
  const [proHomeRevenueSel, setProHomeRevenueSel] = useState(null);
  const [proAnalyticsSel, setProAnalyticsSel] = useState(null);
  const [proServiceDetail, setProServiceDetail] = useState(null);
  // Com o painel de detalhamento aberto, a página por trás dele (que rola
  // normalmente, já que o "outer" não tem altura fixa) ainda respondia ao
  // scroll, fazendo a bottom nav e os atalhos de navegação por trás
  // "subirem" atrás do painel fixo — travar o scroll do body enquanto o
  // painel estiver aberto resolve isso.
  useEffect(() => {
    document.body.style.overflow = proServiceDetail ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [proServiceDetail]);
  const [financePeriod, setFinancePeriod] = useState("semana");
  const [financeRevenueSel, setFinanceRevenueSel] = useState(null);
  const financeData = financePeriod === "semana" ? proWeeklyRevenue : proMonthlyRevenue;
  const [faceStatus, setFaceStatus] = useState("idle");
  const [faceProgress, setFaceProgress] = useState(0);
  const [faceReturnTo, setFaceReturnTo] = useState("home");
  const [faceBackTo, setFaceBackTo] = useState("terms");
  // ---------- Ranking (personalizado quando vem do Provador, geral quando acessado direto) ----------
  const [rankingLoading, setRankingLoading] = useState(true);
  const [rankingError, setRankingError] = useState(false);
  const [recommended, setRecommended] = useState([]);
  const [rankingSource, setRankingSource] = useState("direct"); // "direct" | "provador"
  const [rankingCategory, setRankingCategory] = useState("todos");
  const [personalizedSort, setPersonalizedSort] = useState("recomendados");
  const loadRanking = () => {
    setRankingLoading(true);
    setRankingError(false);
    setTimeout(() => {
      try {
        // A tela de resultado do Provador ("clientTryOnResult") também usa a
        // lógica de recomendação personalizada (referência como sinal
        // principal), mesmo antes do usuário clicar em "Encontrar
        // profissionais" — é o mesmo cálculo já usado em rankingSource
        // === "provador", só disparado num ponto a mais do fluxo.
        const personalized = rankingSource === "provador" || screen === "clientTryOnResult";
        const results = recommendProfessionals({
          service: cPreferences[0] || null,
          category: personalized ? null : rankingCategory,
          referenceImage: personalized ? tryOnReference : null,
          generatedImage: personalized ? tryOnClientPhoto : null,
          preferences: cPreferences,
          location: cForm.latitude && cForm.longitude ? { lat: cForm.latitude, lng: cForm.longitude } : null,
          priceRange: null,
          limit: personalized ? 5 : 10,
        });
        setRecommended(results);
        setRankingLoading(false);
      } catch (err) {
        setRankingLoading(false);
        setRankingError(true);
      }
    }, 550);
  };
  useEffect(() => {
    if (screen === "clientHome" || screen === "clientTryOnResult") loadRanking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, rankingSource, rankingCategory]);
  // ---------- Provador virtual ----------
  const [tryOnReference, setTryOnReference] = useState("");
  const [tryOnClientPhoto, setTryOnClientPhoto] = useState("");
  const tryOnRefInputRef = useRef(null);
  const tryOnPhotoInputRef = useRef(null);
  const startTryOnFlow = () => {
    setTryOnReference("");
    setTryOnClientPhoto("");
    setScreen("clientTryOnReference");
  };
  const goToPersonalizedRanking = () => {
    setRankingSource("provador");
    setScreen("clientHome");
  };
  // ---------- Agenda ----------
  const [agendaTab, setAgendaTab] = useState("proximo");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  // ---------- Perfil da cliente: sub-páginas ----------
  const [profileSaveStatus, setProfileSaveStatus] = useState("idle"); // idle | saving | success
  const [favoriteProIds, setFavoriteProIds] = useState([]);
  const toggleFavoriteProfessional = (id) =>
    setFavoriteProIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  const validateProfileEdit = () => {
    const e = {};
    if (!cForm.name.trim() || cForm.name.trim().length < 3 || !/\s/.test(cForm.name.trim()))
      e.name = "Informe nome e sobrenome";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cForm.email)) e.email = "E-mail inválido";
    if (onlyDigits(cForm.phone).length < 10) e.phone = "Telefone incompleto";
    setCErrors(e);
    return Object.keys(e).length === 0;
  };
  const saveProfileEdit = () => {
    if (!validateProfileEdit()) return;
    setProfileSaveStatus("saving");
    setTimeout(() => {
      setProfileSaveStatus("success");
      setTimeout(() => {
        setProfileSaveStatus("idle");
        setScreen("clientProfile");
      }, 700);
    }, 700);
  };
  const setCField = (key, value) => {
    setCForm((f) => ({ ...f, [key]: value }));
    if (cErrors[key])
      setCErrors((e) => {
        const n = { ...e };
        delete n[key];
        return n;
      });
  };
  const setPField = (key, value) => {
    setPForm((f) => ({ ...f, [key]: value }));
    if (pErrors[key])
      setPErrors((e) => {
        const n = { ...e };
        delete n[key];
        return n;
      });
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
  const validateClientPersonal = () => {
    const e = {};
    if (!cForm.photo) e.photo = "Adicione uma foto de perfil";
    if (!cForm.name.trim() || cForm.name.trim().length < 3 || !/\s/.test(cForm.name.trim()))
      e.name = "Informe nome e sobrenome";
    if (!isValidCpf(cForm.cpf)) e.cpf = "CPF inválido";
    if (!cForm.birth) e.birth = "Informe sua data de nascimento";
    else {
      const age = (Date.now() - new Date(cForm.birth).getTime()) / (365.25 * 24 * 3600 * 1000);
      if (age < 18) e.birth = "Você precisa ter pelo menos 18 anos";
    }
    if (!cForm.gender) e.gender = "Selecione uma opção";
    if (onlyDigits(cForm.phone).length < 10) e.phone = "Telefone incompleto";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cForm.email)) e.email = "E-mail inválido";
    if (cForm.password.length < 8 || !/[A-Z]/.test(cForm.password) || !/[0-9]/.test(cForm.password))
      e.password = "Mínimo 8 caracteres, com maiúscula e número";
    if (cForm.password !== cForm.confirm) e.confirm = "As senhas não coincidem";
    setCErrors(e);
    return Object.keys(e).length === 0;
  };
  const validateAddress = (form, setErrors) => {
    const e = {};
    if (onlyDigits(form.cep).length !== 8) e.cep = "CEP inválido";
    if (!form.street.trim()) e.street = "Informe a rua";
    if (!form.number.trim()) e.number = "Informe o número";
    if (!form.neighborhood.trim()) e.neighborhood = "Informe o bairro";
    if (!form.city.trim()) e.city = "Informe a cidade";
    if (form.state.trim().length !== 2) e.state = "Use a sigla do estado (ex.: GO)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const validateTerms = (form, setErrors) => {
    const e = {};
    if (!form.termsUse) e.termsUse = "Aceite os Termos de Uso para continuar";
    if (!form.termsPrivacy) e.termsPrivacy = "Aceite a Política de Privacidade para continuar";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const validateProPersonal = () => {
    const e = {};
    if (!pForm.photo) e.photo = "Adicione uma foto de perfil";
    if (!pForm.name.trim() || pForm.name.trim().length < 3 || !/\s/.test(pForm.name.trim()))
      e.name = "Informe nome e sobrenome";
    const docValid = pForm.documentType === "cpf" ? isValidCpf(pForm.document) : isValidCnpj(pForm.document);
    if (!docValid) e.document = "Documento inválido";
    if (!pForm.birth) e.birth = "Informe sua data de nascimento";
    else {
      const age = (Date.now() - new Date(pForm.birth).getTime()) / (365.25 * 24 * 3600 * 1000);
      if (age < 18) e.birth = "Você precisa ter pelo menos 18 anos";
    }
    if (onlyDigits(pForm.phone).length < 10) e.phone = "Telefone incompleto";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pForm.email)) e.email = "E-mail inválido";
    if (pForm.password.length < 8 || !/[A-Z]/.test(pForm.password) || !/[0-9]/.test(pForm.password))
      e.password = "Mínimo 8 caracteres, com maiúscula e número";
    if (pForm.password !== pForm.confirm) e.confirm = "As senhas não coincidem";
    setPErrors(e);
    return Object.keys(e).length === 0;
  };
  const handleCepBlur = (form, setter, setLoading) => {
    const digits = onlyDigits(form.cep);
    if (digits.length !== 8) return;
    setLoading(true);
    setTimeout(() => {
      setter((f) => ({
        ...f,
        street: f.street || "Av. T-4",
        neighborhood: f.neighborhood || "Setor Bueno",
        city: f.city || "Goiânia",
        state: f.state || "GO",
      }));
      setLoading(false);
    }, 500);
  };
  const handleActivateLocation = (setter, setStatus) => {
    setStatus("loading");
    if (!navigator.geolocation) {
      setTimeout(() => setStatus("error"), 400);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setter((f) => ({ ...f, latitude: pos.coords.latitude, longitude: pos.coords.longitude }));
        setStatus("success");
      },
      () => setStatus("error"),
      { timeout: 8000 },
    );
  };
  const addSpecialty = (value) => {
    const trimmed = value.trim();
    if (!trimmed || pForm.specialties.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSpecialtyInput("");
      return;
    }
    setPForm((f) => ({ ...f, specialties: [...f.specialties, trimmed] }));
    setSpecialtyInput("");
    setPErrors((e) => {
      const n = { ...e };
      delete n.specialties;
      return n;
    });
  };
  const removeSpecialty = (value) => setPForm((f) => ({ ...f, specialties: f.specialties.filter((s) => s !== value) }));
  const addService = () => {
    if (!serviceDraft.name.trim() || !serviceDraft.price.trim() || !serviceDraft.duration.trim()) return;
    setPForm((f) => ({ ...f, services: [...f.services, { id: `${Date.now()}`, ...serviceDraft }] }));
    setServiceDraft({ name: "", price: "", duration: "" });
    setPErrors((e) => {
      const n = { ...e };
      delete n.services;
      return n;
    });
  };
  const removeService = (id) => setPForm((f) => ({ ...f, services: f.services.filter((s) => s.id !== id) }));
  const removeWorkPhoto = (idx) => setPForm((f) => ({ ...f, workPhotos: f.workPhotos.filter((_, i) => i !== idx) }));
  const startFaceScan = () => {
    setFaceStatus("scanning");
    setFaceProgress(0);
    const interval = setInterval(() => {
      setFaceProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setFaceStatus("success");
          return 100;
        }
        return p + 5;
      });
    }, 70);
  };
  const stopClientSelfieCamera = () => {
    cSelfieStreamRef.current?.getTracks().forEach((track) => track.stop());
    cSelfieStreamRef.current = null;
  };
  const startClientSelfieCamera = async () => {
    setCSelfieError("");
    setCSelfieStatus("idle");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      cSelfieStreamRef.current = stream;
      if (cSelfieVideoRef.current) {
        cSelfieVideoRef.current.srcObject = stream;
        await cSelfieVideoRef.current.play();
      }
      setCSelfieStatus("streaming");
    } catch (err) {
      setCSelfieError("Não foi possível acessar a câmera. Verifique as permissões do navegador.");
      setCSelfieStatus("error");
    }
  };
  const captureClientSelfie = () => {
    const video = cSelfieVideoRef.current;
    const canvas = cSelfieCanvasRef.current;
    if (!video || !canvas) return;
    const size = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;
    ctx.translate(size, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setCField("selfiePhoto", dataUrl);
    stopClientSelfieCamera();
    setCSelfieStatus("captured");
  };
  const retakeClientSelfie = () => {
    setCField("selfiePhoto", "");
    startClientSelfieCamera();
  };
  useEffect(() => {
    if (screen === "clientSelfie" && !cForm.selfiePhoto) {
      startClientSelfieCamera();
    }
    if (screen !== "clientSelfie") {
      stopClientSelfieCamera();
    }
    return () => stopClientSelfieCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);
  const goToFace = (backTo, returnTo) => {
    setFaceStatus("idle");
    setFaceProgress(0);
    setFaceBackTo(backTo);
    setFaceReturnTo(returnTo);
    setScreen("face");
  };

  const value = {
    screen,
    setScreen,
    accountType,
    setAccountType,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    showLoginPassword,
    setShowLoginPassword,
    cForm,
    setCForm,
    cErrors,
    setCErrors,
    cShowPassword,
    setCShowPassword,
    cShowConfirm,
    setCShowConfirm,
    cCepLoading,
    setCCepLoading,
    cLocationStatus,
    setCLocationStatus,
    cFileInputRef,
    cDocFrontRef,
    cDocBackRef,
    cSelfieStatus,
    cSelfieError,
    cSelfieVideoRef,
    cSelfieCanvasRef,
    cPreferences,
    setCPreferences,
    toggleCPreference,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    draftFilters,
    setDraftFilters,
    filterModalOpen,
    filterModalMounted,
    searchLoading,
    visibleCount,
    refreshing,
    selectedProId,
    setSelectedProId,
    homeMapSelectedId,
    setHomeMapSelectedId,
    bookedSlot,
    setBookedSlot,
    viewMonth,
    setViewMonth,
    selectedDate,
    setSelectedDate,
    scheduleTime,
    setScheduleTime,
    scheduleLoading,
    scheduleError,
    setScheduleError,
    monthAnimKey,
    today,
    selectScheduleDate,
    retrySchedule,
    changeMonth,
    searchListRef,
    pullDistance,
    filteredProfessionals,
    searchHasError,
    openFilterModal,
    closeFilterModal,
    applyFilters,
    clearFilters,
    runSearchLoad,
    handleSearchScroll,
    handlePullStart,
    handlePullMove,
    handlePullEnd,
    goToTab,
    pForm,
    setPForm,
    pErrors,
    setPErrors,
    pShowPassword,
    setPShowPassword,
    pShowConfirm,
    setPShowConfirm,
    pCepLoading,
    setPCepLoading,
    pLocationStatus,
    setPLocationStatus,
    specialtyInput,
    setSpecialtyInput,
    serviceDraft,
    setServiceDraft,
    pFileInputRef,
    pWorkPhotosInputRef,
    pDocFrontRef,
    pDocBackRef,
    goToProTab,
    proViewMonth,
    proSelectedDate,
    setProSelectedDate,
    proMonthAnimKey,
    changeProMonth,
    getProDayAppointments,
    loyaltySettings,
    setLoyaltySettings,
    proHomeRevenueSel,
    setProHomeRevenueSel,
    proAnalyticsSel,
    setProAnalyticsSel,
    proServiceDetail,
    setProServiceDetail,
    financePeriod,
    setFinancePeriod,
    financeRevenueSel,
    setFinanceRevenueSel,
    financeData,
    faceStatus,
    setFaceStatus,
    faceProgress,
    faceReturnTo,
    faceBackTo,
    rankingLoading,
    rankingError,
    recommended,
    rankingSource,
    loadRanking,
    tryOnReference,
    setTryOnReference,
    tryOnClientPhoto,
    setTryOnClientPhoto,
    tryOnRefInputRef,
    tryOnPhotoInputRef,
    startTryOnFlow,
    goToPersonalizedRanking,
    agendaTab,
    setAgendaTab,
    selectedAppointmentId,
    setSelectedAppointmentId,
    profileSaveStatus,
    favoriteProIds,
    toggleFavoriteProfessional,
    saveProfileEdit,
    setCField,
    setPField,
    handlePhoto,
    handleWorkPhotos,
    validateClientPersonal,
    validateAddress,
    validateTerms,
    validateProPersonal,
    handleCepBlur,
    handleActivateLocation,
    addSpecialty,
    removeSpecialty,
    addService,
    removeService,
    removeWorkPhoto,
    startFaceScan,
    stopClientSelfieCamera,
    startClientSelfieCamera,
    captureClientSelfie,
    retakeClientSelfie,
    goToFace,
  };

  return <KiraContext.Provider value={value}>{children}</KiraContext.Provider>;
}

export function useKira() {
  const ctx = useContext(KiraContext);
  if (!ctx) throw new Error("useKira deve ser usado dentro de <KiraProvider>");
  return ctx;
}
