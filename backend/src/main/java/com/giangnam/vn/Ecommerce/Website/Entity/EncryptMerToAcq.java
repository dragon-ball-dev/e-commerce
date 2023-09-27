package com.giangnam.vn.Ecommerce.Website.Entity;

import lombok.Data;

@Data

public class EncryptMerToAcq {
    private String CertM;
    private String SignatureDigital;
    private String dataToVerify;
}
