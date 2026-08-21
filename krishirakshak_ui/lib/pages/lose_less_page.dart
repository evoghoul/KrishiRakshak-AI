import 'package:flutter/material.dart';

class HeroLoseLessPageWidget extends StatefulWidget {
  const HeroLoseLessPageWidget({super.key});

  @override
  State<HeroLoseLessPageWidget> createState() =>
      _HeroLoseLessPageWidgetState();
}

class _HeroLoseLessPageWidgetState
    extends State<HeroLoseLessPageWidget> {
  bool _isBreakdownExpanded = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F9F4),

      appBar: AppBar(
        title: const Text(
          'KrishiRakshak Decision Engine',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        backgroundColor: const Color(0xFF2E7D32),
        elevation: 0,
        iconTheme: const IconThemeData(
          color: Colors.white,
        ),
        actions: [
          IconButton(
            icon: const Icon(
              Icons.account_circle_rounded,
            ),
            onPressed: () {},
          ),
        ],
      ),

      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),

        child: Column(
          crossAxisAlignment:
              CrossAxisAlignment.stretch,
          children: [
            // Input Summary
            Container(
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
                    mainAxisAlignment:
                        MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Input Summary',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF1B5E20),
                        ),
                      ),

                      Container(
                        padding:
                            const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color:
                              const Color(0xFFE8F5E9),
                          borderRadius:
                              BorderRadius.circular(8),
                        ),
                        child: const Text(
                          'Tomato',
                          style: TextStyle(
                            color:
                                Color(0xFF2E7D32),
                            fontWeight:
                                FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 16),

                  GridView.count(
                    crossAxisCount: 2,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    shrinkWrap: true,
                    physics:
                        const NeverScrollableScrollPhysics(),
                    childAspectRatio: 2.2,

                    children: [
                      _buildParamChip(
                        Icons.inventory_2_rounded,
                        'Volume',
                        '50 Quintals',
                      ),
                      _buildParamChip(
                        Icons.calendar_today_rounded,
                        'Harvested',
                        'Today',
                      ),
                      _buildParamChip(
                        Icons.payments_rounded,
                        'Current Price',
                        '₹1,200/Q',
                      ),
                      _buildParamChip(
                        Icons.trending_up_rounded,
                        'Exp. Price (3d)',
                        '₹1,650/Q',
                      ),
                      _buildParamChip(
                        Icons.thermostat_rounded,
                        'Storage Temp',
                        '32°C',
                      ),
                      _buildParamChip(
                        Icons.warning_rounded,
                        'Spoilage Risk',
                        'High 45%',
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Recommended Action
            Container(
              padding: const EdgeInsets.all(24),

              decoration: BoxDecoration(
                color: const Color(0xFF2E7D32),
                borderRadius:
                    BorderRadius.circular(20),
                boxShadow: const [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 10,
                    offset: Offset(0, 4),
                  ),
                ],
              ),

              child: const Column(
                children: [
                  Text(
                    'RECOMMENDED ACTION',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: Color(0xCCFFFFFF),
                      letterSpacing: 1.2,
                    ),
                  ),

                  SizedBox(height: 8),

                  Text(
                    'STORE FOR 2 DAYS IN COLD STORAGE',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w900,
                      color: Colors.white,
                      height: 1.3,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Financial Breakdown
            Container(
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
                children: [
                  ListTile(
                    title: const Row(
                      children: [
                        Icon(
                          Icons.psychology_rounded,
                          color: Color(0xFF2E7D32),
                        ),
                        SizedBox(width: 8),
                        Text(
                          'Financial Breakdown (WHY?)',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF1B5E20),
                          ),
                        ),
                      ],
                    ),

                    trailing: IconButton(
                      icon: Icon(
                        _isBreakdownExpanded
                            ? Icons.expand_less_rounded
                            : Icons.expand_more_rounded,
                      ),

                      onPressed: () {
                        setState(() {
                          _isBreakdownExpanded =
                              !_isBreakdownExpanded;
                        });
                      },
                    ),
                  ),

                  if (_isBreakdownExpanded) ...[
                    const Divider(height: 1),

                    Padding(
                      padding:
                          const EdgeInsets.all(16.0),

                      child: Column(
                        children: [
                          _buildBreakdownRow(
                            'Storage cost (2 days)',
                            '- ₹4,000',
                            Colors.red,
                          ),

                          const SizedBox(height: 12),

                          _buildBreakdownRow(
                            'Expected price gain',
                            '+ ₹22,500',
                            Colors.green,
                          ),

                          const Divider(height: 24),

                          _buildBreakdownRow(
                            'Net Profit Increase',
                            '+ ₹18,500',
                            Colors.green,
                            isBold: true,
                          ),

                          const SizedBox(height: 16),

                          Container(
                            padding:
                                const EdgeInsets.all(12),

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
                                  Icons.volume_up_rounded,
                                  color:
                                      Color(0xFF2E7D32),
                                  size: 20,
                                ),

                                SizedBox(width: 10),

                                Expanded(
                                  child: Text(
                                    'Listen to explanation: Even after factoring 5% spoilage risk, cold storage maximizes your returns.',
                                    style: TextStyle(
                                      fontSize: 12,
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
                  ],
                ],
              ),
            ),

            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _buildParamChip(
    IconData icon,
    String label,
    String value,
  ) {
    return Container(
      padding: const EdgeInsets.all(10),

      decoration: BoxDecoration(
        color: const Color(0xFFF4F9F4),
        borderRadius:
            BorderRadius.circular(10),
        border: Border.all(
          color: const Color(0xFFE0E0E0),
        ),
      ),

      child: Row(
        children: [
          Icon(
            icon,
            size: 16,
            color: const Color(0xFF2E7D32),
          ),

          const SizedBox(width: 8),

          Expanded(
            child: Column(
              crossAxisAlignment:
                  CrossAxisAlignment.start,
              mainAxisAlignment:
                  MainAxisAlignment.center,
              children: [
                Text(
                  label,
                  style: const TextStyle(
                    fontSize: 11,
                    color: Colors.grey,
                  ),
                ),

                Text(
                  value,
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF1B5E20),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBreakdownRow(
    String label,
    String value,
    Color color, {
    bool isBold = false,
  }) {
    return Row(
      mainAxisAlignment:
          MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 14,
            color: isBold
                ? const Color(0xFF1B5E20)
                : Colors.black87,
            fontWeight: isBold
                ? FontWeight.bold
                : FontWeight.normal,
          ),
        ),

        Text(
          value,
          style: TextStyle(
            fontSize: 14,
            color: color,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }
}