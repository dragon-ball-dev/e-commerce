package com.giangnam.vn.Ecommerce.Website.Service;

import com.giangnam.vn.Ecommerce.Website.DTO.ShoppingCartDTO;
import com.giangnam.vn.Ecommerce.Website.Entity.CompositeKey.EncryptAcqToMer;
import com.giangnam.vn.Ecommerce.Website.Entity.EncryptCustomToMerchant;
import com.giangnam.vn.Ecommerce.Website.Entity.EncryptMerToAcq;
import com.giangnam.vn.Ecommerce.Website.Entity.Payment;
import com.giangnam.vn.Ecommerce.Website.Entity.Transaction;
import com.giangnam.vn.Ecommerce.Website.Request.PaymentRequest;
import org.springframework.http.ResponseEntity;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

public interface EncryptService {
    public Transaction addNewTransactionId(Integer id);
    public ResponseEntity<EncryptCustomToMerchant> sendEncryptToMerchant(PaymentRequest paymentRequest);

    public ResponseEntity<EncryptMerToAcq> sendEncryptToAcquired(String EmOrder, String EaSlip);

    public ResponseEntity<EncryptAcqToMer> sendSignatureToAcq(String cert, String signatureDigital, String dataVerify);

    public ResponseEntity<String> sendSignatureAcqToMer(String signatureDigital, String dataVerify);
}
