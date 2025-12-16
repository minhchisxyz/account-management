import 'package:flutter/material.dart';
import 'package:flutter_mobile/api/currency_exchange_rate_api.dart';
import 'package:flutter_mobile/api/transaction_api.dart';
import 'package:flutter_mobile/widgets/daily_summary_chart.dart';
import 'package:intl/intl.dart';

class MonthPage extends StatefulWidget {
  final int year;
  final int month;
  final Function(int transactionId) onNavigateToEdit;

  const MonthPage({super.key, required this.year, required this.month, required this.onNavigateToEdit});

  @override
  State<MonthPage> createState() => _MonthPageState();
}

class _MonthPageState extends State<MonthPage> {
  Future<Map<String, dynamic>>? _dataFuture;

  @override
  void initState() {
    super.initState();
    _dataFuture = _fetchData();
  }

  @override
  void didUpdateWidget(MonthPage oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.year != oldWidget.year || widget.month != oldWidget.month) {
      setState(() {
        _dataFuture = _fetchData();
      });
    }
  }

  Future<Map<String, dynamic>> _fetchData() async {
    // Fetch both sets of data in parallel
    final results = await Future.wait([
      TransactionAPI.fetchAllTransactions(widget.year, widget.month),
      TransactionAPI.fetchAllTransactionsGroupedByDate(widget.year, widget.month),
      CurrencyExchangeRateAPI.fetchTodayRate(),
    ]);

    return {
      'transactions': results[0] as List<Transaction>,
      'groupedTransactions': results[1] as List<GroupedByDateTransaction>,
      'rate': results[2] as double,
    };
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
          final transactions = snapshot.data!['transactions'] as List<Transaction>;
          final groupedTransactions = snapshot.data!['groupedTransactions'] as List<GroupedByDateTransaction>;
          final rate = snapshot.data!['rate'] as double;
          final euroFormat = NumberFormat.currency(locale: 'de_DE', symbol: '€');
          final vndFormat = NumberFormat.currency(locale: 'vi_VN', symbol: '₫');
          final positiveColor = theme.brightness == Brightness.dark ? Colors.greenAccent : Colors.green.shade800;
          final negativeColor = theme.colorScheme.error;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // --- CHARTS ---
                Text('Daily Summary (EUR)', style: theme.textTheme.titleLarge),
                const SizedBox(height: 16),
                DailySummaryChart(groupedTransactions: groupedTransactions, currency: ChartCurrency.eur),
                const SizedBox(height: 32),
                Text('Daily Summary (VND)', style: theme.textTheme.titleLarge),
                const SizedBox(height: 16),
                DailySummaryChart(groupedTransactions: groupedTransactions, currency: ChartCurrency.vnd, rate: rate),
                const SizedBox(height: 32),

                // --- TRANSACTION LIST ---
                Text('Transactions', style: theme.textTheme.titleLarge),
                const SizedBox(height: 16),
                ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: transactions.length,
                  itemBuilder: (context, index) {
                    final transaction = transactions[index];
                    final amountColor = transaction.amount.isNegative ? negativeColor : positiveColor;
                    return ListTile(
                      onTap: () => widget.onNavigateToEdit(transaction.id),
                      leading: CircleAvatar(
                        backgroundColor: theme.colorScheme.primary.withOpacity(0.1),
                        child: Text(
                          DateFormat('dd').format(transaction.date),
                          style: TextStyle(fontWeight: FontWeight.bold, color: theme.colorScheme.primary),
                        ),
                      ),
                      title: Text(transaction.description, style: theme.textTheme.bodyLarge, maxLines: 2, overflow: TextOverflow.ellipsis),
                      trailing: Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            euroFormat.format(transaction.amount),
                            style: theme.textTheme.bodyLarge?.copyWith(
                              color: amountColor,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            vndFormat.format(transaction.amount * rate),
                            style: theme.textTheme.bodyMedium?.copyWith(color: amountColor.withOpacity(0.8)),
                          ),
                        ],
                      ),
                    );
                  },
                  separatorBuilder: (context, index) => const Divider(height: 1),
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
