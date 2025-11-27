package com.agrizen.controller;

import com.agrizen.model.Payment;
import com.agrizen.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin
public class PaymentController {
    @Autowired
    private PaymentRepository paymentRepository;

    @GetMapping
    public ResponseEntity<List<Payment>> getAll() {
        return ResponseEntity.ok(paymentRepository.findAll());
    }

    @PostMapping
    public Payment savePayment(@RequestBody Payment payment) {
        return paymentRepository.save(payment);
    }
} 