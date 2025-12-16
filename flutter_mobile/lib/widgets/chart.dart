import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mobile/api/currency_exchange_rate_api.dart';
import 'package:intl/intl.dart';

class RateChart extends StatelessWidget {
  final List<CurrencyExchangeRate> rates;

  const RateChart({super.key, required this.rates});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    if (rates.isEmpty) {
      return const Text('No data available');
    }

    final maxRate = rates.map((e) => e.rate).reduce((a, b) => a > b ? a : b);
    final minRate = rates.map((e) => e.rate).reduce((a, b) => a < b ? a : b);

    final maxY = (maxRate / 100).ceil() * 100.0;
    final minY = (minRate / 100).floor() * 100.0;

    final startDate = rates.first.date;
    final endDate = rates.last.date;
    final dateFormat = DateFormat('dd/MM/yyyy');
    final axisTitle = '${dateFormat.format(startDate)} - ${dateFormat.format(endDate)}';

    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: LineChart(
        LineChartData(
          gridData: FlGridData(
            show: true,
            drawVerticalLine: true,
            horizontalInterval: 100, // Match the Y-axis label interval
            verticalInterval: 1, // Match the X-axis label interval
            getDrawingHorizontalLine: (value) {
              return FlLine(
                color: theme.dividerColor,
                strokeWidth: 1,
              );
            },
            getDrawingVerticalLine: (value) {
              return FlLine(
                color: theme.dividerColor,
                strokeWidth: 0.5, // Make vertical lines thinner
              );
            },
          ),
          titlesData: FlTitlesData(
            show: true,
            bottomTitles: AxisTitles(
              sideTitles: SideTitles(
                showTitles: true,
                reservedSize: 30,
                interval: 1,
                getTitlesWidget: (value, meta) {
                  final index = value.toInt();
                  if (index >= 0 && index < rates.length) {
                    final date = rates[index].date;
                    if (value % meta.appliedInterval == 0) {
                      return SideTitleWidget(
                        meta: meta,
                        child: Text(
                          DateFormat('dd').format(date),
                          style: theme.textTheme.bodySmall,
                        ),
                      );
                    }
                  }
                  return const Text('');
                },
              ),
              axisNameWidget: Text(axisTitle, style: theme.textTheme.bodySmall),
            ),
            leftTitles: AxisTitles(
              sideTitles: SideTitles(
                  showTitles: true,
                  reservedSize: 80, // Increased from 50
                  interval: 100,
                  getTitlesWidget: (value, meta) {
                    return Text(value.toInt().toString(),
                        textAlign: TextAlign.left,
                        style: theme.textTheme.bodySmall);
                  }),
            ),
            topTitles: const AxisTitles(
              sideTitles: SideTitles(showTitles: false),
            ),
            rightTitles: const AxisTitles(
              sideTitles: SideTitles(showTitles: false),
            ),
          ),
          borderData: FlBorderData(
            show: true,
            border: Border.all(color: theme.dividerColor),
          ),
          minY: minY,
          maxY: maxY,
          lineBarsData: [
            LineChartBarData(
              spots: rates.asMap().entries.map((entry) {
                return FlSpot(
                    entry.key.toDouble(), entry.value.rate);
              }).toList(),
              isCurved: true,
              gradient: LinearGradient(colors: [theme.colorScheme.primary, theme.colorScheme.secondary]),
              barWidth: 4,
              isStrokeCapRound: true,
              dotData: const FlDotData(show: false),
              belowBarData: BarAreaData(
                show: true,
                gradient: LinearGradient(
                  colors: [
                    theme.colorScheme.primary.withAlpha((255 * 0.3).round()),
                    theme.colorScheme.secondary.withAlpha((255 * 0.3).round()),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
