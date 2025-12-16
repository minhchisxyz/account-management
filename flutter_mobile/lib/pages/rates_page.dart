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
  late Future<Map<String, dynamic>> _dataFuture;
  final _amountController = TextEditingController();
  double _convertedAmount = 0.0;
  double _currentRate = 0.0;

  @override
  void initState() {
    super.initState();
    _dataFuture = _fetchData();
    _amountController.text = '1'; // Set default value
    _amountController.addListener(_convertAmount);
  }

  Future<Map<String, dynamic>> _fetchData() async {
    final results = await Future.wait([
      CurrencyExchangeRateAPI.fetchAllRates(filter: 7),
      CurrencyExchangeRateAPI.fetchTodayRate(),
    ]);

    // Set the initial converted amount once the rate is fetched
    final rate = results[1] as double;
    final initialAmount = double.tryParse(_amountController.text) ?? 0.0;
    _convertedAmount = initialAmount * rate;

    return {
      'rates': results[0] as List<CurrencyExchangeRate>,
      'rate': rate,
    };
  }

  void _convertAmount() {
    final amount = double.tryParse(_amountController.text) ?? 0.0;
    setState(() {
      _convertedAmount = amount * _currentRate;
    });
  }

  @override
  void dispose() {
    _amountController.removeListener(_convertAmount);
    _amountController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final vndFormat = NumberFormat.currency(locale: 'vi_VN', symbol: '₫');

    return FutureBuilder<Map<String, dynamic>>(
      future: _dataFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        } else if (snapshot.hasError) {
          return Center(child: Text('Error: ${snapshot.error}', style: const TextStyle(color: Colors.red)));
        } else if (snapshot.hasData) {
          final rates = snapshot.data!['rates'] as List<CurrencyExchangeRate>;
          _currentRate = snapshot.data!['rate'] as double;

          return Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                SizedBox(
                  height: MediaQuery.of(context).size.height * 0.4,
                  child: RateChart(rates: rates),
                ),
                const SizedBox(height: 24),
                Text('Quick Conversion', style: theme.textTheme.titleLarge),
                const SizedBox(height: 16),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: TextFormField(
                        controller: _amountController,
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        decoration: const InputDecoration(
                          labelText: 'Amount in EUR',
                          border: OutlineInputBorder(),
                          prefixText: '€ ',
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: InputDecorator(
                        decoration: const InputDecoration(
                          labelText: 'Converted Amount',
                          border: OutlineInputBorder(),
                        ),
                        child: Text(
                          vndFormat.format(_convertedAmount),
                          style: theme.textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          );
        } else {
          return const Center(child: Text('No data available'));
        }
      },
    );
  }
}
