package vn.diepgia.mchis.konto_verwaltung.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TransactionRequest {
    private float value;
    private String date;
    private String description;
}
