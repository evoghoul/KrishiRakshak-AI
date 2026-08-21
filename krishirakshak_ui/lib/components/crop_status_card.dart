import 'package:flutter/material.dart';

class CropStatusCardWidget extends StatelessWidget {
  final String crop;
  final String health;
  final String statusColor;

  const CropStatusCardWidget({
    super.key,
    this.crop = '',
    this.health = '',
    this.statusColor = 'success',
  });

  Color _getStatusColor() {
    switch (statusColor.toLowerCase()) {
      case 'warning':
        return Colors.orange;
      case 'info':
        return Colors.blue;
      case 'success':
      default:
        return Colors.green;
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = _getStatusColor();

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
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      crop,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF1B5E20),
                        height: 1.4,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      health,
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: color,
                      ),
                    ),
                  ],
                ),
                const Icon(
                  Icons.chevron_right_rounded,
                  color: Colors.grey,
                  size: 24,
                ),
              ],
            ),
            const SizedBox(height: 12),
            ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: statusColor.toLowerCase() == 'warning' ? 0.65 : 0.92,
                minHeight: 8,
                backgroundColor: const Color(0xFFE8F5E9),
                valueColor: AlwaysStoppedAnimation<Color>(color),
              ),
            ),
          ],
        ),
      ),
    );
  }
}