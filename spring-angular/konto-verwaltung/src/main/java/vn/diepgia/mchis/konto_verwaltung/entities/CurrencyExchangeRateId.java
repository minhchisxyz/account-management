package vn.diepgia.mchis.konto_verwaltung.entities;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
@Builder
public class CurrencyExchangeRateId implements Serializable {
    private BankName bank;
    private LocalDate date;
}
