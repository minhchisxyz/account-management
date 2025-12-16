import 'dart:convert';

import 'package:flutter_mobile/env/env.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';

class AIAPI {
  static const baseUrl = '${Env.baseUrl}/api/ai';

  static Map<String, String> get _headers {
    final credentials = base64Encode(utf8.encode('${Env.username}:${Env.password}'));
    return {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Basic $credentials',
    };
  }

  static Future<ConvertedTransaction> convert({required String prompt}) async {
    final response = await http.post(
      Uri.parse(baseUrl),
      headers: _headers,
      body: jsonEncode(<String, String>{
        'prompt': prompt,
      }),
    );

    if (response.statusCode == 200) {
      return ConvertedTransaction.fromJson(json.decode(response.body));
    } else {
      throw Exception('Failed to convert prompt to transaction: ${response.body}');
    }
  }
}

class ConvertedTransaction {
  final double amount;
  final String description;
  final DateTime date;

  const ConvertedTransaction({
    required this.amount,
    required this.description,
    required this.date,
  });

  factory ConvertedTransaction.fromJson(Map<String, dynamic> json) {
    return ConvertedTransaction(
      amount: double.parse(json['amount'].toString()),
      description: json['description'],
      date: DateFormat('yyyy-MM-dd').parse(json['date']),
    );
  }
}
