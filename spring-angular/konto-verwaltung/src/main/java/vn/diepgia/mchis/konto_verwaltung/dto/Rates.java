package vn.diepgia.mchis.konto_verwaltung.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.diepgia.mchis.konto_verwaltung.entities.CurrencyExchangeRate;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Rates {
    private List<CurrencyExchangeRate> vibRates;
    private List<CurrencyExchangeRate> vcbRates;
}
