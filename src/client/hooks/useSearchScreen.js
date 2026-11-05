// Estado da tela de busca (carregamento, filtros, rolagem infinita, puxar para atualizar) · API: kira-backend (api.professionals.search)
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearch } from "../../context/SearchContext";
import { useSession } from "../../context/SessionContext";
import { api } from "../../shared/api";
import { defaultSearchFilters } from "../data/options";
import { toSearchParams } from "../utils/searchParams";

const PAGE_SIZE = 20;
const TYPING_PAUSE_MS = 300;

// Um estúdio pode mudar de página entre uma chamada e outra: não mostra repetido
export const uniqueById = (professionals) => [...new Map(professionals.map((p) => [p.id, p])).values()];

export function useSearchScreen() {
  const { auth } = useSession();
  const { searchQuery, categoryFilter, setCategoryFilter, appliedFilters, setAppliedFilters } = useSearch();
  const [typedQuery, setTypedQuery] = useState(searchQuery);
  const [draftFilters, setDraftFilters] = useState(defaultSearchFilters);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterModalMounted, setFilterModalMounted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const searchListRef = useRef(null);
  const pullStartY = useRef(null);

  // Espera uma pausa na digitação para não chamar o backend a cada letra
  useEffect(() => {
    const timer = setTimeout(() => setTypedQuery(searchQuery), TYPING_PAUSE_MS);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const params = useMemo(
    () => toSearchParams({ query: typedQuery, category: categoryFilter, filters: appliedFilters }),
    [typedQuery, categoryFilter, appliedFilters],
  );
  const load = useInfiniteQuery({
    // A conta faz parte da chave porque a distância depende de quem está logado
    queryKey: ["professionals", "search", auth?.id ?? null, params],
    queryFn: ({ pageParam }) => api.professionals.search({ ...params, page: pageParam, size: PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: (last) => (last.page + 1 < last.totalPages ? last.page + 1 : undefined),
  });
  const searchLoading = load.isFetching && !load.isFetchingNextPage;
  const filteredProfessionals = useMemo(
    () => uniqueById(load.data?.pages.flatMap((page) => page.items) ?? []),
    [load.data],
  );
  // Falha em uma página seguinte mantém o que já carregou; rolar de novo tenta outra vez
  const searchHasError = load.isError && !load.isFetching && !load.isFetchNextPageError;
  const hasMore = !!load.hasNextPage;
  // A tela mostra "Carregando mais…" quando há menos itens visíveis do que carregados. O último fica
  // guardado até a próxima página chegar, e assim a tela não precisa saber da paginação.
  const loadedCount = filteredProfessionals.length;
  const visibleCount = hasMore ? loadedCount - 1 : loadedCount;

  // Pede a próxima página quando o fim da lista aparece, seja qual for o elemento que rola (na moldura, é a
  // janela). Depois de uma falha, só tenta de novo quando o fim sai e volta à tela, para não repetir sem parar.
  const { fetchNextPage } = load;
  useEffect(() => {
    const end = searchListRef.current?.lastElementChild;
    if (!end || !hasMore || searchLoading) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchNextPage({ cancelRefetch: false });
      },
      { rootMargin: "200px" },
    );
    observer.observe(end);
    return () => observer.disconnect();
  }, [hasMore, searchLoading, loadedCount, fetchNextPage]);

  const runSearchLoad = () => {
    load.refetch();
  };
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

  return {
    applyFilters,
    clearFilters,
    closeFilterModal,
    draftFilters,
    filterModalMounted,
    filterModalOpen,
    filteredProfessionals,
    handlePullEnd,
    handlePullMove,
    handlePullStart,
    openFilterModal,
    pullDistance,
    refreshing,
    runSearchLoad,
    searchHasError,
    searchListRef,
    searchLoading,
    setDraftFilters,
    visibleCount,
  };
}
