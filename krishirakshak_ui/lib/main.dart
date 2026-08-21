import 'package:flutter/material.dart';

import 'pages/onboarding_auth_page.dart';
import 'pages/farm_dashboard_page.dart';
import 'pages/ai_consultation_page.dart';
import 'pages/grow_better_page.dart';
import 'pages/sell_smarter_page.dart';
import 'pages/lose_less_page.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const KrishiRakshakApp());
}

class KrishiRakshakApp extends StatelessWidget {
  const KrishiRakshakApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'KrishiRakshak - AI Farm Intelligence',
      debugShowCheckedModeBanner: false,

      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF2E7D32),
          primary: const Color(0xFF2E7D32),
          secondary: const Color(0xFF4CAF50),
          surface: Colors.white,
        ),
        scaffoldBackgroundColor: const Color(0xFFF4F9F4),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF2E7D32),
          foregroundColor: Colors.white,
          elevation: 0,
        ),
      ),

      initialRoute: '/',

      routes: {
        '/': (context) => const OnboardingAndAuthWidget(),

        '/onboardingAndAuth': (context) =>
            const OnboardingAndAuthWidget(),

        '/farmDashboard': (context) =>
            const FarmDashboardWidget(),

        '/aiConsultation': (context) =>
            const AIConsultationPage(),

        '/growBetterPrePage': (context) =>
            const GrowBetterPrePageWidget(),

        '/sellSmarterHarvestPage': (context) =>
            const SellSmarterHarvestPageWidget(),

        '/heroLoseLessPage': (context) =>
            const HeroLoseLessPageWidget(),
      },
    );
  }
}