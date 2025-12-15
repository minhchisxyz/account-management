package vn.diepgia.mchis.konto_verwaltung.config;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import vn.diepgia.mchis.konto_verwaltung.dto.TransactionRequest;
import vn.diepgia.mchis.konto_verwaltung.entities.BankName;
import vn.diepgia.mchis.konto_verwaltung.entities.CurrencyExchangeRate;
import vn.diepgia.mchis.konto_verwaltung.entities.CurrencyExchangeRateId;
import vn.diepgia.mchis.konto_verwaltung.entities.Transaction;
import vn.diepgia.mchis.konto_verwaltung.repositories.CurrencyExchangeRateRepository;
import vn.diepgia.mchis.konto_verwaltung.repositories.TransactionRepository;
import vn.diepgia.mchis.konto_verwaltung.services.CurrencyRateService;
import vn.diepgia.mchis.konto_verwaltung.services.TransactionService;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class StartupApplicationRunner implements ApplicationRunner {

    private final CurrencyRateService currencyRateService;
    private final TransactionService transactionService;
    private final CurrencyExchangeRateRepository currencyExchangeRateRepository;
    private final TransactionRepository transactionRepository;
    private final CurrencyExchangeRateRepository repository;
    private static final Logger LOGGER = LoggerFactory.getLogger(StartupApplicationRunner.class);

    @Override
    public void run(ApplicationArguments args) throws Exception {
        readData();
    }

    private void writeData() {
        LOGGER.info("Starting to write data from local file to database...");
        String line;

        try(BufferedReader br = new BufferedReader(new FileReader("transactions.csv"))) {
            while ((line = br.readLine()) != null) {
                String[] data = line.split(",");
                if (data.length > 0) {
                    transactionService.createTransaction(
                            TransactionRequest.builder()
                                    .value(Float.parseFloat(data[0]))
                                    .date(data[1])
                                    .description(data[2]).build()
                    );
                }
            }
            LOGGER.info("Has written all transactions to database");
        } catch (Exception e) {
            e.printStackTrace();
        }

        try(BufferedReader br = new BufferedReader(new FileReader("rates.csv"))) {
            while ((line = br.readLine()) != null) {
                String[] data = line.split(",");
                if (data.length > 0) {
                    repository.save(
                            CurrencyExchangeRate.builder()
                                    .id(
                                            CurrencyExchangeRateId.builder()
                                                    .bank(BankName.valueOf(data[0]))
                                                    .date(LocalDate.parse(data[1])).build()
                                    )
                                    .rate(Float.parseFloat(data[2]))
                                    .lastUpdated(LocalDateTime.now()).build()
                    );
                }
            }
            LOGGER.info("Has written all rates to database");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void readData() {
        LOGGER.info("Starting to read data from database to local file...");
        // read transactions
        try (FileWriter fileWriter = new FileWriter(new File("transactions.csv"))) {
            for (Transaction transaction : transactionService.getAllTransactions()) {
                fileWriter.append(transaction.toString());
                fileWriter.append("\n");
            }
            LOGGER.info("Has written all transactions to local file transactions.csv");
        } catch (Exception e) {
            e.printStackTrace();
        }

        try (FileWriter fileWriter = new FileWriter(new File("rates.csv"))) {
            var rates = currencyRateService.getAllRates();
            for (var rate: rates.getVcbRates()) {
                fileWriter.append(rate.toString());
                fileWriter.append("\n");
            }
            LOGGER.info("Has written all rates to local file rates.csv");
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
