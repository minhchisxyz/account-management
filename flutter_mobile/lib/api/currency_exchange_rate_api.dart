import 'dart:convert';

import 'package:flutter_mobile/env/env.dart';
import 'package:http/http.dart' as http;

class CurrencyExchangeRateAPI {
  static const baseUrl = '${Env.baseUrl}/api/rates';

  static Map<String, String> get _headers {
    final credentials = base64Encode(utf8.encode('${Env.username}:${Env.password}'));
    return {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Basic $credentials',
    };
  }

  static Future<List<CurrencyExchangeRate>> fetchAllRates({int? filter}) async {
    final url = filter == null
        ? Uri.parse(baseUrl)
        : Uri.parse('$baseUrl?filter=$filter');
    final response = await http.get(url, headers: _headers);

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      final List<CurrencyExchangeRate> rates = data.map((json) => CurrencyExchangeRate.fromJson(json)).toList();
      return rates;
    } else {
      throw Exception('Failed to load rates');
    }
  }

  static Future<double> fetchTodayRate() async {
    final response = await http.get(Uri.parse('$baseUrl?today=true'), headers: _headers);

    if (response.statusCode == 200) {
      // Decode as JSON first to handle cases where the body is a JSON-encoded string (e.g. "32123")
      final dynamic data = json.decode(response.body);
      return double.parse(data.toString());
    } else {
      throw Exception('Failed to load today\'s rate');
    }
  }
}

class CurrencyExchangeRate {
  final DateTime date;
  final double rate;

  const CurrencyExchangeRate({
    required this.date,
    required this.rate,
  });

  factory CurrencyExchangeRate.fromJson(Map<String, dynamic> json) {
    return CurrencyExchangeRate(
      date: DateTime.parse(json['date']),
      rate: double.parse(json['rate'].toString()),
    );
  }
}
