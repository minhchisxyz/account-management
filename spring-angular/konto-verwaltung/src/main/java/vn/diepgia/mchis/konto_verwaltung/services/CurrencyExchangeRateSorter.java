package vn.diepgia.mchis.konto_verwaltung.services;

import org.springframework.stereotype.Service;
import vn.diepgia.mchis.konto_verwaltung.entities.CurrencyExchangeRate;

import java.util.Comparator;

@Service
public class CurrencyExchangeRateSorter implements Comparator<CurrencyExchangeRate> {
    @Override
    public int compare(CurrencyExchangeRate o1, CurrencyExchangeRate o2) {
        return o1.getId().getDate().compareTo(o2.getId().getDate());
    }
}
