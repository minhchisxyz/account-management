package vn.diepgia.mchis.konto_verwaltung.entities.vcb;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class VCBExchangeRateResponse {
    private int Count;
    private String Date;
    private String UpdatedDate;
    private List<VCBCurrency> Data;
}
