package com.example.demo.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.UNPROCESSABLE_ENTITY)
public class ErrorObjectException extends RuntimeException{
	
	public ErrorObjectException(String message) {
        super(message);
    }

}
