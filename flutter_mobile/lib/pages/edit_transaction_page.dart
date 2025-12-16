import 'package:flutter/material.dart';
import 'package:flutter_mobile/api/transaction_api.dart';
import 'package:intl/intl.dart';

enum TransactionType { spending, earning }

class EditTransactionPage extends StatefulWidget {
  final int transactionId;
  final VoidCallback onTransactionUpdated;

  const EditTransactionPage({super.key, required this.transactionId, required this.onTransactionUpdated});

  @override
  State<EditTransactionPage> createState() => _EditTransactionPageState();
}

class _EditTransactionPageState extends State<EditTransactionPage> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _descriptionController;
  late TextEditingController _amountController;
  late DateTime _selectedDate;
  late TransactionType _transactionType;
  bool _isLoading = true;
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _descriptionController = TextEditingController();
    _amountController = TextEditingController();
    _loadTransaction();
  }

  Future<void> _loadTransaction() async {
    try {
      final transaction = await TransactionAPI.getTransaction(widget.transactionId);
      setState(() {
        _descriptionController.text = transaction.description;
        _amountController.text = transaction.amount.abs().toString();
        _selectedDate = transaction.date;
        _transactionType = transaction.amount.isNegative ? TransactionType.spending : TransactionType.earning;
        _isLoading = false;
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to load transaction: $e'), backgroundColor: Colors.red),
      );
    }
  }

  @override
  void dispose() {
    _descriptionController.dispose();
    _amountController.dispose();
    super.dispose();
  }

  Future<void> _submitTransaction() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isSubmitting = true;
      });

      try {
        double amount = double.parse(_amountController.text);
        if (_transactionType == TransactionType.spending) {
          amount = -amount.abs();
        }

        await TransactionAPI.updateTransaction(
          id: widget.transactionId,
          amount: amount,
          description: _descriptionController.text,
          date: _selectedDate,
        );

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Transaction Updated Successfully'), backgroundColor: Colors.green),
        );
        widget.onTransactionUpdated();
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to update transaction: $e'), backgroundColor: Colors.red),
        );
      } finally {
        setState(() {
          _isSubmitting = false;
        });
      }
    }
  }

  Future<void> _deleteTransaction() async {
    // ... (delete logic remains the same)
  }

  void _showDeleteConfirmation() {
    // ... (delete confirmation logic remains the same)
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(2000),
      lastDate: DateTime(2101),
    );
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            ListTile(
              title: Text('Date: ${DateFormat('dd/MM/yyyy').format(_selectedDate)}'),
              trailing: const Icon(Icons.calendar_today),
              onTap: () => _selectDate(context),
              contentPadding: EdgeInsets.zero,
            ),
            const SizedBox(height: 20),
            TextFormField(
              controller: _descriptionController,
              decoration: const InputDecoration(
                labelText: 'Description',
                border: OutlineInputBorder(),
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter a description';
                }
                return null;
              },
            ),
            const SizedBox(height: 20),
            TextFormField(
              controller: _amountController,
              decoration: const InputDecoration(
                labelText: 'Amount',
                border: OutlineInputBorder(),
              ),
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter an amount';
                }
                if (double.tryParse(value) == null) {
                  return 'Please enter a valid number';
                }
                return null;
              },
            ),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                const Text('Spending'),
                Radio<TransactionType>(
                  value: TransactionType.spending,
                  groupValue: _transactionType,
                  onChanged: (TransactionType? value) {
                    setState(() {
                      _transactionType = value!;
                    });
                  },
                ),
                const SizedBox(width: 20),
                const Text('Earning'),
                Radio<TransactionType>(
                  value: TransactionType.earning,
                  groupValue: _transactionType,
                  onChanged: (TransactionType? value) {
                    setState(() {
                      _transactionType = value!;
                    });
                  },
                ),
              ],
            ),
            const SizedBox(height: 30),
            if (_isSubmitting)
              const Center(child: CircularProgressIndicator())
            else
              ElevatedButton(
                onPressed: _submitTransaction,
                child: const Text('Update Transaction'),
              ),
          ],
        ),
      ),
    );
  }
}
