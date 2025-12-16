import 'package:flutter/material.dart';
import 'package:flutter_mobile/api/transaction_api.dart';
import 'package:flutter_mobile/api/currency_exchange_rate_api.dart';
import 'package:flutter_mobile/pages/edit_transaction_page.dart';
import 'package:intl/intl.dart';

class MonthPage extends StatefulWidget {
  final int year;
  final int month;

  const MonthPage({super.key, required this.year, required this.month});

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
    final transactions = await TransactionAPI.fetchAllTransactions(widget.year, widget.month);
    final rate = await CurrencyExchangeRateAPI.fetchTodayRate();
    return {'transactions': transactions, 'rate': rate};
  }

  Future<void> _deleteTransaction(int id) async {
    try {
      await TransactionAPI.deleteTransaction(id);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Transaction Deleted Successfully'), backgroundColor: Colors.green),
      );
      setState(() {
        _dataFuture = _fetchData();
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to delete transaction: $e'), backgroundColor: Colors.red),
      );
    }
  }

  void _showDeleteConfirmation(int id) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Confirm Delete'),
          content: const Text('Are you sure you want to delete this transaction?'),
          actions: <Widget>[
            TextButton(
              child: const Text('Cancel'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: const Text('Delete', style: TextStyle(color: Colors.red)),
              onPressed: () {
                Navigator.of(context).pop();
                _deleteTransaction(id);
              },
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final date = DateTime(widget.year, widget.month);
    final title = DateFormat.yMMMM().format(date);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(title),
      ),
      body: FutureBuilder<Map<String, dynamic>>(
        future: _dataFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}', style: TextStyle(color: theme.colorScheme.error)));
          } else if (snapshot.hasData) {
            final transactions = snapshot.data!['transactions'] as List<Transaction>;
            final rate = snapshot.data!['rate'] as double;
            final euroFormat = NumberFormat.currency(locale: 'de_DE', symbol: '€');
            final vndFormat = NumberFormat.currency(locale: 'vi_VN', symbol: '₫');

            final positiveColor = theme.brightness == Brightness.dark ? Colors.greenAccent : Colors.green.shade800;
            final negativeColor = theme.colorScheme.error;

            return Column(
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(16.0, 24.0, 16.0, 8.0),
                  child: Row(
                    children: [
                      Expanded(flex: 1, child: Text('Date', style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold))),
                      Expanded(flex: 5, child: Text('Description', style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold))),
                      Expanded(flex: 4, child: Text('Amount', textAlign: TextAlign.end, style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold))),
                      Expanded(flex: 2, child: Text('Actions', textAlign: TextAlign.center, style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold))),
                    ],
                  ),
                ),
                const Divider(),
                Expanded(
                  child: ListView.builder(
                    itemCount: transactions.length,
                    itemBuilder: (context, index) {
                      final transaction = transactions[index];
                      final amountColor = transaction.amount.isNegative ? negativeColor : positiveColor;
                      return Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Expanded(
                              flex: 1,
                              child: Text(
                                DateFormat('dd').format(transaction.date),
                                style: theme.textTheme.bodySmall,
                              ),
                            ),
                            Expanded(
                              flex: 5,
                              child: Text(transaction.description, style: theme.textTheme.bodyLarge),
                            ),
                            Expanded(
                              flex: 4,
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
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
                            ),
                            Expanded(
                              flex: 2,
                              child: IconButton(
                                icon: Icon(Icons.edit, size: 20, color: theme.colorScheme.onSurface.withOpacity(0.7)),
                                onPressed: () async {
                                  final result = await Navigator.push(
                                    context,
                                    MaterialPageRoute(builder: (context) => EditTransactionPage(transactionId: transaction.id)),
                                  );
                                  if (result == true) {
                                    setState(() {
                                      _dataFuture = _fetchData();
                                    });
                                  }
                                },
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
              ],
            );
          } else {
            return const Center(child: Text('No transactions for this month'));
          }
        },
      ),
    );
  }
}
