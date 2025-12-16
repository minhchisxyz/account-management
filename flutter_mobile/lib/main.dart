import 'package:flutter/material.dart';
import 'package:flutter_mobile/api/transaction_api.dart';
import 'package:flutter_mobile/pages/account_balance_page.dart';
import 'package:flutter_mobile/pages/edit_transaction_page.dart';
import 'package:flutter_mobile/pages/new_transaction_page.dart';
import 'package:flutter_mobile/pages/rates_page.dart';
import 'package:flutter_mobile/pages/year_page.dart';
import 'package:flutter_mobile/pages/month_page.dart';
import 'package:flutter_mobile/widgets/appbar.dart';
import 'package:intl/intl.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  ThemeMode _themeMode = ThemeMode.light;

  void _toggleTheme() {
    setState(() {
      _themeMode = _themeMode == ThemeMode.light ? ThemeMode.dark : ThemeMode.light;
    });
  }

  @override
  Widget build(BuildContext context) {
    final lightTheme = ThemeData.light().copyWith(
      appBarTheme: const AppBarTheme(),
    );

    final darkTheme = ThemeData.dark().copyWith(
      scaffoldBackgroundColor: const Color(0xFF282E45),
      appBarTheme: const AppBarTheme(
        backgroundColor: Color(0xFF282E45),
        foregroundColor: Colors.white,
      ),
      inputDecorationTheme: const InputDecorationTheme(
        labelStyle: TextStyle(color: Colors.white70),
        enabledBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.white54)),
        focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.white)),
      ),
      radioTheme: RadioThemeData(
        fillColor: MaterialStateProperty.all(Colors.white),
      ),
    );

    return MaterialApp(
      title: 'Account Management',
      theme: lightTheme,
      darkTheme: darkTheme,
      themeMode: _themeMode,
      home: HomePage(toggleTheme: _toggleTheme, themeMode: _themeMode),
    );
  }
}

class HomePage extends StatefulWidget {
  final VoidCallback toggleTheme;
  final ThemeMode themeMode;

  const HomePage({super.key, required this.toggleTheme, required this.themeMode});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  late Future<List<int>> _yearsFuture;
  Widget _currentPage = const AccountBalancePage();
  String _title = 'Account Management';

  String _activePageName = 'Account Balance';
  int? _activeYear;
  int? _activeMonth;

  @override
  void initState() {
    super.initState();
    _yearsFuture = TransactionAPI.fetchAllYears();
  }

  void _navigateTo(String page, {int? year, int? monthIndex, int? transactionId}) {
    setState(() {
      if (page != 'Edit Transaction') {
        _activePageName = page;
        _activeYear = year;
        _activeMonth = monthIndex;
      }

      switch (page) {
        case 'Account Balance':
          _currentPage = const AccountBalancePage();
          _title = 'Account Management';
          break;
        case 'Rates':
          _currentPage = const RatesPage();
          _title = 'Currency Exchange Rates';
          break;
        case 'Year':
          if (year != null) {
            _currentPage = YearPage(
              year: year,
              onNavigateToMonth: (month) => _navigateTo('Month', year: year, monthIndex: month),
            );
            _title = 'Summary for $year';
          }
          break;
        case 'Month':
          if (year != null && monthIndex != null) {
            _currentPage = MonthPage(
              year: year,
              month: monthIndex,
              onNavigateToEdit: (transactionId) => _navigateTo('Edit Transaction', transactionId: transactionId),
            );
            _title = DateFormat.yMMMM().format(DateTime(year, monthIndex));
          }
          break;
        case 'New Transaction':
          _currentPage = NewTransactionPage(onTransactionCreated: _refreshDataAndReturn);
          _title = 'New Transaction';
          break;
        case 'Edit Transaction':
          if (transactionId != null) {
            _currentPage = EditTransactionPage(
              transactionId: transactionId,
              onTransactionUpdated: _refreshDataAndReturn,
            );
            _title = 'Edit Transaction';
          }
          break;
      }
    });
  }

  Future<void> _refreshDataAndReturn() async {
    setState(() {
      _yearsFuture = TransactionAPI.fetchAllYears();
    });

    String destinationPage = _activePageName;
    int? destinationYear = _activeYear;
    int? destinationMonth = _activeMonth;

    if (_activePageName == 'Month' && _activeYear != null && _activeMonth != null) {
      final transactions = await TransactionAPI.fetchAllTransactions(_activeYear!, _activeMonth!);
      if (transactions.isEmpty) {
        destinationPage = 'Year';
        destinationMonth = null;
      }
    }

    if (destinationPage == 'Year' && destinationYear != null) {
      final monthTotals = await TransactionAPI.fetchAllMonthTotals(destinationYear);
      if (monthTotals.isEmpty) {
        destinationPage = 'Account Balance';
        destinationYear = null;
        destinationMonth = null;
      }
    }

    _navigateTo(destinationPage, year: destinationYear, monthIndex: destinationMonth);
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<int>>(
      future: _yearsFuture,
      builder: (context, snapshot) {
        final years = snapshot.hasData ? snapshot.data! : <int>[];

        return Scaffold(
          appBar: MyAppBar(
            title: _title,
            years: years,
            toggleTheme: widget.toggleTheme,
            themeMode: widget.themeMode,
            onNavigate: (page, year) => _navigateTo(page, year: year),
            onNewTransaction: () => _navigateTo('New Transaction'),
          ),
          body: _currentPage,
          floatingActionButton: FloatingActionButton(
            onPressed: _refreshDataAndReturn,
            child: const Icon(Icons.refresh),
          ),
        );
      },
    );
  }
}
