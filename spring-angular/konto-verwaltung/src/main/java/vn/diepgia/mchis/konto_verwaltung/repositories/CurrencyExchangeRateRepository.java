package vn.diepgia.mchis.konto_verwaltung.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.diepgia.mchis.konto_verwaltung.entities.CurrencyExchangeRate;
import vn.diepgia.mchis.konto_verwaltung.entities.CurrencyExchangeRateId;

public interface CurrencyExchangeRateRepository extends JpaRepository<CurrencyExchangeRate, CurrencyExchangeRateId> {
}
