package edu.utc.demo_01.dto.statistics;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ThongKeHangThanhVien {
    BigDecimal soLuongHangDong;
    BigDecimal soLuongHangBac;
    BigDecimal soLuongHangVang;
}
