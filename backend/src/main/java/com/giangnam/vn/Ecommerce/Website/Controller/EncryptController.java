package com.giangnam.vn.Ecommerce.Website.Controller;

import com.giangnam.vn.Ecommerce.Website.DTO.ShoppingCartDTO;
import com.giangnam.vn.Ecommerce.Website.Entity.CompositeKey.EncryptAcqToMer;
import com.giangnam.vn.Ecommerce.Website.Entity.EncryptCustomToMerchant;
import com.giangnam.vn.Ecommerce.Website.Entity.EncryptMerToAcq;
import com.giangnam.vn.Ecommerce.Website.Entity.Payment;
import com.giangnam.vn.Ecommerce.Website.Entity.Transaction;
import com.giangnam.vn.Ecommerce.Website.Request.PaymentRequest;
import com.giangnam.vn.Ecommerce.Website.Service.Iml.EncryptIml;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

@RestController
@RequestMapping("/encrypt")
public class EncryptController {
    @Autowired
    EncryptIml encryptIml;

    @PostMapping("/addnew-transaction")
    public ResponseEntity<?> addNew(@RequestParam Integer shoppingCartId) {
        return new ResponseEntity<>(encryptIml.addNewTransactionId(shoppingCartId), HttpStatus.OK) ;
    }
    @PostMapping("/add")
    public Integer add() {
        return encryptIml.random();
    }

    @PostMapping(value = "/encryptCusToMer")
    public ResponseEntity<EncryptCustomToMerchant> sendCusToMer(@RequestBody PaymentRequest paymentRequest) {
        try {
            return encryptIml.sendEncryptToMerchant(paymentRequest);
        } catch (Exception ex) {
            System.out.println(ex);
        }
        return null;
    }

    @PostMapping("/decrypt")
    public ResponseEntity<EncryptMerToAcq> getDTO(@RequestBody Test request) {
        return encryptIml.sendEncryptToAcquired(request.getOrderStr(), request.getSlipStr());
    }

    @PostMapping("/ac-to-mer")
    public ResponseEntity<EncryptAcqToMer> sendAcqToMer(@RequestBody ToMer toMer) {
        return encryptIml.sendSignatureToAcq(toMer.getCert(), toMer.getSignatureDigital(), toMer.getDataToVerify());
    }

    @PostMapping("mer-to-cus")
    public ResponseEntity<String> sendMerToCus(@RequestBody ToCus test) {
        return encryptIml.sendSignatureAcqToMer(test.getSignaure(), test.getDataVerify());
    }
}

@Data
@AllArgsConstructor
@NoArgsConstructor
class Test {
    private String orderStr;
    private String slipStr;
}
@Data
@AllArgsConstructor
@NoArgsConstructor
class ToMer {
    private String cert;
    private String signatureDigital;
    private String dataToVerify;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
class ToCus {
    private String signaure;
    private String dataVerify;
}
