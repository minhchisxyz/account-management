import 'package:flutter/material.dart';
import 'package:flutter_mobile/api/ai_api.dart';
import 'package:flutter_mobile/api/transaction_api.dart';
import 'package:intl/intl.dart';
import 'package:speech_to_text/speech_recognition_result.dart';
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
  final _voiceDescriptionController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _amountController = TextEditingController();
  final SpeechToText _speechToText = SpeechToText();
  bool _speechEnabled = false;
  List<LocaleName> _locales = [];
  LocaleName? _selectedLocale;

  DateTime _selectedDate = DateTime.now();
  TransactionType _transactionType = TransactionType.spending;
  bool _isConverting = false;
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _initSpeech();
  }

  void _initSpeech() async {
    _speechEnabled = await _speechToText.initialize();
    if (_speechEnabled) {
      _locales = await _speechToText.locales();
      if (_locales.isNotEmpty) {
        _selectedLocale = _locales.firstWhere((locale) => locale.localeId == 'vi_VN', orElse: () => _locales.first);
      }
    }
    if (mounted) {
      setState(() {});
    }
  }

  void _startListening() async {
    FocusScope.of(context).unfocus();
    await _speechToText.listen(
      onResult: _onSpeechResult,
      localeId: _selectedLocale?.localeId,
    );
    setState(() {});
  }

  void _stopListening() async {
    await _speechToText.stop();
    setState(() {});
  }

  void _onSpeechResult(SpeechRecognitionResult result) {
    setState(() {
      _voiceDescriptionController.text = result.recognizedWords;
    });
  }

  Future<void> _convertToTransaction() async {
    if (_voiceDescriptionController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please record a voice prompt first'), backgroundColor: Colors.orange),
      );
      return;
    }

    setState(() {
      _isConverting = true;
    });

    try {
      final converted = await AIAPI.convert(prompt: _voiceDescriptionController.text);

      setState(() {
        _descriptionController.text = converted.description;
        _amountController.text = converted.amount.abs().toString();
        _selectedDate = converted.date;
        _transactionType = converted.amount.isNegative ? TransactionType.spending : TransactionType.earning;
      });

    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('AI conversion failed: $e'), backgroundColor: Colors.red),
      );
    } finally {
      setState(() {
        _isConverting = false;
      });
    }
  }

  @override
  void dispose() {
    _voiceDescriptionController.dispose();
    _descriptionController.dispose();
    _amountController.dispose();
    _speechToText.stop();
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

        _voiceDescriptionController.clear();
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
    final theme = Theme.of(context);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Expanded(
                  child: TextFormField(
                    controller: _voiceDescriptionController,
                    readOnly: true,
                    onTap: !_speechEnabled ? null : (_speechToText.isListening ? _stopListening : _startListening),
                    decoration: InputDecoration(
                      labelText: _speechToText.isListening
                          ? 'Listening... (${_selectedLocale?.name ?? ''})'
                          : (_speechEnabled ? 'Tap here to record' : 'Speech unavailable'),
                      border: const OutlineInputBorder(),
                      suffixIcon: IconButton(
                        icon: Icon(_speechToText.isNotListening ? Icons.mic_off : Icons.mic),
                        color: _speechToText.isNotListening ? Colors.grey : theme.colorScheme.primary,
                        onPressed: !_speechEnabled ? null : (_speechToText.isListening ? _stopListening : _startListening),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                if (_speechEnabled && _locales.isNotEmpty)
                  DropdownButton<LocaleName>(
                    value: _selectedLocale,
                    icon: const Icon(Icons.arrow_drop_down),
                    onChanged: (LocaleName? newValue) {
                      setState(() {
                        _selectedLocale = newValue!;
                      });
                    },
                    items: _locales.map<DropdownMenuItem<LocaleName>>((LocaleName value) {
                      return DropdownMenuItem<LocaleName>(
                        value: value,
                        child: Text(value.name, style: theme.textTheme.bodySmall),
                      );
                    }).toList(),
                  ),
              ],
            ),
            const SizedBox(height: 12),
            if (_isConverting)
              const Center(child: Padding(
                padding: EdgeInsets.all(8.0),
                child: CircularProgressIndicator(),
              ))
            else
              ElevatedButton.icon(
                onPressed: _convertToTransaction,
                icon: const Icon(Icons.auto_awesome),
                label: const Text('Convert to Transaction'),
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
            ListTile(
              title: Text('Date: ${DateFormat('dd/MM/yyyy').format(_selectedDate)}'),
              trailing: const Icon(Icons.calendar_today),
              onTap: () => _selectDate(context),
              contentPadding: EdgeInsets.zero,
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
            RadioGroup<TransactionType>(
              groupValue: _transactionType,
              onChanged: (TransactionType? value) {
                setState(() {
                  _transactionType = value!;
                });
              },
              child: Row(
                children: <Widget>[
                  Expanded(
                    child: RadioListTile<TransactionType>(
                      title: const Text('Spending'),
                      value: TransactionType.spending
                    ),
                  ),
                  Expanded(
                    child: RadioListTile<TransactionType>(
                      title: const Text('Earning'),
                      value: TransactionType.earning
                    ),
                  ),
                ],
              )
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
