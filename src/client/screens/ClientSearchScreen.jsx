// Busca com filtros, scroll infinito e pull-to-refresh · mock com latência simulada
import { Loader2 } from "lucide-react";
import { useKira } from "../../context/KiraContext";
import { EmptyState, ErrorState, SkeletonLoading } from "../../shared/components/states";
import { CategoryChip, Header, SearchBar } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay } from "../../shared/theme";
import { BottomNav } from "../components/BottomNav";
import { FilterModal } from "../components/FilterModal";
import { ProfessionalCard } from "../components/ProfessionalCards";
import { categoryOptions } from "../data/mocks";

export default function ClientSearchScreen() {
  const {
    applyFilters,
    categoryFilter,
    clearFilters,
    closeFilterModal,
    draftFilters,
    filterModalMounted,
    filterModalOpen,
    filteredProfessionals,
    goToTab,
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
    searchQuery,
    setBookedSlot,
    setCategoryFilter,
    setDraftFilters,
    setScreen,
    setSearchQuery,
    setSelectedProId,
    visibleCount,
  } = useKira();
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <Header onBack={() => setScreen("clientHome")} />
      <div style={{ padding: "0 24px 12px" }}>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: 22,
            color: colors.foreground,
            margin: "0 0 14px",
          }}
        >
          Buscar
        </h1>
        <SearchBar value={searchQuery} onChange={setSearchQuery} onFilterClick={openFilterModal} />
        <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "14px 0 4px" }}>
          {categoryOptions.map((c) => (
            <CategoryChip
              key={c.id}
              label={c.label}
              active={categoryFilter === c.id}
              onClick={() => setCategoryFilter(c.id)}
            />
          ))}
        </div>
      </div>

      <div
        ref={searchListRef}
        onScroll={handleSearchScroll}
        onTouchStart={handlePullStart}
        onTouchMove={handlePullMove}
        onTouchEnd={handlePullEnd}
        style={{ flex: 1, overflowY: "auto", padding: "8px 24px 24px", position: "relative" }}
      >
        {(pullDistance > 0 || refreshing) && (
          <div
            style={{ display: "flex", justifyContent: "center", padding: 8, height: refreshing ? 32 : pullDistance }}
          >
            <Loader2
              size={18}
              color={colors.primary}
              className={refreshing ? "spin" : ""}
              style={{ opacity: refreshing ? 1 : Math.min(pullDistance / 55, 1) }}
            />
          </div>
        )}

        {searchLoading ? (
          <SkeletonLoading count={6} />
        ) : searchHasError ? (
          <ErrorState onRetry={runSearchLoad} />
        ) : filteredProfessionals.length === 0 ? (
          <EmptyState onClear={clearFilters} />
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filteredProfessionals.slice(0, visibleCount).map((pro) => (
                <ProfessionalCard
                  key={pro.id}
                  pro={pro}
                  onClick={() => {
                    setSelectedProId(pro.id);
                    setBookedSlot(null);
                    setScreen("clientProfessionalProfile");
                  }}
                />
              ))}
            </div>
            {visibleCount < filteredProfessionals.length && (
              <p
                style={{
                  textAlign: "center",
                  fontFamily: fontBody,
                  fontSize: 11,
                  color: colors.mutedForeground,
                  margin: "14px 0 0",
                }}
              >
                Carregando mais…
              </p>
            )}
          </>
        )}
      </div>

      <BottomNav active="clientSearch" onNavigate={goToTab} />
      <FilterModal
        open={filterModalOpen}
        mounted={filterModalMounted}
        onClose={closeFilterModal}
        draft={draftFilters}
        setDraft={setDraftFilters}
        onApply={applyFilters}
        onClear={clearFilters}
      />
    </div>
  );
}
