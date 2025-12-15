package vn.diepgia.mchis.konto_verwaltung.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import vn.diepgia.mchis.konto_verwaltung.entities.Transaction;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Integer> {

}
