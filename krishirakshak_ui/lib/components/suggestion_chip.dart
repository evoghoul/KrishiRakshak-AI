import 'package:flutter/material.dart';

class SuggestionChipWidget extends StatelessWidget {
  final String label;
  final VoidCallback? onTap;

  const SuggestionChipWidget({
    super.key,
    this.label = 'Soil testing near me',
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        height: 34,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: const Color(0xFFC8E6C9), width: 1), // Soft Sage Border
        ),
        alignment: Alignment.center,
        padding: const EdgeInsets.symmetric(horizontal: 12),
        child: Text(
          label,
          style: const TextStyle(
            color: Color(0xFF1B5E20), // Forest Green
            fontSize: 14,
            fontWeight: FontWeight.w600,
            height: 1.2,
          ),
        ),
      ),
    );
  }
}