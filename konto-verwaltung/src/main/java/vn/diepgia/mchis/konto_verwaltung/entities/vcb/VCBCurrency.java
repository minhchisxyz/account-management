package vn.diepgia.mchis.konto_verwaltung.entities.vcb;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VCBCurrency {
    private String currencyName;
    private String currencyCode;
    private float cash;
    private float transfer;
    private float sell;
    private String icon;
}
