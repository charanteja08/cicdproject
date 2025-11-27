package com.agrizen.controller;

import com.agrizen.auth.service.PasswordValidator;
import com.agrizen.model.Register;
import com.agrizen.repository.RegisterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/register")
@CrossOrigin
public class RegisterController {
    @Autowired
    private RegisterRepository registerRepository;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    @Autowired
    private PasswordValidator passwordValidator;

    @PostMapping
    public Register saveRegister(@RequestBody Register register) {
        // Validate password requirements
        if (register.getPassword() == null || !passwordValidator.isValid(register.getPassword())) {
            throw new IllegalArgumentException(passwordValidator.getValidationErrorMessage(register.getPassword()));
        }
        
        // Encrypt password before saving
        String encryptedPassword = passwordEncoder.encode(register.getPassword());
        register.setPassword(encryptedPassword);
        
        return registerRepository.save(register);
    }
} 