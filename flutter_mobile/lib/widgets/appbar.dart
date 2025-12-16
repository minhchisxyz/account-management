import 'package:flutter/material.dart';


class MyAppBar extends StatelessWidget implements PreferredSizeWidget {
  final VoidCallback toggleTheme;
  final ThemeMode themeMode;
  final String title;

  final List<int> years;
  final void Function(String, int?) onNavigate;
  final VoidCallback onNewTransaction;

  const MyAppBar({
    super.key,
    required this.toggleTheme,
    required this.themeMode,
    required this.title,
    required this.years,
    required this.onNavigate,
    required this.onNewTransaction,
  });

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      title: Text(title),
      actions: [
        IconButton(
          onPressed: toggleTheme,
          icon: Icon(themeMode == ThemeMode.light ? Icons.dark_mode : Icons.light_mode),
        ),
        PopupMenuButton<String>(
          icon: const Icon(Icons.menu),
          onSelected: (value) {
            if (value == 'New Transaction') {
              onNewTransaction();
            } else if (value == 'Account Balance' || value == 'Rates') {
              onNavigate(value, null);
            } else {
              onNavigate('Year', int.parse(value));
            }
          },
          itemBuilder: (BuildContext context) {
            return [
              const PopupMenuItem<String>(
                value: 'Account Balance',
                child: Text('Account Balance'),
              ),
              const PopupMenuItem<String>(
                value: 'Rates',
                child: Text('Rates'),
              ),
              const PopupMenuItem<String>(
                value: 'New Transaction',
                child: Text('New Transaction'),
              ),
              const PopupMenuDivider(),
              ...years.map((year) {
                return PopupMenuItem<String>(
                  value: year.toString(),
                  child: Text(year.toString()),
                );
              }),
            ];
          },
        )
      ],
    );
  }
}