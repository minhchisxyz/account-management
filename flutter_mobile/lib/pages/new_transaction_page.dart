import 'package:flutter/material.dart';
import 'package:flutter_mobile/api/transaction_api.dart';
import 'package:intl/intl.dart';
import 'package:speech_to_text/speech_to_text.dart';

enum TransactionType { spending, earning }

class NewTransactionPage extends StatefulWidget {
  final VoidCallback onTransactionCreated;

  const NewTransactionPage({super.key, required this.onTransactionCreated});

  @override
  State<NewTransactionPage> createState() => _NewTransactionPageState();
}

class _NewTransactionPageState extends State<NewTransactionPage> {
  final _formKey = GlobalKey<FormState>();
  final _descriptionController = TextEditingController();
  final _amountController = TextEditingController();
  final SpeechToText _speechToText = SpeechToText();
  bool _speechEnabled = false;
  bool _isListening = false;

  DateTime _selectedDate = DateTime.now();
  TransactionType _transactionType = TransactionType.spending;
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _initSpeech();
  }

  void _initSpeech() async {
    _speechEnabled = await _speechToText.initialize();
    setState(() {});
  }

  void _startListening() async {
    await _speechToText.listen(onResult: _onSpeechResult);
    setState(() {
      _isListening = true;
    });
  }

  void _stopListening() async {
    await _speechToText.stop();
    setState(() {
      _isListening = false;
    });
  }

  void _onSpeechResult(result) {
    setState(() {
      _descriptionController.text = result.recognizedWords;
    });
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

        await TransactionAPI.createTransaction(
          amount: amount,
          description: _descriptionController.text,
          date: _selectedDate,
        );

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Transaction Created Successfully'), backgroundColor: Colors.green),
        );

        widget.onTransactionCreated();

        _descriptionController.clear();
        _amountController.clear();
        setState(() {
          _selectedDate = DateTime.now();
          _transactionType = TransactionType.spending;
        });

      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to create transaction: $e'), backgroundColor: Colors.red),
        );
      } finally {
        setState(() {
          _isSubmitting = false;
        });
      }
    }
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
              decoration: InputDecoration(
                labelText: 'Description',
                border: const OutlineInputBorder(),
                suffixIcon: IconButton(
                  icon: Icon(_isListening ? Icons.mic_off : Icons.mic),
                  onPressed: _speechEnabled ? (_isListening ? _stopListening : _startListening) : null,
                ),
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
                child: const Text('Add Transaction'),
              ),
          ],
        ),
      ),
    );
  }
}
