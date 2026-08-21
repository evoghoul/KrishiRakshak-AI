import 'package:flutter/material.dart';
import 'ai_consultation_page.dart';

class GrowBetterPrePageWidget extends StatefulWidget {
  const GrowBetterPrePageWidget({super.key});

  @override
  State<GrowBetterPrePageWidget> createState() =>
      _GrowBetterPrePageWidgetState();
}

class _GrowBetterPrePageWidgetState
    extends State<GrowBetterPrePageWidget> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F9F4),

      body: Stack(
        children: [
          SingleChildScrollView(
            padding: const EdgeInsets.only(bottom: 100),

            child: Column(
              crossAxisAlignment:
                  CrossAxisAlignment.stretch,
              children: [
                // Header
                Container(
                  padding: const EdgeInsets.fromLTRB(
                    24,
                    48,
                    24,
                    24,
                  ),
                  decoration: const BoxDecoration(
                    color: Color(0xFF2E7D32),
                    borderRadius: BorderRadius.only(
                      bottomLeft: Radius.circular(24),
                      bottomRight: Radius.circular(24),
                    ),
                  ),

                  child: Row(
                    mainAxisAlignment:
                        MainAxisAlignment.spaceBetween,
                    children: [
                      const Column(
                        crossAxisAlignment:
                            CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Grow Better',
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'Pre-harvest management & care',
                            style: TextStyle(
                              fontSize: 14,
                              color: Color(0xCCFFFFFF),
                            ),
                          ),
                        ],
                      ),

                      IconButton(
                        icon: const Icon(
                          Icons.notifications_active_rounded,
                          color: Colors.white,
                        ),
                        onPressed: () {},
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // Diagnostic Card
                Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 24),
                  child: Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius:
                          BorderRadius.circular(20),
                      border: Border.all(
                        color: const Color(0xFFC8E6C9),
                      ),
                      boxShadow: const [
                        BoxShadow(
                          color: Color(0x0D000000),
                          blurRadius: 8,
                          offset: Offset(0, 2),
                        ),
                      ],
                    ),

                    child: Column(
                      crossAxisAlignment:
                          CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              width: 60,
                              height: 60,
                              decoration: BoxDecoration(
                                color:
                                    Colors.red.withOpacity(0.1),
                                borderRadius:
                                    BorderRadius.circular(16),
                              ),
                              child: const Icon(
                                Icons.warning_amber_rounded,
                                color: Colors.red,
                                size: 32,
                              ),
                            ),

                            const SizedBox(width: 16),

                            const Expanded(
                              child: Column(
                                crossAxisAlignment:
                                    CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Diagnostic Result',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: Colors.grey,
                                      fontWeight:
                                          FontWeight.bold,
                                    ),
                                  ),
                                  SizedBox(height: 2),
                                  Text(
                                    'Early Blight Detected',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight:
                                          FontWeight.bold,
                                      color: Colors.red,
                                    ),
                                  ),
                                  SizedBox(height: 2),
                                  Text(
                                    '94% Confidence Match',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: Colors.grey,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 16),

                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color:
                                const Color(0xFFE8F5E9),
                            borderRadius:
                                BorderRadius.circular(12),
                            border: Border.all(
                              color:
                                  const Color(0xFFC8E6C9),
                            ),
                          ),

                          child: const Row(
                            children: [
                              Icon(
                                Icons.psychology_rounded,
                                color: Color(0xFF2E7D32),
                                size: 20,
                              ),
                              SizedBox(width: 10),

                              Expanded(
                                child: Text(
                                  'Apply Organic Neem Oil Spray and ensure 2m plant spacing.',
                                  style: TextStyle(
                                    fontSize: 13,
                                    color:
                                        Color(0xFF1B5E20),
                                    fontWeight:
                                        FontWeight.w500,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                // Today's Schedule
                Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    crossAxisAlignment:
                        CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment:
                            MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Today\'s Schedule',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF1B5E20),
                            ),
                          ),

                          TextButton(
                            onPressed: () {},
                            child: const Text(
                              'View Calendar',
                              style: TextStyle(
                                color: Color(0xFF2E7D32),
                                fontWeight:
                                    FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 12),

                      Row(
                        children: [
                          Expanded(
                            child: _buildScheduleCard(
                              'Drip Irrigation',
                              '06:00 AM',
                              '45 mins',
                              Icons.water_drop_rounded,
                              Colors.blue,
                            ),
                          ),

                          const SizedBox(width: 16),

                          Expanded(
                            child: _buildScheduleCard(
                              'NPK Booster',
                              '09:30 AM',
                              '250g/acre',
                              Icons.science_rounded,
                              Colors.green,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),

                // Matched Schemes
                Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    crossAxisAlignment:
                        CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Matched Schemes',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF1B5E20),
                        ),
                      ),

                      const SizedBox(height: 12),

                      _buildSchemeCard(
                        'PM-Kisan Samman Nidhi',
                        'Financial Aid',
                        'Direct Benefit',
                      ),

                      const SizedBox(height: 12),

                      _buildSchemeCard(
                        'Sub-Mission on Mechanization',
                        'Equipment',
                        '50% Subsidy',
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // AI Farm Doctor
          Positioned(
            bottom: 20,
            left: 24,
            right: 24,

            child: GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) =>
                        const AIConsultationPage(),
                  ),
                );
              },

              child: Container(
                padding:
                    const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 14,
                ),

                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius:
                      BorderRadius.circular(30),
                  border: Border.all(
                    color: const Color(0xFFC8E6C9),
                  ),
                  boxShadow: const [
                    BoxShadow(
                      color: Colors.black12,
                      blurRadius: 10,
                      offset: Offset(0, 4),
                    ),
                  ],
                ),

                child: const Row(
                  children: [
                    CircleAvatar(
                      radius: 18,
                      backgroundColor:
                          Color(0xFF2E7D32),
                      child: Icon(
                        Icons.smart_toy_rounded,
                        color: Colors.white,
                        size: 20,
                      ),
                    ),

                    SizedBox(width: 14),

                    Expanded(
                      child: Text(
                        'Ask AI Farm Doctor...',
                        style: TextStyle(
                          color: Colors.grey,
                          fontSize: 15,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),

                    Icon(
                      Icons.mic_rounded,
                      color: Color(0xFF2E7D32),
                      size: 22,
                    ),

                    SizedBox(width: 12),

                    Icon(
                      Icons.send_rounded,
                      color: Color(0xFF2E7D32),
                      size: 22,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildScheduleCard(
    String task,
    String time,
    String dosage,
    IconData icon,
    Color color,
  ) {
    return Container(
      padding: const EdgeInsets.all(16),

      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: const Color(0xFFC8E6C9),
        ),
      ),

      child: Column(
        crossAxisAlignment:
            CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment:
                MainAxisAlignment.spaceBetween,
            children: [
              Icon(
                icon,
                color: color,
                size: 24,
              ),

              Text(
                time,
                style: const TextStyle(
                  fontSize: 12,
                  color: Colors.grey,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),

          const SizedBox(height: 12),

          Text(
            task,
            style: const TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.bold,
              color: Color(0xFF1B5E20),
            ),
          ),

          const SizedBox(height: 4),

          Text(
            dosage,
            style: const TextStyle(
              fontSize: 13,
              color: Colors.grey,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSchemeCard(
    String name,
    String tag,
    String match,
  ) {
    return Container(
      padding: const EdgeInsets.all(16),

      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: const Color(0xFFC8E6C9),
        ),
      ),

      child: Row(
        mainAxisAlignment:
            MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment:
                  CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding:
                          const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 2,
                      ),

                      decoration: BoxDecoration(
                        color:
                            const Color(0xFFE8F5E9),
                        borderRadius:
                            BorderRadius.circular(6),
                      ),

                      child: Text(
                        tag,
                        style: const TextStyle(
                          fontSize: 11,
                          color: Color(0xFF2E7D32),
                          fontWeight:
                              FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 6),

                Text(
                  name,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF1B5E20),
                  ),
                ),
              ],
            ),
          ),

          Container(
            padding:
                const EdgeInsets.symmetric(
              horizontal: 10,
              vertical: 6,
            ),

            decoration: BoxDecoration(
              color:
                  const Color(0xFF2E7D32)
                      .withOpacity(0.1),
              borderRadius:
                  BorderRadius.circular(20),
            ),

            child: Text(
              match,
              style: const TextStyle(
                fontSize: 12,
                color: Color(0xFF2E7D32),
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }
}