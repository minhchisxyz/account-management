package vn.diepgia.mchis.konto_verwaltung.controllers;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.diepgia.mchis.konto_verwaltung.dto.MonthTotal;
import vn.diepgia.mchis.konto_verwaltung.dto.YearTotal;
import vn.diepgia.mchis.konto_verwaltung.entities.Transaction;
import vn.diepgia.mchis.konto_verwaltung.dto.TransactionRequest;
import vn.diepgia.mchis.konto_verwaltung.services.TransactionService;

import java.time.LocalDate;
import java.time.Month;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.logging.Logger;

@RestController
@RequiredArgsConstructor
@Tag(name = "Transaction")
@RequestMapping("/app/AccountManagement/api/v1/transactions")
public class TransactionController {

    private final TransactionService transactionService;
    private final Logger LOGGER = Logger.getLogger(TransactionController.class.getName());

    @GetMapping
    public ResponseEntity<List<YearTotal>> getAllYearTotals() {
        return ResponseEntity.ok(transactionService.getAllYearTotals());
    }

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(@RequestBody TransactionRequest transaction) {
        LOGGER.info(String.format("Create new transaction(%s; %s €; %s)", LocalDate.parse(transaction.getDate()).format(DateTimeFormatter.ofPattern("dd.MM.yyyy")), String.valueOf(transaction.getValue()).replace('.', ','), transaction.getDescription()));
        return ResponseEntity.ok(transactionService.createTransaction(transaction));
    }

    @GetMapping("/transactions/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Integer id) {
        return ResponseEntity.ok(transactionService.getTransactionById(id));
    }

    @PutMapping("/transactions/{id}")
    public ResponseEntity<Transaction> updateTransaction(
            @PathVariable Integer id,
            @RequestBody TransactionRequest transaction
    ) {
        try {
            return ResponseEntity.ok(transactionService.updateTransaction(id, transaction));
        } catch(RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("transactions/{id}")
    public ResponseEntity<Integer> deleteTransaction(@PathVariable Integer id) {
        try {
            transactionService.deleteTransaction(id);
            return ResponseEntity.ok().build();
        } catch(RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/years")
    public ResponseEntity<List<Integer>> getAllYears() {
        return ResponseEntity.ok(transactionService.getAllYears());
    }

    @GetMapping("/years/{year}")
    public ResponseEntity<List<Transaction>> getAllTransactionsOfYear(
            @PathVariable int year
    ) {
        return ResponseEntity.ok(transactionService.getAllTransactionsOfYear(year));
    }

    @GetMapping("/years/{year}/months")
    public ResponseEntity<List<Month>> getAllMonths(@PathVariable Integer year) {
        return ResponseEntity.ok(transactionService.getAllMonths(year));
    }

    @GetMapping("/years/{year}/month-total")
    public ResponseEntity<List<MonthTotal>> getAllMonthTotals(
            @PathVariable Integer year
    ) {
        return ResponseEntity.ok(transactionService.getAllMonthTotal(year));
    }

    @GetMapping("/years/{year}/months/{month}")
    public ResponseEntity<List<Transaction>> getAllTransactionsOfMonth(
            @PathVariable("year") int year,
            @PathVariable("month") int month
    ) {
        return ResponseEntity.ok(transactionService.getAllTransactionsOfMonth(year, month));
    }

    @GetMapping("/salaries")
    public ResponseEntity<List<Transaction>> getAllSalaries() {
        return ResponseEntity.ok(transactionService.getAllSalaries());
    }

    @GetMapping("/savings")
    public ResponseEntity<List<Transaction>> getAllSavings() {
        return ResponseEntity.ok(transactionService.getAllSavings());
    }
}
