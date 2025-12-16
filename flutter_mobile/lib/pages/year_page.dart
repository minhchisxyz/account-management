import 'package:flutter/material.dart';
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
  // FIX: Future now only fetches a list of MonthTotal
  late Future<List<MonthTotal>> _dataFuture;

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

  // FIX: Simplified data fetching
  Future<List<MonthTotal>> _fetchData() async {
    return TransactionAPI.fetchAllMonthTotals(widget.year);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return FutureBuilder<List<MonthTotal>>(
      future: _dataFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        } else if (snapshot.hasError) {
          return Center(child: Text('Error: ${snapshot.error}', style: TextStyle(color: theme.colorScheme.error)));
        } else if (snapshot.hasData) {
          final monthTotals = snapshot.data!;
          final euroFormat = NumberFormat.currency(locale: 'de_DE', symbol: '€');
          final vndFormat = NumberFormat.currency(locale: 'vi_VN', symbol: '₫');
          final positiveColor = theme.brightness == Brightness.dark ? Colors.greenAccent : Colors.green.shade800;
          final negativeColor = theme.colorScheme.error;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text('Monthly Summary (EUR)', style: theme.textTheme.titleLarge),
                const SizedBox(height: 16),
                // FIX: Removed the rate parameter
                MonthlySummaryChart(monthTotals: monthTotals, currency: ChartCurrency.eur),
                const SizedBox(height: 32),
                Text('Monthly Summary (VND)', style: theme.textTheme.titleLarge),
                const SizedBox(height: 16),
                // FIX: Removed the rate parameter
                MonthlySummaryChart(monthTotals: monthTotals, currency: ChartCurrency.vnd),
                const SizedBox(height: 32),

                Text('Monthly Breakdown', style: theme.textTheme.titleLarge),
                const SizedBox(height: 16),
                ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: monthTotals.length,
                  itemBuilder: (context, index) {
                    final monthTotal = monthTotals[index];
                    final date = DateTime(widget.year, monthTotal.month);
                    final totalColor = monthTotal.totalEUR.isNegative ? negativeColor : positiveColor;
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
                            euroFormat.format(monthTotal.totalEUR),
                            style: theme.textTheme.bodyLarge?.copyWith(
                              color: totalColor,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            vndFormat.format(monthTotal.totalVND),
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
