package vn.diepgia.mchis.konto_verwaltung.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class YearTotal {
    private int year;
    private double total;
}
