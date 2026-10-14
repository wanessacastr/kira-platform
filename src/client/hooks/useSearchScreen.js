// Estado da tela de busca (carregamento, filtros, rolagem infinita, puxar para atualizar) · api.professionals
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useSearch } from "../../context/SearchContext";
import { api } from "../../shared/api";
import { mockProfessionals } from "../../shared/data/professionals";
import { defaultSearchFilters } from "../data/mocks";
import { searchProfessionals } from "../utils/searchProfessionals";

const PAGE_SIZE = 8;

export function useSearchScreen() {
  const { searchQuery, categoryFilter, setCategoryFilter, appliedFilters, setAppliedFilters } = useSearch();
  const [draftFilters, setDraftFilters] = useState(defaultSearchFilters);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterModalMounted, setFilterModalMounted] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const searchListRef = useRef(null);
  const pullStartY = useRef(null);

  // a lista carrega a cada entrada na tela; a busca em si é feita aqui, sem novo carregamento
  const load = useQuery({ queryKey: ["professionals"], queryFn: () => api.professionals.list() });
  const searchLoading = load.isFetching;

  const filteredProfessionals = searchProfessionals(mockProfessionals, {
    query: searchQuery,
    category: categoryFilter,
    filters: appliedFilters,
  });
  const searchHasError = searchQuery.trim().toLowerCase() === "erro";

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, categoryFilter, appliedFilters]);

  const runSearchLoad = () => {
    setVisibleCount(PAGE_SIZE);
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
  const handleSearchScroll = (e) => {
    const el = e.target;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 80) {
      setVisibleCount((v) => Math.min(v + PAGE_SIZE, filteredProfessionals.length));
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
    handleSearchScroll,
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
