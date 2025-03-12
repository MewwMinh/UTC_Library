package edu.utc.demo_01.exception;

import edu.utc.demo_01.dto.APIResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(value = RuntimeException.class)
    ResponseEntity<APIResponse> handlingRuntimeException(RuntimeException e) {
        APIResponse apiResponse = new APIResponse();
        apiResponse.setCode(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode());
        apiResponse.setMessage(ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }
    @ExceptionHandler(value = AppException.class)
    ResponseEntity<APIResponse> handlingAppException(AppException e) {
        ErrorCode errorCode = e.getErrorCode();
        APIResponse apiResponse = new APIResponse();
        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(errorCode.getMessage());
        return ResponseEntity
                .status(errorCode.getHttpStatusCode())
                .body(apiResponse);
    }

//    @ExceptionHandler(value = AccessDeniedException.class)
//    ResponseEntity<APIResponse> handlingAccessDeniedException(AccessDeniedException e) {
//        ErrorCode errorCode = ErrorCode.UNAUTHORRIZED;
//        return ResponseEntity
//                .status(errorCode.getHttpStatusCode())
//                .body(APIResponse.builder()
//                        .code(errorCode.getCode())
//                        .message(errorCode.getMessage())
//                        .build());
//    }
//
//    @ExceptionHandler(value = MethodArgumentNotValidException.class)
//    ResponseEntity<APIResponse> handlingValidation(MethodArgumentNotValidException e) {
//        String enumkey = e.getFieldError().getDefaultMessage();
//        ErrorCode errorCode = ErrorCode.valueOf(enumkey);
//        APIResponse apiResponse = new APIResponse();
//        apiResponse.setCode(errorCode.getCode());
//        apiResponse.setMessage(errorCode.getMessage());
//        return ResponseEntity.badRequest().body(apiResponse);
//    }
}
