package vn.diepgia.mchis.konto_verwaltung.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.diepgia.mchis.konto_verwaltung.dto.MonthTotal;
import vn.diepgia.mchis.konto_verwaltung.dto.TransactionRequest;
import vn.diepgia.mchis.konto_verwaltung.dto.YearTotal;
import vn.diepgia.mchis.konto_verwaltung.entities.Transaction;
import vn.diepgia.mchis.konto_verwaltung.repositories.TransactionRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final SortTransactionByAscendingDateService transactionSorter;

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll().stream().sorted(transactionSorter).toList();
    }

    public Transaction getTransactionById(Integer id) {
        return transactionRepository.findById(id).orElse(null);
    }

    public List<Transaction> getAllTransactionsOfMonth(int year, int month) {
        return getAllTransactions().stream().filter(t ->
                t.getDate().getMonthValue() == month && t.getDate().getYear() == year).sorted(transactionSorter).toList();
    }

    public List<Transaction> getAllTransactionsOfYear(int year) {
        return getAllTransactions().stream().filter(t -> t.getDate().getYear() == year).sorted(transactionSorter).toList();
    }

    public Transaction createTransaction(TransactionRequest transaction) {
        LocalDate date = transaction.getDate() == null || transaction.getDate().isBlank() ? LocalDate.now() : LocalDate.parse(transaction.getDate());
        String description = transaction.getDescription().toLowerCase().contains("lb") ? "Lebensmittel" : transaction.getDescription();
        return transactionRepository.save(
                Transaction.builder()
                        .value(transaction.getValue())
                        .date(date)
                        .description(description)
                        .lastModified(LocalDateTime.now()).build()
        );
    }

    public Transaction updateTransaction(Integer id, TransactionRequest request) {
        Transaction transaction = transactionRepository.findById(id).orElseThrow(RuntimeException::new);
        transaction.setValue(request.getValue());
        if (request.getDate() != null) {
            transaction.setDate(LocalDate.parse(request.getDate()));
        }
        transaction.setDescription(request.getDescription());
        transaction.setLastModified(LocalDateTime.now());
        return transactionRepository.save(transaction);
    }

    public void deleteTransaction(Integer id) {
        Transaction transaction = transactionRepository.findById(id).orElseThrow(RuntimeException::new);
        transactionRepository.delete(transaction);
    }

    public List<Integer> getAllYears() {
        return getAllTransactions().stream()
                .map(t -> t.getDate().getYear())
                .sorted()
                .distinct()
                .toList();
    }

    public List<Month> getAllMonths(Integer year) {
        return getAllTransactions().stream()
                .filter(t -> t.getDate().getYear() == year)
                .map(t -> t.getDate().getMonth())
                .sorted()
                .distinct()
                .toList();
    }

    public List<MonthTotal> getAllMonthTotal(Integer year) {
        return getAllMonths(year)
                .stream()
                .map(m -> MonthTotal.builder()
                            .month(m)
                            .total(getAllTransactionsOfMonth(year, m.getValue()).stream().mapToDouble(Transaction::getValue).sum())
                        .build()
                )
                .toList();
    }

    public List<YearTotal> getAllYearTotals() {
        return getAllYears().stream()
                .map(y -> YearTotal.builder()
                        .year(y)
                        .total(getAllTransactionsOfYear(y).stream().mapToDouble(Transaction::getValue).sum())
                        .build())
                .toList();
    }

    public List<Transaction> getAllSalaries() {
        return getAllTransactions().stream()
                .filter(t -> t.getDescription().toLowerCase().contains("gehalt") || t.getDescription().toLowerCase().contains("lohn"))
                .toList();
    }

    public List<Transaction> getAllSavings() {
        return getAllTransactions().stream()
                .filter(t -> t.getDescription().toLowerCase().contains("me iu") && t.getDescription().toLowerCase().contains("chi ti"))
                .toList();
    }
}
