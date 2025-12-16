
import 'package:flutter/material.dart';
import 'package:flutter_mobile/api/transaction_api.dart';
import 'package:flutter_mobile/widgets/yearly_summary_chart.dart';
import 'package:intl/intl.dart';

class AccountBalancePage extends StatefulWidget {
  const AccountBalancePage({super.key});

  @override
  State<AccountBalancePage> createState() => _AccountBalancePageState();
}

class _AccountBalancePageState extends State<AccountBalancePage> {
  late Future<List<YearTotal>> _balanceFuture;

  @override
  void initState() {
    super.initState();
    _balanceFuture = _fetchBalanceData();
  }

  Future<List<YearTotal>> _fetchBalanceData() async {
    // Simplified data fetching
    return TransactionAPI.fetchAllYearTotals();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return FutureBuilder<List<YearTotal>>(
      future: _balanceFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        } else if (snapshot.hasError) {
          return Center(child: Text('Error: ${snapshot.error}', style: TextStyle(color: theme.colorScheme.error)));
        } else if (snapshot.hasData) {
          final yearTotals = snapshot.data!;

          // Updated calculations
          final totalBalanceEUR = yearTotals.fold<double>(0, (sum, item) => sum + item.totalEUR);
          final totalBalanceVND = yearTotals.fold<double>(0, (sum, item) => sum + item.totalVND);

          final euroFormat = NumberFormat.currency(locale: 'de_DE', symbol: '€');
          final vndFormat = NumberFormat.currency(locale: 'vi_VN', symbol: '₫');

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // 1. Account Balance Container
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 32.0, vertical: 24.0),
                  decoration: BoxDecoration(
                    color: theme.cardColor,
                    borderRadius: BorderRadius.circular(16.0),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withAlpha((255 * 0.1).round()),
                        blurRadius: 8,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'Account Balance',
                        style: theme.textTheme.headlineMedium?.copyWith(color: theme.colorScheme.onSurface),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        euroFormat.format(totalBalanceEUR),
                        style: theme.textTheme.headlineSmall?.copyWith(color: theme.colorScheme.onSurface),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        vndFormat.format(totalBalanceVND),
                        style: theme.textTheme.headlineSmall?.copyWith(color: theme.textTheme.bodySmall?.color),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 32),
                // 2. Yearly Summary Chart (EUR)
                Text('Yearly Summary (EUR)', style: theme.textTheme.titleLarge),
                const SizedBox(height: 16),
                YearlySummaryChart(yearTotals: yearTotals, currency: ChartCurrency.eur),
                const SizedBox(height: 32),
                // 3. Yearly Summary Chart (VND)
                Text('Yearly Summary (VND)', style: theme.textTheme.titleLarge),
                const SizedBox(height: 16),
                YearlySummaryChart(yearTotals: yearTotals, currency: ChartCurrency.vnd),
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
