import 'package:flutter/material.dart';
import '../services/api_service.dart';

class AIConsultationPage extends StatefulWidget {
  const AIConsultationPage({super.key});

  @override
  State<AIConsultationPage> createState() =>
      _AIConsultationPageState();
}

class _AIConsultationPageState
    extends State<AIConsultationPage> {
  final TextEditingController _textController =
      TextEditingController();

  final List<Map<String, dynamic>> _messages = [
    {
      "isAi": true,
      "text":
          "Namaste! I am your AI Farm Assistant. How can I help with your crops today?"
    }
  ];

  bool _isLoading = false;

  Future<void> _sendMessage() async {
    final userText = _textController.text.trim();

    if (userText.isEmpty || _isLoading) {
      return;
    }

    setState(() {
      _messages.add({
        "isAi": false,
        "text": userText,
      });

      _isLoading = true;
    });

    _textController.clear();

    try {
      final response =
          await ApiService.askKrishiRakshak(
        textQuery: userText,
      );

      if (!mounted) return;

      setState(() {
        _isLoading = false;

        if (response != null) {
          final advice =
              response['ai_advice_text'];

          _messages.add({
            "isAi": true,
            "text": advice?.toString() ??
                "I received a response, but there was no advice text.",
          });
        } else {
          _messages.add({
            "isAi": true,
            "text":
                "Sorry, I couldn't connect to the Farm Intelligence server.",
          });
        }
      });
    } catch (e) {
      if (!mounted) return;

      setState(() {
        _isLoading = false;

        _messages.add({
          "isAi": true,
          "text":
              "Sorry, something went wrong while contacting the Farm Intelligence server.",
        });
      });
    }
  }

  @override
  void dispose() {
    _textController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F9F4),

      appBar: AppBar(
        title: const Text(
          "KrishiRakshak AI",
          style: TextStyle(
            color: Colors.white,
          ),
        ),
        backgroundColor: const Color(0xFF2E7D32),
      ),

      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding:
                  const EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder:
                  (context, index) {
                final msg = _messages[index];

                return _buildChatBubble(
                  msg['text']?.toString() ?? '',
                  msg['isAi'] == true,
                );
              },
            ),
          ),

          if (_isLoading)
            const Padding(
              padding: EdgeInsets.all(8.0),
              child: CircularProgressIndicator(
                color: Color(0xFF2E7D32),
              ),
            ),

          _buildInputArea(),
        ],
      ),
    );
  }

  Widget _buildChatBubble(
    String text,
    bool isAi,
  ) {
    return Align(
      alignment: isAi
          ? Alignment.centerLeft
          : Alignment.centerRight,

      child: Container(
        constraints: const BoxConstraints(
          maxWidth: 320,
        ),

        margin:
            const EdgeInsets.symmetric(
          vertical: 5,
        ),

        padding:
            const EdgeInsets.all(12),

        decoration: BoxDecoration(
          color: isAi
              ? const Color(0xFFE8F5E9)
              : const Color(0xFF2E7D32),

          borderRadius:
              BorderRadius.circular(12),
        ),

        child: Text(
          text,
          style: TextStyle(
            color: isAi
                ? Colors.black
                : Colors.white,
          ),
        ),
      ),
    );
  }

  Widget _buildInputArea() {
    return Container(
      padding:
          const EdgeInsets.all(16),
      color: Colors.white,

      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller:
                  _textController,

              textInputAction:
                  TextInputAction.send,

              onSubmitted: (_) =>
                  _sendMessage(),

              decoration:
                  const InputDecoration(
                hintText:
                    "Ask in Telugu, Hindi, or English...",
                border:
                    OutlineInputBorder(),
              ),
            ),
          ),

          const SizedBox(width: 8),

          IconButton(
            icon: const Icon(
              Icons.send,
              color: Color(0xFF2E7D32),
            ),
            onPressed:
                _isLoading
                    ? null
                    : _sendMessage,
          ),
        ],
      ),
    );
  }
}