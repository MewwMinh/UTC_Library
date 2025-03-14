package edu.utc.demo_01.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION("Error", 999, HttpStatus.INTERNAL_SERVER_ERROR),
    USER_NOT_EXISTED("Tài khoản không tồn tại", 1001, HttpStatus.BAD_REQUEST),
    WRONG_PASSWORD("Mật khẩu không đúng", 1002, HttpStatus.BAD_REQUEST),
    CAN_NOT_CREATE_TOKEN("Không thể tạo token", 1003, HttpStatus.BAD_REQUEST),
    CAN_NOT_GET_USER_INFORMATION("Không thể lấy thông tin người dùng", 1004, HttpStatus.NOT_FOUND),
    TOKEN_HAS_EXPIRED("Token đã hết hạn", 1005, HttpStatus.UNAUTHORIZED),
    SESSION_HAS_EXPIRED("Phiên đăng nhập hết hạn", 1006, HttpStatus.UNAUTHORIZED),
    CAN_NOT_FIND_BOOK("Không thể tìm thấy sách", 1007, HttpStatus.NOT_FOUND),
    CAN_NOT_FIND_CLASSIFICATION("Không thể tìm thấy mã phân loại sách", 1008, HttpStatus.NOT_FOUND),
    CAN_NOT_FIND_BORROW_RECORD("Không thể tìm thấy bản ghi mượn cuốn sách này", 1009, HttpStatus.NOT_FOUND),
    USER_REVIEWED("Bạn đã đánh giá cuốn sách này rồi, không thể đánh giá lại !!", 1010, HttpStatus.BAD_REQUEST),
    ;

    ErrorCode(String message, int code, HttpStatusCode httpStatusCode) {
        this.message = message;
        this.code = code;
        this.httpStatusCode = httpStatusCode;
    }

    private int code;
    private String message;
    private HttpStatusCode httpStatusCode;
}
