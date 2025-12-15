package vn.diepgia.mchis.konto_verwaltung.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Month;

@Data
@Builder
public class MonthTotal {
    private Month month;
    private double total;
}
