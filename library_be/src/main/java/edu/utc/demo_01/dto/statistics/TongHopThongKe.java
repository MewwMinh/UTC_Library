package edu.utc.demo_01.dto.statistics;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TongHopThongKe {
    Long tongSoDauSach;
    BigDecimal tongSoSach;
    Long tongSoBanDoc;
    Long soLuotMuonThangNay;
    Long soLuotTraThangNay;
    Long soLuongSachNhapVaoThangNay;
}
