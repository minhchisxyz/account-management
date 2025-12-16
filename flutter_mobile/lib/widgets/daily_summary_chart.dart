import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mobile/api/transaction_api.dart';
import 'package:intl/intl.dart';

enum ChartCurrency { eur, vnd }

class DailySummaryChart extends StatelessWidget {
  final List<GroupedByDateTransaction> groupedTransactions;
  final ChartCurrency currency;
  final double? rate;

  const DailySummaryChart({super.key, required this.groupedTransactions, required this.currency, this.rate});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    if (groupedTransactions.isEmpty) {
      return const SizedBox(height: 300, child: Center(child: Text('No data to display')));
    }

    final format = currency == ChartCurrency.eur
        ? NumberFormat.currency(locale: 'de_DE', symbol: '€')
        : NumberFormat.currency(locale: 'vi_VN', symbol: '₫');

    // Safely calculate min and max values
    double maxVal = double.negativeInfinity;
    double minVal = double.infinity;
    for (var total in groupedTransactions) {
      final value = currency == ChartCurrency.eur ? total.total : total.total * (rate ?? 1);
      if (value > maxVal) maxVal = value;
      if (value < minVal) minVal = value;
    }

    // CRITICAL FIX: Ensure axis has a valid range to prevent crashes
    double minY = (minVal / 100).floor() * 100.0;
    double maxY = (maxVal / 100).ceil() * 100.0;
    if (minY == maxY) {
      maxY += 100;
    }

    return SizedBox(
      height: 300,
      child: LineChart(
        LineChartData(
          gridData: FlGridData(
            show: true,
            drawVerticalLine: true,
            horizontalInterval: (maxY - minY).abs() / 4, // Dynamic interval
            getDrawingHorizontalLine: (value) => FlLine(color: theme.dividerColor, strokeWidth: 0.5),
            getDrawingVerticalLine: (value) => FlLine(color: theme.dividerColor, strokeWidth: 0.5),
          ),
          titlesData: FlTitlesData(
            leftTitles: AxisTitles(
              sideTitles: SideTitles(
                showTitles: true,
                reservedSize: 90,
                getTitlesWidget: (value, meta) => Text(format.format(value), style: theme.textTheme.bodySmall),
              ),
            ),
            bottomTitles: AxisTitles(
              sideTitles: SideTitles(
                showTitles: true,
                interval: 1,
                getTitlesWidget: (value, meta) {
                  final index = value.toInt();
                  if (index >= 0 && index < groupedTransactions.length) {
                    final date = groupedTransactions[index].date;
                    return SideTitleWidget(
                      axisSide: meta.axisSide,
                      child: Text(DateFormat.d().format(date), style: theme.textTheme.bodySmall),
                    );
                  }
                  return const Text('');
                },
              ),
            ),
            topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
            rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          ),
          borderData: FlBorderData(show: true, border: Border.all(color: theme.dividerColor)),
          minY: minY,
          maxY: maxY,
          lineBarsData: [
            LineChartBarData(
              spots: groupedTransactions.asMap().entries.map((entry) {
                final index = entry.key;
                final total = currency == ChartCurrency.eur ? entry.value.total : entry.value.total * (rate ?? 1);
                return FlSpot(index.toDouble(), total);
              }).toList(),
              isCurved: true,
              color: theme.colorScheme.primary,
              barWidth: 3,
              isStrokeCapRound: true,
              dotData: const FlDotData(show: true),
              belowBarData: BarAreaData(
                show: true,
                color: theme.colorScheme.primary.withOpacity(0.3),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
