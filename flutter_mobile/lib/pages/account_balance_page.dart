import 'package:flutter/material.dart';
import 'package:flutter_mobile/api/currency_exchange_rate_api.dart';
import 'package:flutter_mobile/api/transaction_api.dart';
import 'package:intl/intl.dart';

class AccountBalancePage extends StatefulWidget {
  const AccountBalancePage({super.key});

  @override
  State<AccountBalancePage> createState() => _AccountBalancePageState();
}

class _AccountBalancePageState extends State<AccountBalancePage> {
  late Future<Map<String, dynamic>> _balanceFuture;

  @override
  void initState() {
    super.initState();
    _balanceFuture = _fetchBalanceData();
  }

  Future<Map<String, dynamic>> _fetchBalanceData() async {
    final yearTotals = await TransactionAPI.fetchAllYearTotals();
    final rate = await CurrencyExchangeRateAPI.fetchTodayRate();
    return {'yearTotals': yearTotals, 'rate': rate};
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Center(
      child: FutureBuilder<Map<String, dynamic>>(
        future: _balanceFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const CircularProgressIndicator();
          } else if (snapshot.hasError) {
            return Text('Error: ${snapshot.error}', style: TextStyle(color: theme.colorScheme.error));
          } else if (snapshot.hasData) {
            final yearTotals = snapshot.data!['yearTotals'] as List<YearTotal>;
            final rate = snapshot.data!['rate'] as double;

            final totalBalance = yearTotals.fold<double>(0, (sum, item) => sum + item.total);
            final totalBalanceVND = totalBalance * rate;

            final euroFormat = NumberFormat.currency(locale: 'de_DE', symbol: '€');
            final vndFormat = NumberFormat.currency(locale: 'vi_VN', symbol: '₫');

            return Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'Account Balance',
                  style: theme.textTheme.headlineMedium?.copyWith(color: theme.colorScheme.onSurface),
                ),
                const SizedBox(height: 16),
                Text(
                  euroFormat.format(totalBalance),
                  style: theme.textTheme.headlineSmall?.copyWith(color: theme.colorScheme.onSurface),
                ),
                const SizedBox(height: 8),
                Text(
                  vndFormat.format(totalBalanceVND),
                  style: theme.textTheme.headlineSmall?.copyWith(color: theme.textTheme.bodySmall?.color),
                ),
              ],
            );
          } else {
            return const Text('No data available');
          }
        },
      ),
    );
  }
}
