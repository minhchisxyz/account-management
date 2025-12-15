package vn.diepgia.mchis.konto_verwaltung.entities;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class CurrencyExchangeRate {
    @EmbeddedId
    private CurrencyExchangeRateId id;
    private float rate;
    private LocalDateTime lastUpdated;

    @Override
    public String toString() {
        return String.format("%s,%s,%s", id.getBank(), id.getDate().format(DateTimeFormatter.ISO_DATE), rate);
    }
}
