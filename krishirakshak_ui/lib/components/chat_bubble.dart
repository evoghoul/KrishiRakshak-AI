import 'package:flutter/material.dart';

class ChatBubbleWidget extends StatelessWidget {
  final bool isAi;
  final String message;
  final String time;

  const ChatBubbleWidget({
    super.key,
    this.isAi = false,
    this.message = 'Namaste! I am your AI Farm Assistant. How can I help you with your crops or soil health today?',
    this.time = '10:00 AM',
  });

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: isAi ? Alignment.centerLeft : Alignment.centerRight,
      child: Container(
        constraints: const BoxConstraints(maxWidth: 280),
        margin: const EdgeInsets.symmetric(vertical: 6),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isAi ? const Color(0xFFE8F5E9) : const Color(0xFF2E7D32), // Soft mint for AI, Forest Green for User
          borderRadius: BorderRadius.circular(16),
          boxShadow: const [
            BoxShadow(
              color: Colors.black12,
              blurRadius: 4,
              offset: Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              message,
              style: TextStyle(
                color: isAi ? const Color(0xFF1B5E20) : Colors.white,
                fontSize: 14,
                height: 1.4,
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              time,
              style: TextStyle(
                color: isAi ? Colors.grey[600] : Colors.white70,
                fontSize: 10,
              ),
            ),
          ],
        ),
      ),
    );
  }
}