import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:io';

class ApiService {
  static const String baseUrl = "http://127.0.0.1:8000/api/ask";

  static Future<Map<String, dynamic>?> askKrishiRakshak({
    File? audioFile,
    File? imageFile,
    String? textQuery,
  }) async {
    var request = http.MultipartRequest('POST', Uri.parse(baseUrl));

    if (audioFile != null) {
      request.files.add(await http.MultipartFile.fromPath('voice_note', audioFile.path));
    }
    if (imageFile != null) {
      request.files.add(await http.MultipartFile.fromPath('crop_image', imageFile.path));
    }
    if (textQuery != null) {
      request.fields['text_query'] = textQuery;
    }

    try {
      var streamedResponse = await request.send();
      var response = await http.Response.fromStream(streamedResponse);
      if (response.statusCode == 200) {
        return json.decode(response.body);
      }
    } catch (e) {
      print("API Error: $e");
    }
    return null;
  }
}