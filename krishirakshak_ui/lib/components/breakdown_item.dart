import 'package:flutter/material.dart';

class BreakdownItemWidget extends StatelessWidget {
  final Widget? icon;
  final Color color;
  final String label;
  final String value;

  const BreakdownItemWidget({
    super.key,
    this.icon,
    this.color = Colors.red,
    this.label = 'Storage cost (2 days)',
    this.value = '- ₹4,000',
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (icon != null) ...[
              icon!,
              const SizedBox(width: 8),
            ],
            Text(
              label,
              style: const TextStyle(
                fontSize: 14,
                color: Colors.black87,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
      ],
    );
  }
}