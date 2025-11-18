package vn.diepgia.mchis.konto_verwaltung.services;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestTemplate;
import vn.diepgia.mchis.konto_verwaltung.dto.Rates;
import vn.diepgia.mchis.konto_verwaltung.entities.BankName;
import vn.diepgia.mchis.konto_verwaltung.entities.CurrencyExchangeRate;
import vn.diepgia.mchis.konto_verwaltung.entities.CurrencyExchangeRateId;
import vn.diepgia.mchis.konto_verwaltung.entities.vcb.VCBCurrency;
import vn.diepgia.mchis.konto_verwaltung.entities.vcb.VCBExchangeRateResponse;
import vn.diepgia.mchis.konto_verwaltung.repositories.CurrencyExchangeRateRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.logging.Logger;

@Service
@RequiredArgsConstructor
public class CurrencyRateService {

    @Value("${application.currency.vib-url}")
    private String vibUrl;

    @Value("${application.currency.vcb-url}")
    private String vcbUrl;

    private final RestTemplate restTemplate;

    private final CurrencyExchangeRateRepository repository;
    private final CurrencyExchangeRateSorter sorter;
    private static final Logger LOGGER = Logger.getLogger(CurrencyRateService.class.getName());
    
    private String getUrl(String bank) {
        return switch (bank) {
            case "vib" -> vibUrl;
            case "vcb" -> vcbUrl;
            default -> null;
        };
    }

    private BankName getBank(String bank) {
        return BankName.valueOf(bank.toUpperCase());
    }

    private float extractRate(String url, String bank) {

        try {
            switch (bank) {
                /*case "vib": {
                    driver.get(url);
                    List<WebElement> elements = driver.findElements(By.className("vib-v2-colum-table-deposit"));
                    WebElement element = elements.get(19);
                    String value = element.getText();
                    value = value.replace(".", "").replace(",", ".");
                    return Float.parseFloat(value);
                }*/
                case "vcb": {
                    RestClient client = RestClient.create();
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                    LocalDate now = LocalDate.now();
                    String formatted = now.format(formatter);
                    url = String.format("%s%s", url, formatted);
                    LOGGER.info("Make request to VCB URL: " + url);
                    VCBExchangeRateResponse result = client.get()
                            .uri(url)
                            .accept(MediaType.APPLICATION_JSON)
                            .retrieve()
                            .body(VCBExchangeRateResponse.class);
                    VCBCurrency euro = result.getData()
                            .stream()
                            .filter(c -> "EUR".equals(c.getCurrencyCode()))
                            .findFirst()
                            .orElse(null);
                    if (euro != null) return euro.getTransfer();

                }
                default: {
                    return 0f;
                }
            }
        } catch (Exception e) {
            LOGGER.severe("Cannot retrieve rate for " + bank + ", exception: " + e.getMessage());
            return 0f;
        }
    }

    public CurrencyExchangeRate getTodayRate(String bank) {
        LocalDate now = LocalDate.now();
        BankName bankName = getBank(bank);
        var currencyOpt = repository.findById(
                CurrencyExchangeRateId.builder()
                        .bank(bankName)
                        .date(now).build()
        );
        if (currencyOpt.isPresent() && LocalDateTime.now().isBefore(currencyOpt.get().getLastUpdated().plusHours(6))) {
            return currencyOpt.get();
        }
        String url = getUrl(bank);

        float result = extractRate(url, bank);;
        if (result == 0) return null;
        LOGGER.info(bankName.name() + " Rate: 1 EUR = " + result + " VND");
        if (currencyOpt.isPresent()) {
            var currency = currencyOpt.get();
            currency.setRate(result);
            currency.setLastUpdated(LocalDateTime.now());
            repository.save(currency);
            return currency;
        }
        return repository.save(
                CurrencyExchangeRate.builder()
                        .id(
                                CurrencyExchangeRateId.builder()
                                        .date(LocalDate.now())
                                        .bank(bankName)
                                        .build()
                        )
                        .lastUpdated(LocalDateTime.now())
                        .rate(result)
                        .build()
        );
    }

    public Rates getAllRates() {
        return Rates.builder()
                //.vibRates(getAllRates("vib"))
                .vcbRates(getAllRates("vcb"))
                .build();
    }

    private List<CurrencyExchangeRate> getAllRates(String bank) {
        try {
            getTodayRate(bank);
        } catch(Exception e) {
            LOGGER.severe("Problem at retrieving " + getBank(bank).name() + " rate, exception: " + e.getMessage());
        }
        return repository.findAll()
                .stream()
                .filter(r -> r.getId().getBank() == getBank(bank))
                .sorted(sorter)
                .toList();
    }

    public void changeRate(String bank, float rate, String date) {
        LocalDate now = LocalDate.now();
        BankName bankName = getBank(bank);
        CurrencyExchangeRateId rateId = CurrencyExchangeRateId.builder()
                .bank(bankName)
                .date(date.isEmpty() ? now : LocalDate.parse(date, DateTimeFormatter.ofPattern("dd.MM.yyyy"))).build();
        repository.findById(rateId).ifPresentOrElse(
                (currencyExchangeRate) -> {
                    currencyExchangeRate.setRate(rate);
                    LOGGER.info("Edited: " + bankName.name() + " Rate: 1 EUR = " + rate + " VND");
                    repository.save(currencyExchangeRate);
                },
                () -> {
                    repository.save(
                            CurrencyExchangeRate.builder()
                                    .id(rateId)
                                    .rate(rate)
                                    .lastUpdated(LocalDateTime.now())
                                    .build()
                    );
                    LOGGER.info("Saved: " + bankName.name() + " Rate: 1 EUR = " + rate + " VND in " + date);
                }
        );

    }
}
