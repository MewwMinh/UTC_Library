package edu.utc.demo_01.dto.statistics;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Top10SachDuocMuonNhieuNhatTheoThang {
    String maSach;
    String tenSach;
    String anhSach;
    Long soLuotMuonTrongThang;
    Long soLuotMuonTrongNam;
}
