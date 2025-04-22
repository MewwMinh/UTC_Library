package edu.utc.demo_01.repository;

import edu.utc.demo_01.dto.statistics.*;
import edu.utc.demo_01.entity.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AchievementRepository extends JpaRepository<Achievement, String> {
    @Query(value = """
        SELECT
            SUM(CASE 
                WHEN r.RoleName = 'STUDENT' THEN 1 
                ELSE 0 
            END) AS soLuongSinhVien,
            SUM(CASE 
                WHEN r.RoleName = 'TEACHER' THEN 1 
                ELSE 0 
            END) AS soLuongGiangVien,
            SUM(CASE 
                WHEN r.RoleName = 'RESEARCHER' THEN 1 
                ELSE 0 
            END) AS soLuongNghienCuuSinh,
            SUM(CASE 
                WHEN r.RoleName = 'PATRON' THEN 1 
                ELSE 0 
            END) AS soLuongNguoiDungKhongThuocTruongGTVT 
        FROM
            Users u 
        LEFT JOIN
            UserRoles ur 
                ON u.UserID = ur.UserID 
        LEFT JOIN
            Roles r 
                ON ur.RoleID = r.RoleID 
        WHERE
            u.Status = 'Hoạt động'
    """, nativeQuery = true)
    PhanLoaiNguoiDung phanLoaiNguoiDung();

    @Query(value = """
        SELECT
            SUM(CASE           
                WHEN m.MembershipType = 'Đồng' THEN 1           
                ELSE 0       
            END) AS soLuongHangDong,
            SUM(CASE           
                WHEN m.MembershipType = 'Bạc' THEN 1           
                ELSE 0       
            END) AS soLuongHangBac,
            SUM(CASE           
                WHEN m.MembershipType = 'Vàng' THEN 1           
                ELSE 0       
            END) AS soLuongHangVang   
        FROM
            Memberships m   
        JOIN
            Users u           
                ON m.UserID = u.UserID   
        WHERE
            u.Status = 'Hoạt động'
    """, nativeQuery = true)
    ThongKeHangThanhVien thongKeHangThanhVien();

    @Query(value = """
        WITH YearRange AS (     SELECT
            YEAR(CURRENT_DATE) - 4 AS nam     
        UNION
        SELECT
            YEAR(CURRENT_DATE) - 3     
        UNION
        SELECT
            YEAR(CURRENT_DATE) - 2     
        UNION
        SELECT
            YEAR(CURRENT_DATE) - 1     
        UNION
        SELECT
            YEAR(CURRENT_DATE) ) SELECT
            yr.nam,
            COUNT(DISTINCT CASE 
                WHEN YEAR(br.BorrowDate) = yr.nam THEN br.RecordID 
            END) AS tongSoSachMuon,
            COUNT(DISTINCT CASE 
                WHEN YEAR(br.ReturnDate) = yr.nam THEN br.RecordID 
            END) AS tongSoSachTra 
        FROM
            YearRange yr 
        LEFT JOIN
            BorrowRecords br 
                ON YEAR(br.BorrowDate) = yr.nam 
                OR YEAR(br.ReturnDate) = yr.nam 
        GROUP BY
            yr.nam 
        ORDER BY
            yr.nam;
    """, nativeQuery = true)
    List<ThongKeMuonTra5NamGanDay> thongKeMuonTra5NamGanDay();

    @Query(value = """
        WITH MonthRange AS (
            SELECT 1 AS thang
            UNION SELECT 2
            UNION SELECT 3
            UNION SELECT 4
            UNION SELECT 5
            UNION SELECT 6
            UNION SELECT 7
            UNION SELECT 8
            UNION SELECT 9
            UNION SELECT 10
            UNION SELECT 11
            UNION SELECT 12
        )
        SELECT 
            mr.thang,
            COUNT(DISTINCT CASE WHEN MONTH(br.BorrowDate) = mr.thang AND YEAR(br.BorrowDate) = :year THEN br.RecordID END) AS tongSoSachMuon,
            COUNT(DISTINCT CASE WHEN MONTH(br.ReturnDate) = mr.thang AND YEAR(br.ReturnDate) = :year THEN br.RecordID END) AS tongSoSachTra
        FROM 
            MonthRange mr
        LEFT JOIN 
            BorrowRecords br ON (MONTH(br.BorrowDate) = mr.thang AND YEAR(br.BorrowDate) = :year)
                             OR (MONTH(br.ReturnDate) = mr.thang AND YEAR(br.ReturnDate) = :year)
        GROUP BY 
            mr.thang
        ORDER BY 
            mr.thang;
    """, nativeQuery = true)
    List<ThongKeMuonTraTheoNam> thongKeMuonTraTheoNam(@Param("year") int year);

    @Query(value = """
        WITH MonthRange AS (
        SELECT 1 AS thang
        UNION SELECT 2
        UNION SELECT 3
        UNION SELECT 4
        UNION SELECT 5
        UNION SELECT 6
        UNION SELECT 7
        UNION SELECT 8
        UNION SELECT 9
        UNION SELECT 10
        UNION SELECT 11
        UNION SELECT 12
    )
    SELECT 
        mr.thang,
        COUNT(DISTINCT CASE WHEN MONTH(rrr.CheckInTime) = mr.thang AND YEAR(rrr.CheckInTime) = :year THEN rrr.RecordID END) AS tongSoLuotSuDung
    FROM 
        MonthRange mr
    LEFT JOIN 
        ReadingRoomRecords rrr ON MONTH(rrr.CheckInTime) = mr.thang 
                               AND YEAR(rrr.CheckInTime) = :year
    GROUP BY 
        mr.thang
    ORDER BY 
        mr.thang
    """, nativeQuery = true)
    List<ThongKeNhuCauSuDungThuVienTheoNam> thongKeNhuCauSuDungThuVienTheoNam(@Param("year") int year);

    @Query(value = """
    WITH DayRange AS (
        SELECT 1 AS ngay
        UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6
        UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11
        UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15 UNION SELECT 16
        UNION SELECT 17 UNION SELECT 18 UNION SELECT 19 UNION SELECT 20 UNION SELECT 21
        UNION SELECT 22 UNION SELECT 23 UNION SELECT 24 UNION SELECT 25 UNION SELECT 26
        UNION SELECT 27 UNION SELECT 28 UNION SELECT 29 UNION SELECT 30 UNION SELECT 31
    )
    SELECT 
        dr.ngay,
        COUNT(DISTINCT CASE 
            WHEN DAY(rrr.CheckInTime) = dr.ngay 
             AND MONTH(rrr.CheckInTime) = :month 
             AND YEAR(rrr.CheckInTime) = :year
        THEN rrr.RecordID END) AS tongSoLuotSuDung
    FROM 
        DayRange dr
    LEFT JOIN 
        ReadingRoomRecords rrr 
        ON DAY(rrr.CheckInTime) = dr.ngay
       AND MONTH(rrr.CheckInTime) = :month
       AND YEAR(rrr.CheckInTime) = :year
    WHERE
        dr.ngay <= DAY(LAST_DAY(STR_TO_DATE(CONCAT(:year, '-', :month, '-01'), '%Y-%m-%d')))
    GROUP BY 
        dr.ngay
    ORDER BY 
        dr.ngay
    """, nativeQuery = true)
    List<ThongKeNhuCauSuDungThuVienTheoThang> thongKeNhuCauSuDungThuVienTheoThang(
            @Param("year") int year,
            @Param("month") int month
    );


    @Query(value = """
        SELECT 
            b.BookID AS maSach,
            b.BookName AS tenSach,
            b.CoverImage AS anhSach,
            COUNT(CASE WHEN MONTH(br.BorrowDate) = :month AND YEAR(br.BorrowDate) = :year THEN br.RecordID END) AS soLuotMuonTrongThang,
            COUNT(CASE WHEN YEAR(br.BorrowDate) = :year THEN br.RecordID END) AS soLuotMuonTrongNam
        FROM 
            Books b
        LEFT JOIN 
            BorrowRecords br ON b.BookID = br.BookID
        GROUP BY 
            b.BookID, b.BookName
        HAVING 
            soLuotMuonTrongThang > 0
        ORDER BY 
            soLuotMuonTrongThang DESC,
            soLuotMuonTrongNam DESC
        LIMIT 10;
    """, nativeQuery = true)
    List<Top10SachDuocMuonNhieuNhatTheoThang> top10SachDuocMuonNhieuNhatTheoThang(@Param("year") int year,
                                                                                  @Param("month") int month);

    @Query(value = """
            SELECT
                (SELECT COUNT(*) FROM Books) AS tongSoDauSach,
                (SELECT SUM(TotalCopies) FROM Books) AS tongSoSach,
                (SELECT COUNT(*) FROM Users WHERE UserType = 'Patron') AS tongSoBanDoc,
                (SELECT COUNT(*) 
                 FROM BorrowRecords 
                 WHERE MONTH(BorrowDate) = MONTH(CURRENT_DATE) 
                 AND YEAR(BorrowDate) = YEAR(CURRENT_DATE)) AS soLuotMuonThangNay,
                (SELECT COUNT(*) 
                 FROM BorrowRecords 
                 WHERE MONTH(ReturnDate) = MONTH(CURRENT_DATE) 
                 AND YEAR(ReturnDate) = YEAR(CURRENT_DATE)) AS soLuotTraThangNay,
                (SELECT COUNT(*) 
                 FROM BookItems 
                 WHERE MONTH(AcquisitionDate) = MONTH(CURRENT_DATE) 
                 AND YEAR(AcquisitionDate) = YEAR(CURRENT_DATE)) AS soLuongSachNhapVaoThangNay
            FROM
                DUAL;
    """, nativeQuery = true)
    TongHopThongKe tongHopThongKe();

//    @Query(value = """
//
//    """, nativeQuery = true)
//    PhanLoaiNguoiDung phanLoaiNguoiDung();
}