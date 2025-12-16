import 'dart:convert';

import 'package:flutter_mobile/env/env.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';

class TransactionAPI {
  static const baseUrl = '${Env.baseUrl}/api/transactions';

  static Map<String, String> get _headers {
    final credentials = base64Encode(utf8.encode('${Env.username}:${Env.password}'));
    return {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Basic $credentials',
    };
  }

  static Future<void> createTransaction({
    required double amount,
    required String description,
    required DateTime date,
  }) async {
    final response = await http.post(
      Uri.parse(baseUrl),
      headers: _headers,
      body: jsonEncode(<String, dynamic>{
        'amount': amount,
        'description': description,
        'date': DateFormat('yyyy-MM-dd').format(date),
      }),
    );

    if (response.statusCode != 201 && response.statusCode != 200) {
      throw Exception('Failed to create transaction: ${response.body}');
    }
  }

  static Future<Transaction> getTransaction(int id) async {
    final response = await http.get(Uri.parse('$baseUrl/$id'), headers: _headers);

    if (response.statusCode == 200) {
      return Transaction.fromJson(json.decode(response.body));
    } else {
      throw Exception('Failed to load transaction');
    }
  }

  static Future<void> updateTransaction({
    required int id,
    required double amount,
    required String description,
    required DateTime date,
  }) async {
    final response = await http.put(
      Uri.parse('$baseUrl/$id'),
      headers: _headers,
      body: jsonEncode(<String, dynamic>{
        'amount': amount,
        'description': description,
        'date': DateFormat('yyyy-MM-dd').format(date),
      }),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to update transaction: ${response.body}');
    }
  }

  static Future<void> deleteTransaction(int id) async {
    final response = await http.delete(
      Uri.parse('$baseUrl/$id'),
      headers: _headers,
    );

    if (response.statusCode != 200 && response.statusCode != 204) {
      throw Exception('Failed to delete transaction');
    }
  }

  static Future<List<int>> fetchAllYears() async {
    final response = await http.get(Uri.parse('$baseUrl/years'), headers: _headers);

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data.map((year) => int.parse(year.toString())).toList();
    } else {
      throw Exception('Failed to load years');
    }
  }

  static Future<List<YearTotal>> fetchAllYearTotals() async {
    final response = await http.get(Uri.parse('$baseUrl/years?total=true'), headers: _headers);

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data.map((json) => YearTotal.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load year totals');
    }
  }

  static Future<List<int>> fetchAllMonths(int year) async {
    final response = await http.get(Uri.parse('$baseUrl/years/$year'), headers: _headers);

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data.map((month) => int.parse(month.toString())).toList();
    } else {
      throw Exception('Failed to load months for year $year');
    }
  }

  static Future<List<MonthTotal>> fetchAllMonthTotals(int year) async {
    final response = await http.get(Uri.parse('$baseUrl/years/$year?total=true'), headers: _headers);

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data.map((json) => MonthTotal.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load month totals for year $year');
    }
  }

  static Future<List<Transaction>> fetchAllTransactions(int year, int month) async {
    final response = await http.get(Uri.parse('$baseUrl/years/$year/months/$month'), headers: _headers);

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data.map((json) => Transaction.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load transactions for $year-$month');
    }
  }
}

class YearTotal {
  final int year;
  final double total;

  const YearTotal({required this.year, required this.total});

  factory YearTotal.fromJson(Map<String, dynamic> json) {
    return YearTotal(
      year: int.parse(json['year'].toString()),
      total: double.parse(json['total'].toString()),
    );
  }
}

class MonthTotal {
  final int month;
  final double total;

  const MonthTotal({required this.month, required this.total});

  factory MonthTotal.fromJson(Map<String, dynamic> json) {
    return MonthTotal(
      month: int.parse(json['month'].toString()),
      total: double.parse(json['total'].toString()),
    );
  }
}

class Transaction {
  final int id;
  final double amount;
  final String description;
  final DateTime date;

  const Transaction({
    required this.id,
    required this.amount,
    required this.description,
    required this.date,
  });

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      id: int.parse(json['id'].toString()),
      amount: double.parse(json['amount'].toString()),
      description: json['description'],
      date: DateTime.parse(json['date']),
    );
  }
}
