import 'package:flutter/material.dart';
import 'package:flutter_mobile/api/transaction_api.dart';
import 'package:flutter_mobile/api/currency_exchange_rate_api.dart';
import 'package:flutter_mobile/pages/month_page.dart';
import 'package:intl/intl.dart';

class YearPage extends StatefulWidget {
  final int year;

  const YearPage({super.key, required this.year});

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

          return Column(
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(16.0, 24.0, 16.0, 8.0),
                child: Row(
                  children: [
                    Expanded(flex: 4, child: Text('Month', style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold))),
                    Expanded(flex: 5, child: Text('Total', textAlign: TextAlign.end, style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold))),
                  ],
                ),
              ),
              const Divider(),
              Expanded(
                child: ListView.builder(
                  itemCount: monthTotals.length,
                  itemBuilder: (context, index) {
                    final monthTotal = monthTotals[index];
                    final date = DateTime(widget.year, monthTotal.month);
                    final totalColor = monthTotal.total.isNegative ? negativeColor : positiveColor;

                    return InkWell(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => MonthPage(year: widget.year, month: monthTotal.month),
                          ),
                        );
                      },
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
                        child: Row(
                          children: [
                            Expanded(
                              flex: 4,
                              child: Text(
                                DateFormat.MMMM().format(date),
                                style: theme.textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.bold),
                              ),
                            ),
                            Expanded(
                              flex: 5,
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
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
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
            ],
          );
        } else {
          return const Center(child: Text('No data available'));
        }
      },
    );
  }
}
