// Mapa chave da tela → componente (as URLs ficam em routes.js) · API: nenhuma
// Cada tela é carregada só quando a rota é aberta (code splitting); AppRoutes mostra o fallback.
import { lazy } from "react";
const ClientAccountSecurityScreen = lazy(() => import("./client/screens/ClientAccountSecurityScreen"));
const ClientAddressScreen = lazy(() => import("./client/screens/ClientAddressScreen"));
const ClientAgendaDetailScreen = lazy(() => import("./client/screens/ClientAgendaDetailScreen"));
const ClientRescheduleScreen = lazy(() => import("./client/screens/ClientRescheduleScreen"));
const ClientConversationScreen = lazy(() => import("./client/screens/ClientConversationScreen"));
const ClientAgendaScreen = lazy(() => import("./client/screens/ClientAgendaScreen"));
const ClientBookingTrackingScreen = lazy(() => import("./client/screens/ClientBookingTrackingScreen"));
const ClientCheckoutScreen = lazy(() => import("./client/screens/ClientCheckoutScreen"));
const ClientJourneyScreen = lazy(() => import("./client/screens/ClientJourneyScreen"));
const ClientLoyaltyScreen = lazy(() => import("./client/screens/ClientLoyaltyScreen"));
const ClientPaymentProcessingScreen = lazy(() => import("./client/screens/ClientPaymentProcessingScreen"));
const ClientRecommendedScreen = lazy(() => import("./client/screens/ClientRecommendedScreen"));
const ProClientsScreen = lazy(() => import("./professional/screens/ProClientsScreen"));
const ClientChatScreen = lazy(() => import("./client/screens/ClientChatScreen"));
const ClientConversationsScreen = lazy(() => import("./client/screens/ClientConversationsScreen"));
const ClientFaqScreen = lazy(() => import("./client/screens/ClientFaqScreen"));
const ClientNotificationsScreen = lazy(() => import("./client/screens/ClientNotificationsScreen"));
const ClientCouponsScreen = lazy(() => import("./client/screens/ClientCouponsScreen"));
const ClientDocumentScreen = lazy(() => import("./client/screens/ClientDocumentScreen"));
const ClientDoneScreen = lazy(() => import("./client/screens/ClientDoneScreen"));
const ClientFavoritesScreen = lazy(() => import("./client/screens/ClientFavoritesScreen"));
const ClientHelpSupportScreen = lazy(() => import("./client/screens/ClientHelpSupportScreen"));
const ClientHistoryScreen = lazy(() => import("./client/screens/ClientHistoryScreen"));
const ClientMapScreen = lazy(() => import("./client/screens/ClientMapScreen"));
const ClientHomeScreen = lazy(() => import("./client/screens/ClientHomeScreen"));
const ClientLgpdConsentsScreen = lazy(() => import("./client/screens/ClientLgpdConsentsScreen"));
const ClientLocationScreen = lazy(() => import("./client/screens/ClientLocationScreen"));
const ClientPaymentHistoryScreen = lazy(() => import("./client/screens/ClientPaymentHistoryScreen"));
const ClientPaymentMethodsScreen = lazy(() => import("./client/screens/ClientPaymentMethodsScreen"));
const ClientPersonalScreen = lazy(() => import("./client/screens/ClientPersonalScreen"));
const ClientPreferencesScreen = lazy(() => import("./client/screens/ClientPreferencesScreen"));
const ClientPrivacyDataScreen = lazy(() => import("./client/screens/ClientPrivacyDataScreen"));
const ClientProfessionalProfileScreen = lazy(() => import("./client/screens/ClientProfessionalProfileScreen"));
const ClientProfileEditScreen = lazy(() => import("./client/screens/ClientProfileEditScreen"));
const ClientProfileScreen = lazy(() => import("./client/screens/ClientProfileScreen"));
const ClientReviewsScreen = lazy(() => import("./client/screens/ClientReviewsScreen"));
const ClientSchedulingScreen = lazy(() => import("./client/screens/ClientSchedulingScreen"));
const ClientSearchScreen = lazy(() => import("./client/screens/ClientSearchScreen"));
const ClientSelfieScreen = lazy(() => import("./client/screens/ClientSelfieScreen"));
const ClientTermsScreen = lazy(() => import("./client/screens/ClientTermsScreen"));
const ClientTryOnPhotoScreen = lazy(() => import("./client/screens/ClientTryOnPhotoScreen"));
const ClientTryOnReferenceScreen = lazy(() => import("./client/screens/ClientTryOnReferenceScreen"));
const ClientTryOnResultScreen = lazy(() => import("./client/screens/ClientTryOnResultScreen"));
const ProAddressScreen = lazy(() => import("./professional/screens/ProAddressScreen"));
const ProAgendaDashScreen = lazy(() => import("./professional/screens/ProAgendaDashScreen"));
const ProRescheduleScreen = lazy(() => import("./professional/screens/ProRescheduleScreen"));
const ProClientInfoScreen = lazy(() => import("./professional/screens/ProClientInfoScreen"));
const ProConversationScreen = lazy(() => import("./professional/screens/ProConversationScreen"));
const ProAnalyticsScreen = lazy(() => import("./professional/screens/ProAnalyticsScreen"));
const ProDocumentScreen = lazy(() => import("./professional/screens/ProDocumentScreen"));
const ProDoneScreen = lazy(() => import("./professional/screens/ProDoneScreen"));
const ProFinanceScreen = lazy(() => import("./professional/screens/ProFinanceScreen"));
const ProGiftCardsScreen = lazy(() => import("./professional/screens/ProGiftCardsScreen"));
const ProBusinessHoursScreen = lazy(() => import("./professional/screens/ProBusinessHoursScreen"));
const ProPortfolioScreen = lazy(() => import("./professional/screens/ProPortfolioScreen"));
const ProHelpScreen = lazy(() => import("./professional/screens/ProHelpScreen"));
const ProHomeScreen = lazy(() => import("./professional/screens/ProHomeScreen"));
const ProLocationScreen = lazy(() => import("./professional/screens/ProLocationScreen"));
const ProLoyaltyScreen = lazy(() => import("./professional/screens/ProLoyaltyScreen"));
const ProPersonalScreen = lazy(() => import("./professional/screens/ProPersonalScreen"));
const ProPhotosScreen = lazy(() => import("./professional/screens/ProPhotosScreen"));
const ProConversationsScreen = lazy(() => import("./professional/screens/ProConversationsScreen"));
const ProFaqScreen = lazy(() => import("./professional/screens/ProFaqScreen"));
const ProNotificationsScreen = lazy(() => import("./professional/screens/ProNotificationsScreen"));
const ProPremiumScreen = lazy(() => import("./professional/screens/ProPremiumScreen"));
import { ProSearchScreen } from "./professional/screens/ProSearchScreen";
const ProKiraIaScreen = lazy(() => import("./professional/screens/ProKiraIaScreen"));
const ProProfileMenuScreen = lazy(() => import("./professional/screens/ProProfileMenuScreen"));
const ProManageServicesScreen = lazy(() => import("./professional/screens/ProManageServicesScreen"));
const ProStaffScreen = lazy(() => import("./professional/screens/ProStaffScreen"));
const ProProfileEditScreen = lazy(() => import("./professional/screens/ProProfileEditScreen"));
const ProSecurityScreen = lazy(() => import("./professional/screens/ProSecurityScreen"));
const ProServicesScreen = lazy(() => import("./professional/screens/ProServicesScreen"));
const ProSpecialtiesScreen = lazy(() => import("./professional/screens/ProSpecialtiesScreen"));
const ProTermsScreen = lazy(() => import("./professional/screens/ProTermsScreen"));
const FaceScreen = lazy(() => import("./shared/screens/FaceScreen"));
const HomeScreen = lazy(() => import("./shared/screens/HomeScreen"));
const ForgotPasswordScreen = lazy(() => import("./shared/screens/ForgotPasswordScreen"));
const LoginScreen = lazy(() => import("./shared/screens/LoginScreen"));
const OpenConversationScreen = lazy(() => import("./shared/screens/OpenConversationScreen"));
const ResetPasswordScreen = lazy(() => import("./shared/screens/ResetPasswordScreen"));
const SignupScreen = lazy(() => import("./shared/screens/SignupScreen"));
const SplashScreen = lazy(() => import("./shared/screens/SplashScreen"));

// Mapa `screen` -> tela. A navegação usa as rotas de routes.js e AppRoutes.jsx.
export const screens = {
  splash: SplashScreen,
  login: LoginScreen,
  openConversation: OpenConversationScreen,
  forgotPassword: ForgotPasswordScreen,
  resetPassword: ResetPasswordScreen,
  signup: SignupScreen,
  clientPersonal: ClientPersonalScreen,
  clientAddress: ClientAddressScreen,
  clientLocation: ClientLocationScreen,
  clientDocument: ClientDocumentScreen,
  clientSelfie: ClientSelfieScreen,
  clientTerms: ClientTermsScreen,
  clientDone: ClientDoneScreen,
  clientPreferences: ClientPreferencesScreen,
  clientHome: ClientHomeScreen,
  clientSearch: ClientSearchScreen,
  clientMap: ClientMapScreen,
  clientTryOnReference: ClientTryOnReferenceScreen,
  clientTryOnPhoto: ClientTryOnPhotoScreen,
  clientTryOnResult: ClientTryOnResultScreen,
  clientAgenda: ClientAgendaScreen,
  clientAgendaDetail: ClientAgendaDetailScreen,
  clientReschedule: ClientRescheduleScreen,
  clientConversation: ClientConversationScreen,
  clientBookingTracking: ClientBookingTrackingScreen,
  clientProfile: ClientProfileScreen,
  clientProfileEdit: ClientProfileEditScreen,
  clientAccountSecurity: ClientAccountSecurityScreen,
  clientPrivacyData: ClientPrivacyDataScreen,
  clientLgpdConsents: ClientLgpdConsentsScreen,
  clientPaymentMethods: ClientPaymentMethodsScreen,
  clientPaymentHistory: ClientPaymentHistoryScreen,
  clientCoupons: ClientCouponsScreen,
  clientHelpSupport: ClientHelpSupportScreen,
  clientFaq: ClientFaqScreen,
  clientCheckout: ClientCheckoutScreen,
  clientPaymentProcessing: ClientPaymentProcessingScreen,
  clientRecommended: ClientRecommendedScreen,
  clientLoyalty: ClientLoyaltyScreen,
  clientJourney: ClientJourneyScreen,
  clientConversations: ClientConversationsScreen,
  clientNotifications: ClientNotificationsScreen,
  clientChat: ClientChatScreen,
  clientReviews: ClientReviewsScreen,
  clientFavorites: ClientFavoritesScreen,
  clientHistory: ClientHistoryScreen,
  clientProfessionalProfile: ClientProfessionalProfileScreen,
  clientScheduling: ClientSchedulingScreen,
  proPersonal: ProPersonalScreen,
  proAddress: ProAddressScreen,
  proLocation: ProLocationScreen,
  proSpecialties: ProSpecialtiesScreen,
  proServices: ProServicesScreen,
  proPhotos: ProPhotosScreen,
  proDocument: ProDocumentScreen,
  proTerms: ProTermsScreen,
  proDone: ProDoneScreen,
  proHome: ProHomeScreen,
  proAgendaDash: ProAgendaDashScreen,
  proReschedule: ProRescheduleScreen,
  proClientInfo: ProClientInfoScreen,
  proConversation: ProConversationScreen,
  proProfileMenu: ProProfileMenuScreen,
  proKiraIa: ProKiraIaScreen,
  proProfileEdit: ProProfileEditScreen,
  proManageServices: ProManageServicesScreen,
  proStaff: ProStaffScreen,
  proFinance: ProFinanceScreen,
  proAnalytics: ProAnalyticsScreen,
  proGiftCards: ProGiftCardsScreen,
  proLoyalty: ProLoyaltyScreen,
  proSecurity: ProSecurityScreen,
  proBusinessHours: ProBusinessHoursScreen,
  proPortfolio: ProPortfolioScreen,
  proHelp: ProHelpScreen,
  proFaq: ProFaqScreen,
  proClients: ProClientsScreen,
  proConversations: ProConversationsScreen,
  proNotifications: ProNotificationsScreen,
  proPremium: ProPremiumScreen,
  proSearch: ProSearchScreen,
  face: FaceScreen,
  home: HomeScreen,
};
