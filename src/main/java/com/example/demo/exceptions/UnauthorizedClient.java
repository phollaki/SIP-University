package com.example.demo.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value=HttpStatus.UNAUTHORIZED)
public class UnauthorizedClient extends RuntimeException {
	
	public UnauthorizedClient(String message) {
        super(message);
    }
}
