package vn.diepgia.mchis.konto_verwaltung.services;

import lombok.RequiredArgsConstructor;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import vn.diepgia.mchis.konto_verwaltung.dto.Rates;
import vn.diepgia.mchis.konto_verwaltung.entities.*;
import vn.diepgia.mchis.konto_verwaltung.repositories.CurrencyExchangeRateRepository;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.StringReader;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Service
@RequiredArgsConstructor
public class CurrencyRateService {

    @Value("${application.currency.vib-url}")
    private String vibUrl;

    @Value("${application.currency.vcb-url}")
    private String vcbUrl;

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
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--no-sandbox");
        options.setImplicitWaitTimeout(Duration.ofSeconds(10));
        WebDriver driver = new ChromeDriver(options);
        try {
            switch (bank) {
                case "vib": {
                    driver.get(url);
                    List<WebElement> elements = driver.findElements(By.className("vib-v2-colum-table-deposit"));
                    WebElement element = elements.get(19);
                    String value = element.getText();
                    value = value.replace(".", "").replace(",", ".");
                    return Float.parseFloat(value);
                }
                case "vcb": {
                    driver.get(url);
                    String xml = driver.getPageSource();
                    String currencyCode = "EUR";
                    String field = "Transfer";
                    DocumentBuilderFactory f = DocumentBuilderFactory.newInstance();
                    // Harden XML parsing
                    f.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
                    f.setFeature("http://xml.org/sax/features/external-general-entities", false);
                    f.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
                    f.setXIncludeAware(false);
                    f.setExpandEntityReferences(false);

                    DocumentBuilder b = f.newDocumentBuilder();
                    Document doc = b.parse(new InputSource(new StringReader(xml)));

                    NodeList nodes = doc.getElementsByTagName("Exrate");
                    for (int i = 0; i < nodes.getLength(); i++) {
                        Element el = (Element) nodes.item(i);
                        if (currencyCode.equalsIgnoreCase(el.getAttribute("CurrencyCode"))) {
                            String raw = el.getAttribute(field);
                            if (raw == null || raw.isBlank()) return 0;
                            // Normalize numbers like "24,560.00" -> "24560.00"
                            String normalized = raw.replace(",", "").trim();
                            return Float.parseFloat(normalized);
                        }
                    }
                    return 0;
                }
                default: {
                    return 0f;
                }
            }
        } catch (Exception e) {
            LOGGER.severe("Cannot retrieve rate for " + bank + ", exception: " + e.getMessage());
            return 0f;
        }finally {
            driver.quit();
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
        if (currencyOpt.isPresent() && LocalDateTime.now().isBefore(currencyOpt.get().getLastUpdated().plusHours(2))) {
            return currencyOpt.get();
        }
        String url = getUrl(bank);
        LOGGER.info("Make request to " + bankName.name() + " URL: " + url);

        float result = 0;
        try {
            result = extractRate(url, bank);
        } catch (Exception e) {
            for (int i = 1 ; i <= 50; i++) {
                Optional<CurrencyExchangeRate> previousRate = repository.findById(
                        CurrencyExchangeRateId.builder()
                            .date(LocalDate.now().minusDays(i))
                            .bank(bankName).build()
                        );
                if (previousRate.isPresent()) {
                    result = previousRate.get().getRate();
                    LOGGER.info("Cannot retrieve rate for " + bankName.name() + ", automatically get rate from " + i + (i > 1 ? " days " : " day ") + "ago");
                    break;
                }
            }
        }
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
                .vibRates(getAllRates("vib"))
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
