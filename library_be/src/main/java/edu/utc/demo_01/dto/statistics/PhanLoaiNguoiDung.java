package edu.utc.demo_01.dto.statistics;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PhanLoaiNguoiDung {
    BigDecimal soLuongSinhVien;
    BigDecimal soLuongGiangVien;
    BigDecimal soLuongNghienCuuSinh;
    BigDecimal soLuongNguoiDungKhongThuocTruongGTVT;
}
