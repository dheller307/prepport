package com.prepport.controller;

import com.prepport.dto.ApiErrorResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class ApiExceptionHandler {

  @ExceptionHandler(ResponseStatusException.class)
  public ResponseEntity<ApiErrorResponse> handleResponseStatusException(
      ResponseStatusException exception) {
    String message =
        exception.getReason() == null ? "Request could not be completed" : exception.getReason();

    return ResponseEntity.status(exception.getStatusCode()).body(new ApiErrorResponse(message));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiErrorResponse> handleValidationException(
      MethodArgumentNotValidException exception) {
    FieldError fieldError = exception.getBindingResult().getFieldError();
    String message =
        fieldError == null ? "One or more fields are invalid" : fieldError.getDefaultMessage();

    return ResponseEntity.badRequest().body(new ApiErrorResponse(message));
  }
}
