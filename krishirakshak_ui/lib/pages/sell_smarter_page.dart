import 'package:flutter/material.dart';

class SellSmarterHarvestPageWidget extends StatefulWidget {
  const SellSmarterHarvestPageWidget({super.key});

  @override
  State<SellSmarterHarvestPageWidget> createState() =>
      _SellSmarterHarvestPageWidgetState();
}

class _SellSmarterHarvestPageWidgetState
    extends State<SellSmarterHarvestPageWidget> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F9F4),

      appBar: AppBar(
        title: const Text(
          'Sell Smarter',
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
      ),

      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),

        child: Column(
          crossAxisAlignment:
              CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Harvest & Market Insights',
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey,
                fontWeight: FontWeight.w600,
              ),
            ),

            const SizedBox(height: 16),

            Row(
              mainAxisAlignment:
                  MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Live Mandi Prices',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF1B5E20),
                  ),
                ),

                TextButton(
                  onPressed: () {},
                  child: const Text(
                    'View All',
                    style: TextStyle(
                      color: Color(0xFF2E7D32),
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 10),

            GridView.count(
              crossAxisCount: 2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              shrinkWrap: true,
              physics:
                  const NeverScrollableScrollPhysics(),
              childAspectRatio: 1.3,

              children: [
                _buildMandiCard(
                  'Azadpur Mandi',
                  '12 km',
                  '₹2,450/q',
                  true,
                ),
                _buildMandiCard(
                  'Ghazipur Market',
                  '18 km',
                  '₹2,380/q',
                  false,
                ),
                _buildMandiCard(
                  'Okhla Mandi',
                  '24 km',
                  '₹2,510/q',
                  true,
                ),
                _buildMandiCard(
                  'Narela Mandi',
                  '35 km',
                  '₹2,420/q',
                  true,
                ),
              ],
            ),

            const SizedBox(height: 24),

            // Community Pooling
            Container(
              padding: const EdgeInsets.all(20),

              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius:
                    BorderRadius.circular(16),
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
                  const Row(
                    children: [
                      Icon(
                        Icons.groups_rounded,
                        color: Color(0xFF2E7D32),
                      ),
                      SizedBox(width: 8),
                      Text(
                        'Community Pooling',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF1B5E20),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 12),

                  const Row(
                    mainAxisAlignment:
                        MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Village Pool: Chili',
                        style: TextStyle(
                          fontWeight:
                              FontWeight.w600,
                          color: Colors.black87,
                        ),
                      ),
                      Text(
                        '18/25 Tons',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF2E7D32),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 10),

                  ClipRRect(
                    borderRadius:
                        BorderRadius.circular(4),

                    child:
                        const LinearProgressIndicator(
                      value: 0.72,
                      minHeight: 8,
                      backgroundColor:
                          Color(0xFFE8F5E9),
                      valueColor:
                          AlwaysStoppedAnimation<Color>(
                        Color(0xFF4CAF50),
                      ),
                    ),
                  ),

                  const SizedBox(height: 10),

                  const Row(
                    children: [
                      Icon(
                        Icons.auto_awesome_rounded,
                        color: Color(0xFF4CAF50),
                        size: 16,
                      ),
                      SizedBox(width: 6),
                      Text(
                        'Target unlock rate: +12% price',
                        style: TextStyle(
                          fontSize: 12,
                          color: Color(0xFF2E7D32),
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            const Text(
              'Direct Buyers Nearby',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Color(0xFF1B5E20),
              ),
            ),

            const SizedBox(height: 12),

            _buildBuyerCard(
              'Green Earth Exports',
              '4.2 km away',
              '₹2,600 / quintal',
            ),

            const SizedBox(height: 10),

            _buildBuyerCard(
              'Kisan Direct Corp',
              '7.5 km away',
              '₹2,580 / quintal',
            ),

            const SizedBox(height: 10),

            _buildBuyerCard(
              'Fresh-to-Home Ltd',
              '10.1 km away',
              '₹2,650 / quintal',
            ),

            const SizedBox(height: 24),

            const Text(
              'Available Logistics',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Color(0xFF1B5E20),
              ),
            ),

            const SizedBox(height: 12),

            SizedBox(
              height: 110,

              child: ListView(
                scrollDirection: Axis.horizontal,
                children: [
                  _buildLogisticsCard(
                    'Mini Truck',
                    '₹450 / q',
                    'in 2 hrs',
                    Icons.local_shipping_rounded,
                  ),

                  const SizedBox(width: 12),

                  _buildLogisticsCard(
                    'Tractor Trolley',
                    '₹300 / q',
                    'at 4 PM',
                    Icons.agriculture_rounded,
                  ),

                  const SizedBox(width: 12),

                  _buildLogisticsCard(
                    'Pickup Van',
                    '₹500 / q',
                    'Tomorrow',
                    Icons.airport_shuttle_rounded,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _buildMandiCard(
    String market,
    String dist,
    String rate,
    bool isUp,
  ) {
    return Container(
      padding: const EdgeInsets.all(12),

      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius:
            BorderRadius.circular(14),
        border: Border.all(
          color: const Color(0xFFC8E6C9),
        ),
      ),

      child: Column(
        crossAxisAlignment:
            CrossAxisAlignment.start,
        mainAxisAlignment:
            MainAxisAlignment.center,
        children: [
          Text(
            market,
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 13,
              color: Color(0xFF1B5E20),
            ),
          ),

          const SizedBox(height: 2),

          Text(
            dist,
            style: const TextStyle(
              fontSize: 11,
              color: Colors.grey,
            ),
          ),

          const Spacer(),

          Row(
            mainAxisAlignment:
                MainAxisAlignment.spaceBetween,
            children: [
              Text(
                rate,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 13,
                  color: Colors.black87,
                ),
              ),

              Icon(
                isUp
                    ? Icons.trending_up_rounded
                    : Icons.trending_down_rounded,
                color:
                    isUp ? Colors.green : Colors.red,
                size: 18,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBuyerCard(
    String name,
    String dist,
    String price,
  ) {
    return Container(
      padding: const EdgeInsets.all(16),

      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius:
            BorderRadius.circular(14),
        border: Border.all(
          color: const Color(0xFFE0E0E0),
        ),
      ),

      child: Row(
        mainAxisAlignment:
            MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment:
                CrossAxisAlignment.start,
            children: [
              Text(
                name,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 15,
                  color: Color(0xFF1B5E20),
                ),
              ),

              const SizedBox(height: 4),

              Text(
                dist,
                style: const TextStyle(
                  fontSize: 12,
                  color: Colors.grey,
                ),
              ),

              const SizedBox(height: 2),

              Text(
                price,
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: Colors.green,
                ),
              ),
            ],
          ),

          ElevatedButton(
            onPressed: () {},

            style: ElevatedButton.styleFrom(
              backgroundColor:
                  const Color(0xFF2E7D32),
              foregroundColor: Colors.white,
              padding:
                  const EdgeInsets.symmetric(
                horizontal: 16,
                vertical: 8,
              ),
              shape:
                  RoundedRectangleBorder(
                borderRadius:
                    BorderRadius.circular(8),
              ),
            ),

            child: const Text(
              'Contact',
              style: TextStyle(fontSize: 12),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLogisticsCard(
    String vehicle,
    String cost,
    String time,
    IconData icon,
  ) {
    return Container(
      width: 150,
      padding: const EdgeInsets.all(14),

      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius:
            BorderRadius.circular(14),
        border: Border.all(
          color: const Color(0xFFC8E6C9),
        ),
      ),

      child: Column(
        crossAxisAlignment:
            CrossAxisAlignment.start,
        mainAxisAlignment:
            MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            color: const Color(0xFF2E7D32),
            size: 22,
          ),

          const SizedBox(height: 6),

          Text(
            vehicle,
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 13,
              color: Color(0xFF1B5E20),
            ),
          ),

          const SizedBox(height: 2),

          Text(
            cost,
            style: const TextStyle(
              fontSize: 12,
              color: Colors.grey,
            ),
          ),

          const SizedBox(height: 2),

          Text(
            time,
            style: const TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: Colors.green,
            ),
          ),
        ],
      ),
    );
  }
}