import 'package:flutter/material.dart';
import 'package:flutter_mobile/api/currency_exchange_rate_api.dart';
import 'package:flutter_mobile/api/transaction_api.dart';
import 'package:flutter_mobile/widgets/monthly_summary_chart.dart';
import 'package:intl/intl.dart';

class YearPage extends StatefulWidget {
  final int year;
  final Function(int month) onNavigateToMonth;

  const YearPage({super.key, required this.year, required this.onNavigateToMonth});

  @override
  State<YearPage> createState() => _YearPageState();
}

class _YearPageState extends State<YearPage> {
  Future<Map<String, dynamic>>? _dataFuture;

  @override
  void initState() {
    super.initState();
    _dataFuture = _fetchData();
  }

  @override
  void didUpdateWidget(YearPage oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.year != oldWidget.year) {
      setState(() {
        _dataFuture = _fetchData();
      });
    }
  }

  Future<Map<String, dynamic>> _fetchData() async {
    final monthTotals = await TransactionAPI.fetchAllMonthTotals(widget.year);
    final rate = await CurrencyExchangeRateAPI.fetchTodayRate();
    return {'monthTotals': monthTotals, 'rate': rate};
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return FutureBuilder<Map<String, dynamic>>(
      future: _dataFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        } else if (snapshot.hasError) {
          return Center(child: Text('Error: ${snapshot.error}', style: TextStyle(color: theme.colorScheme.error)));
        } else if (snapshot.hasData) {
          final monthTotals = snapshot.data!['monthTotals'] as List<MonthTotal>;
          final rate = snapshot.data!['rate'] as double;
          final euroFormat = NumberFormat.currency(locale: 'de_DE', symbol: '€');
          final vndFormat = NumberFormat.currency(locale: 'vi_VN', symbol: '₫');
          final positiveColor = theme.brightness == Brightness.dark ? Colors.greenAccent : Colors.green.shade800;
          final negativeColor = theme.colorScheme.error;

          // FIX: Added the SingleChildScrollView back to prevent overflow
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // --- CHARTS ---
                Text('Monthly Summary (EUR)', style: theme.textTheme.titleLarge),
                const SizedBox(height: 16),
                MonthlySummaryChart(monthTotals: monthTotals, currency: ChartCurrency.eur),
                const SizedBox(height: 32),
                Text('Monthly Summary (VND)', style: theme.textTheme.titleLarge),
                const SizedBox(height: 16),
                MonthlySummaryChart(monthTotals: monthTotals, currency: ChartCurrency.vnd, rate: rate),
                const SizedBox(height: 32),

                // --- TABLE ---
                Text('Monthly Breakdown', style: theme.textTheme.titleLarge),
                const SizedBox(height: 16),
                ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: monthTotals.length,
                  itemBuilder: (context, index) {
                    final monthTotal = monthTotals[index];
                    final date = DateTime(widget.year, monthTotal.month);
                    final totalColor = monthTotal.total.isNegative ? negativeColor : positiveColor;
                    return ListTile(
                      onTap: () => widget.onNavigateToMonth(monthTotal.month),
                      title: Text(
                        DateFormat.MMMM().format(date),
                        style: theme.textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.bold),
                      ),
                      trailing: Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            euroFormat.format(monthTotal.total),
                            style: theme.textTheme.bodyLarge?.copyWith(
                              color: totalColor,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            vndFormat.format(monthTotal.total * rate),
                            style: theme.textTheme.bodyMedium?.copyWith(color: totalColor.withOpacity(0.8)),
                          ),
                        ],
                      ),
                    );
                  },
                  separatorBuilder: (context, index) => const Divider(),
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
