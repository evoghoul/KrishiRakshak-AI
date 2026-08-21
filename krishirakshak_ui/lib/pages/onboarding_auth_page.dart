import 'package:flutter/material.dart';
import 'farm_dashboard_page.dart';

class OnboardingAndAuthWidget extends StatefulWidget {
  const OnboardingAndAuthWidget({super.key});

  @override
  State<OnboardingAndAuthWidget> createState() => _OnboardingAndAuthWidgetState();
}

class _OnboardingAndAuthWidgetState extends State<OnboardingAndAuthWidget> {
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _otpController = TextEditingController();
  
  String _selectedLanguage = 'Telugu';
  bool _showLanguageModal = false;

  final List<String> _languages = ['Telugu', 'Hindi', 'English', 'Tamil', 'Kannada'];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F9F4), // Light Greenery Background
      body: Stack(
        children: [
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const SizedBox(height: 20),
                  // App Logo & Header
                  Center(
                    child: Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        color: const Color(0xFFE8F5E9),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Icon(Icons.agriculture_rounded, color: Color(0xFF2E7D32), size: 48),
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'KrishiRakshak',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: Color(0xFF2E7D32)),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'AI-Powered Farm Intelligence',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 14, color: Colors.grey),
                  ),
                  const SizedBox(height: 40),

                  // Phone Number Field
                  TextField(
                    controller: _phoneController,
                    keyboardType: TextInputType.phone,
                    decoration: InputDecoration(
                      labelText: 'Phone Number',
                      hintText: 'Enter 10-digit mobile number',
                      prefixIcon: const Icon(Icons.phone_android_rounded, color: Color(0xFF2E7D32)),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      focusedBorder: const OutlineInputBorder(
                        borderSide: BorderSide(color: Color(0xFF2E7D32), width: 2),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // OTP Field
                  TextField(
                    controller: _otpController,
                    keyboardType: TextInputType.number,
                    decoration: InputDecoration(
                      labelText: 'OTP',
                      hintText: 'Enter 4-digit code',
                      prefixIcon: const Icon(Icons.lock_open_rounded, color: Color(0xFF2E7D32)),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      focusedBorder: const OutlineInputBorder(
                        borderSide: BorderSide(color: Color(0xFF2E7D32), width: 2),
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Login Button
                  ElevatedButton(
                    onPressed: () {
                      setState(() {
                        _showLanguageModal = true;
                      });
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF2E7D32),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('Login to Farm', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  ),
                  const SizedBox(height: 20),

                  // Divider
                  const Row(
                    children: [
                      Expanded(child: Divider()),
                      Padding(padding: EdgeInsets.symmetric(horizontal: 8.0), child: Text('OR', style: TextStyle(color: Colors.grey))),
                      Expanded(child: Divider()),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Google Sign In Button
                  OutlinedButton.icon(
                    onPressed: () {
                      setState(() {
                        _showLanguageModal = true;
                      });
                    },
                    style: OutlinedButton.styleFrom(
                      foregroundColor: const Color(0xFF1B5E20),
                      side: const BorderSide(color: Color(0xFF2E7D32)),
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    icon: const Icon(Icons.g_mobiledata, size: 28, color: Color(0xFF2E7D32)),
                    label: const Text('Sign in with Google', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ),
          ),

          // Language Selection Bottom Sheet Overlay
          if (_showLanguageModal)
            Container(
              color: Colors.black54,
              child: Align(
                alignment: Alignment.bottomCenter,
                child: Container(
                  padding: const EdgeInsets.all(24),
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(24),
                      topRight: Radius.circular(24),
                    ),
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Select Your Language', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF1B5E20))),
                          IconButton(
                            icon: const Icon(Icons.close_rounded),
                            onPressed: () {
                              setState(() {
                                _showLanguageModal = false;
                              });
                            },
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      const Center(
                        child: CircleAvatar(
                          radius: 35,
                          backgroundColor: Color(0xFFE8F5E9),
                          child: Icon(Icons.mic_rounded, size: 32, color: Color(0xFF2E7D32)),
                        ),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Speak your language (e.g., Telugu, Hindi, English)',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.grey, fontSize: 13),
                      ),
                      const SizedBox(height: 20),
                      Wrap(
                        spacing: 10,
                        runSpacing: 10,
                        alignment: WrapAlignment.center,
                        children: _languages.map((lang) {
                          bool isSelected = _selectedLanguage == lang;
                          return ChoiceChip(
                            label: Text(lang),
                            selected: isSelected,
                            selectedColor: const Color(0xFF4CAF50),
                            labelStyle: TextStyle(color: isSelected ? Colors.white : Colors.black87),
                            onSelected: (selected) {
                              setState(() {
                                _selectedLanguage = lang;
                              });
                            },
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 24),
                      ElevatedButton(
                        onPressed: () {
                          Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(builder: (context) => const FarmDashboardWidget()),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF2E7D32),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        child: const Text('Confirm Language & Continue', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                      ),
                      const SizedBox(height: 10),
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}