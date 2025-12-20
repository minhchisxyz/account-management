import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class MyAppBar extends StatefulWidget implements PreferredSizeWidget {
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
  State<MyAppBar> createState() => _MyAppBarState();

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}

class _MyAppBarState extends State<MyAppBar> {
  bool _isMenuOpen = false;

  @override
  Widget build(BuildContext context) {
    return AppBar(
      title: Text(widget.title),
      actions: [
        IconButton(
          onPressed: widget.toggleTheme,
          icon: Icon(widget.themeMode == ThemeMode.light ? Icons.dark_mode : Icons.light_mode),
        ),
        PopupMenuButton<String>(
          icon: AnimatedRotation(
            turns: _isMenuOpen ? 0.25 : 0, // 90 degrees rotation
            duration: const Duration(milliseconds: 250),
            curve: Curves.easeInOut,
            child: AnimatedSwitcher(
              duration: const Duration(milliseconds: 250),
              transitionBuilder: (Widget child, Animation<double> animation) {
                return ScaleTransition(scale: animation, child: child);
              },
              child: Icon(
                _isMenuOpen ? Icons.close : Icons.menu,
                key: ValueKey<bool>(_isMenuOpen), // Key is required for AnimatedSwitcher
              ),
            ),
          ),
          position: PopupMenuPosition.under,
          onOpened: () {
            HapticFeedback.lightImpact(); // Subtle physical feedback
            setState(() {
              _isMenuOpen = true;
            });
          },
          onCanceled: () {
            setState(() {
              _isMenuOpen = false;
            });
          },
          onSelected: (value) {
            setState(() {
              _isMenuOpen = false;
            });
            if (value == 'New Transaction') {
              widget.onNewTransaction();
            } else if (value == 'Account Balance' || value == 'Rates') {
              widget.onNavigate(value, null);
            } else {
              widget.onNavigate('Year', int.parse(value));
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
              ...widget.years.map((year) {
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
