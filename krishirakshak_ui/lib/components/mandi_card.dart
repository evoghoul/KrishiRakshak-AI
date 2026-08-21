import 'package:flutter/material.dart';

class MandiCardWidget extends StatelessWidget {
  final String market;
  final String dist;
  final String rate;
  final bool up;

  const MandiCardWidget({
    super.key,
    this.market = 'Azadpur Mandi',
    this.dist = '12',
    this.rate = '2,450',
    this.up = true,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: const Color(0xFFC8E6C9),
          width: 1,
        ),
        boxShadow: const [
          BoxShadow(
            color: Colors.black12, // Updated
            blurRadius: 6,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  market,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF1B5E20),
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  '$dist km away',
                  style: const TextStyle(
                    fontSize: 12,
                    color: Colors.grey,
                  ),
                ),
              ],
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Text(
                  '₹$rate',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF2E7D32),
                  ),
                ),
                Icon(
                  up ? Icons.trending_up_rounded : Icons.trending_down_rounded,
                  color: up ? Colors.green : Colors.red,
                  size: 20,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}