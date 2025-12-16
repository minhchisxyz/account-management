import 'package:flutter/material.dart';
import 'package:flutter_mobile/api/currency_exchange_rate_api.dart';
import 'package:flutter_mobile/widgets/chart.dart';
import 'package:intl/intl.dart';

class RatesPage extends StatefulWidget {
  const RatesPage({super.key});

  @override
  State<RatesPage> createState() => _RatesPageState();
}

class _RatesPageState extends State<RatesPage> {
  late Future<List<CurrencyExchangeRate>> _ratesFuture;

  @override
  void initState() {
    super.initState();
    _ratesFuture = _fetchRates();
  }

  Future<List<CurrencyExchangeRate>> _fetchRates() {
    return CurrencyExchangeRateAPI.fetchAllRates(filter: 7);
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: FutureBuilder<List<CurrencyExchangeRate>>(
        future: _ratesFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const CircularProgressIndicator();
          } else if (snapshot.hasError) {
            return Text('Error: ${snapshot.error}', style: const TextStyle(color: Colors.red));
          } else if (snapshot.hasData) {
            final rates = snapshot.data!;
            return RateChart(rates: rates);
          } else {
            return const Text('No data available', style: TextStyle(color: Colors.white));
          }
        },
      ),
    );
  }
}
