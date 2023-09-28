package com.giangnam.vn.Ecommerce.Website.Service.Iml;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.giangnam.vn.Ecommerce.Website.DTO.Render;
import com.giangnam.vn.Ecommerce.Website.DTO.ShoppingCartDTO;
import com.giangnam.vn.Ecommerce.Website.Entity.*;
import com.giangnam.vn.Ecommerce.Website.Entity.CompositeKey.EncryptAcqToMer;
import com.giangnam.vn.Ecommerce.Website.Repository.PaymentRepository;
import com.giangnam.vn.Ecommerce.Website.Repository.Shopping_CartRepository;
import com.giangnam.vn.Ecommerce.Website.Repository.UserRepository;
import com.giangnam.vn.Ecommerce.Website.Request.PaymentRequest;
import com.giangnam.vn.Ecommerce.Website.Service.EncryptService;
import com.nimbusds.jose.shaded.gson.Gson;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.x509.X509V3CertificateGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.security.auth.x500.X500Principal;
import java.io.*;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.*;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
@Service
public class EncryptIml implements EncryptService {
    final static int key_size = 2048;
    public static String publicKeyMerchant = "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA3nPdfrVgtxCjwhUtoZJt5u84qyUxXkXfx/UqO6GEEdrkjNYekUU3OgPPELfEdS1lZRc8AfZ6mxt3hrQ9a1x4E9ymKR9mAl4TaBg2X/xp51Wpl/8/aATVpEY+JEZjeorZA7U1rQvZl0Y8fhbFckiWmewK+SIAqEpMAiuLt+YAneym1zmBNDd14DXI0+qbeKHUVbNWHdoba0VhRGtFpJjL2iT2GEVIuuRI3lKYxDEA1H2aT0InNvkrU/vYmdjECqmxIhChDc4IHSDFNBAQPDPlKOsdTUvcJWj/nGh0TipWcxSi0iV7HP65HjO2GNaYT2Wi/mjY0fmOXzoxAHawEAs8rfeBHmfKE0x0gh70AvJGJ59j6aMpRLmOKrxuwBn8ePT4XtGHQhWfHt964ZoSDy5jXJWpezPBHa5h5VKakEWDzxw4fii+qvzuz2fmi5G/08mW46w0FCblL7ReTsUvpBUgOFLVhbehexy/2iCYhtu2ei21pz7IISD7yck4Okm+8lHctNiPrquWalCeGpN23H5YwuohWQu83zZ6yRhLIu+sFmpYq8doQfuau3xglSx/ywDr6aXw0aJTbnrKRmtsWhzs7rVq7LEfAoX+TsAXmoqvMJa9zsBcG4IyU/P9vCEbvhGgalYLu1beh7brMqQhQsmp/6fYSD+3Q71iqQYPpam9RT0CAwEAAQ==";
    // mã base64
    public static String privateKeyMerchant = "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";
    public static String publicKeyAcquired = "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA3nPdfrVgtxCjwhUtoZJt5u84qyUxXkXfx/UqO6GEEdrkjNYekUU3OgPPELfEdS1lZRc8AfZ6mxt3hrQ9a1x4E9ymKR9mAl4TaBg2X/xp51Wpl/8/aATVpEY+JEZjeorZA7U1rQvZl0Y8fhbFckiWmewK+SIAqEpMAiuLt+YAneym1zmBNDd14DXI0+qbeKHUVbNWHdoba0VhRGtFpJjL2iT2GEVIuuRI3lKYxDEA1H2aT0InNvkrU/vYmdjECqmxIhChDc4IHSDFNBAQPDPlKOsdTUvcJWj/nGh0TipWcxSi0iV7HP65HjO2GNaYT2Wi/mjY0fmOXzoxAHawEAs8rfeBHmfKE0x0gh70AvJGJ59j6aMpRLmOKrxuwBn8ePT4XtGHQhWfHt964ZoSDy5jXJWpezPBHa5h5VKakEWDzxw4fii+qvzuz2fmi5G/08mW46w0FCblL7ReTsUvpBUgOFLVhbehexy/2iCYhtu2ei21pz7IISD7yck4Okm+8lHctNiPrquWalCeGpN23H5YwuohWQu83zZ6yRhLIu+sFmpYq8doQfuau3xglSx/ywDr6aXw0aJTbnrKRmtsWhzs7rVq7LEfAoX+TsAXmoqvMJa9zsBcG4IyU/P9vCEbvhGgalYLu1beh7brMqQhQsmp/6fYSD+3Q71iqQYPpam9RT0CAwEAAQ==";
//    public static String privateKeyAcquires = "privateKeyAcquires";
    static {
        Security.addProvider(new BouncyCastleProvider());
    }
    @Autowired
    PaymentRepository paymentRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    Shopping_CartRepository shoppingCartRepository;
    @Override
    public Transaction addNewTransactionId(Integer shoppingCartId) {
//        Random random = new Random();
        Optional<Shopping_Cart> shoppingCartOptional = shoppingCartRepository.findById(shoppingCartId);
        if (!shoppingCartOptional.isPresent()) {
            return null;
        }

        int idCus = random();
        int idMer = random();
        Transaction transaction = new Transaction();
        transaction.setTransactionIdCustomer(String.valueOf(idCus));
        transaction.setTransactionIdMerchant(String.valueOf(idMer));

        Shopping_Cart shopping_cart = shoppingCartOptional.get();
        shopping_cart.setTransactionIdCustomer(Integer.toString(idCus));
        shopping_cart.setTransactionIdMerchant(Integer.toString(idMer));
        shoppingCartRepository.save(shopping_cart);

        return transaction;
    }

    @Override
    public ResponseEntity<EncryptCustomToMerchant> sendEncryptToMerchant(PaymentRequest paymentRequest) {

        try {
            // tạo mã ckhai của merchant
            byte[] pkMerchantByte = Base64.getDecoder().decode(publicKeyMerchant);
            X509EncodedKeySpec keySpec = new X509EncodedKeySpec(pkMerchantByte);
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            PublicKey pbulicKeyMerchant = keyFactory.generatePublic(keySpec);

            // tạo khóa công khai của acquired
            byte[] pkAcquiredByte = Base64.getDecoder().decode(publicKeyAcquired);
            X509EncodedKeySpec keySpec1 = new X509EncodedKeySpec(pkAcquiredByte);
            KeyFactory keyFactoryAcquired = KeyFactory.getInstance("RSA");
            PublicKey pbulicKeyAcquired = keyFactoryAcquired.generatePublic(keySpec1);


            Cipher cipherMer = Cipher.getInstance("RSA/ECB/PKCS1Padding");
            cipherMer.init(Cipher.ENCRYPT_MODE, pbulicKeyMerchant);

            Cipher cipherAcquired = Cipher.getInstance("RSA/ECB/PKCS1Padding");
            cipherAcquired.init(Cipher.ENCRYPT_MODE, pbulicKeyAcquired);

            Optional<Shopping_Cart> shoppingCart = shoppingCartRepository.findById(paymentRequest.getShoppingCartId());
            if (shoppingCart.isPresent()) {

                Shopping_Cart shopping_cart = shoppingCart.get();

                ShoppingCartDTO shoppingCartDTO = new ShoppingCartDTO();
                shoppingCartDTO.setId(shopping_cart.getId());
                shoppingCartDTO.setTransactionIdMerchant(shopping_cart.getTransactionIdMerchant());
                shoppingCartDTO.setTransactionIdCustomer(shopping_cart.getTransactionIdCustomer());

                SLIP slip = new SLIP();
                slip.setTransactionIdMerchant(shoppingCartDTO.getTransactionIdMerchant());
                slip.setTransactionIdCustomer(shoppingCartDTO.getTransactionIdCustomer());
                slip.setPinCode(paymentRequest.getPinCode());
                slip.setCreditCardNumber(paymentRequest.getCreditCardNumber());


                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                ObjectOutputStream objectOutputStream = new ObjectOutputStream(byteArrayOutputStream);
                objectOutputStream.writeObject(shoppingCartDTO);
                byte[] orderByte = byteArrayOutputStream.toByteArray(); // m hóa
                objectOutputStream.close();

                ByteArrayOutputStream byteArrayOutputStream1 = new ByteArrayOutputStream();
                ObjectOutputStream objectOutputStream1 = new ObjectOutputStream(byteArrayOutputStream1);
                objectOutputStream1.writeObject(slip);
                byte[] slipByte = byteArrayOutputStream1.toByteArray(); // m hóa
                objectOutputStream1.close();

                byte[] encryptOrder = cipherMer.doFinal(orderByte);
                byte[] encryptSlip = cipherAcquired.doFinal(slipByte);


                String encryptShoppingCart = Base64.getEncoder().encodeToString(encryptOrder);
                String encryptSlipS = Base64.getEncoder().encodeToString(encryptSlip);

                EncryptCustomToMerchant encryptCustomToMerchant = new EncryptCustomToMerchant();
                encryptCustomToMerchant.setEMOrder(encryptShoppingCart);
                encryptCustomToMerchant.setEASlip(encryptSlipS);

                System.out.println(encryptShoppingCart);
                System.out.println(encryptSlipS);

                return new ResponseEntity<>(encryptCustomToMerchant, HttpStatus.OK);
            }
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public ResponseEntity<EncryptMerToAcq> sendEncryptToAcquired(String EmOrder, String EaSlip) {
        try {
            // publickey Mer
            byte[] pkMerchantByte = Base64.getDecoder().decode(publicKeyMerchant);
            X509EncodedKeySpec keySpec1 = new X509EncodedKeySpec(pkMerchantByte);
            KeyFactory keyFactory1 = KeyFactory.getInstance("RSA");
            PublicKey pbulicKeyMerchant = keyFactory1.generatePublic(keySpec1);

            byte[] privateKeyBytes = Base64.getDecoder().decode(privateKeyMerchant);
            PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(privateKeyBytes);
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            PrivateKey privateKeyMer = keyFactory.generatePrivate(keySpec);

            Cipher cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding");
            cipher.init(Cipher.DECRYPT_MODE, privateKeyMer);

            byte[] encryptByte = Base64.getDecoder().decode(EmOrder);
            int t = encryptByte.length;
            byte[] decryptByte = cipher.doFinal(encryptByte);

            ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(decryptByte);
            ObjectInputStream objectInputStream = new ObjectInputStream(byteArrayInputStream);
            ShoppingCartDTO shoppingCartDTO = (ShoppingCartDTO) objectInputStream.readObject();
            objectInputStream.close();

            Gson gson = new Gson();
            String shoppingCartJson = gson.toJson(shoppingCartDTO);

            //hash(Order) dạng StringBuilder.toString
            String hashShoppingCart = calculateSHA256Hash(shoppingCartJson);
            String hashShoppingCartBase64 = Base64.getEncoder().encodeToString(hashShoppingCart.getBytes());

            Signature signature = Signature.getInstance("SHA256withRSA");
            signature.initSign(privateKeyMer);

            // chuỗi base64
            String dataToSign = EaSlip + "\\|" + hashShoppingCartBase64;
            signature.update(dataToSign.getBytes(StandardCharsets.UTF_8));

            // ký chữ ký và lấy dữ liệu
            byte[] signatureBytes = signature.sign();
            String signatureString = Base64.getEncoder().encodeToString(signatureBytes);

            //lưu cert
            X509Certificate cert = generateSelfSignedCertificate(pbulicKeyMerchant, privateKeyMer);
            String filePath = "D:\\iKP\\2KP\\e-commerce-2kp\\backend\\CERTM.txt";
            saveCertificateToTxtFile(cert, filePath);

            // bản chứng thực String
            String certM = Base64.getEncoder().encodeToString(cert.getEncoded());
            System.out.println(certM.length());

            EncryptMerToAcq encryptMerToAcq = new EncryptMerToAcq();
            encryptMerToAcq.setCertM(certM);
            encryptMerToAcq.setSignatureDigital(signatureString);
            encryptMerToAcq.setDataToVerify(dataToSign);

            return new ResponseEntity<>(encryptMerToAcq, HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    // actomer
    @Override
    public ResponseEntity<EncryptAcqToMer> sendSignatureToAcq(String cert, String signatureDigital, String dataToVerify) {
        try {


            //base64 của chữ kí số, bản chứng thực khóa công khai
            byte[] signatureBytes = Base64.getDecoder().decode(signatureDigital);
            byte[] certBytes = Base64.getDecoder().decode(cert);


            //lấy khóa bí mật
            byte[] privateKeyBytes = Base64.getDecoder().decode(privateKeyMerchant);
            PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(privateKeyBytes);
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            PrivateKey privateKeyMer = keyFactory.generatePrivate(keySpec);

            // Lấy khóa công khai từ CERTM
//            PublicKey publicKeyMer = certM.getPublicKey();
            X509Certificate publicKeyCert = getCertificateFromBytes(certBytes);


            //Tạo đối tượng Signature và cấu hình để xác thực chữ ký
            Signature signature = Signature.getInstance("SHA256withRSA");
            signature.initVerify(publicKeyCert);

            signature.update(dataToVerify.getBytes("UTF-8"));

            // Xác thực chữ ký số
//            boolean isSignatureValid = signature.verify(signatureBytes);
            Auth auth = new Auth();

            if (signature.verify(signatureBytes)) {
                auth.setReplyInfo("Agree transaction");
                String eaSlipAndHOrder = dataToVerify;
                String[] parts = eaSlipAndHOrder.split("\\|");
                if (parts.length == 2) {
                    String eaSlip = parts[0];
                    String hOrder = parts[1];

                    // chuyển Auth thành bytes[]
                    ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                    ObjectOutputStream objectOutputStream = new ObjectOutputStream(byteArrayOutputStream);
                    objectOutputStream.writeObject(auth);
                    byte[] authByte = byteArrayOutputStream.toByteArray(); // m hóa
                    objectOutputStream.close();

                    //chuyển authByte sang String
                    String authBase64 = Base64.getEncoder().encodeToString(authByte);

                    // chữ kí số auth, easlip và horder
                    String dataToSign = authBase64 + "\\|" + eaSlip + "\\|" + hOrder;

                    Signature signature1 = Signature.getInstance("SHA256withRSA");
                    signature1.initSign(privateKeyMer);
                    signature1.update(dataToSign.getBytes(StandardCharsets.UTF_8));

                    //tạo chữ kí số
                    byte[] signatureToMerBytes = signature1.sign();

                    // Chuyển đổi chữ ký số thành chuỗi Base64
                    String signatureBase64 = Base64.getEncoder().encodeToString(signatureToMerBytes);
                    EncryptAcqToMer encryptAcqToMer = new EncryptAcqToMer();
                    encryptAcqToMer.setSignatureDigital(signatureBase64);
                    encryptAcqToMer.setAuth("Agree transaction");
                    encryptAcqToMer.setDataToSign(dataToSign);

                    return new ResponseEntity<>(encryptAcqToMer, HttpStatus.OK);
                } else {
                    System.out.println("Không thể tách được EA(SLIP) và H(ORDER) từ chữ ký số.");
                    return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
                }
            } else {
                auth.setReplyInfo("Degress transaction");
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    //mertocus
    @Override
    public ResponseEntity<Render> sendSignatureAcqToMer(String signatureDigital, String dataVerify) {
        try {
            // byte chữ kí số
            byte[] signatureBytes = Base64.getDecoder().decode(signatureDigital);

            byte[] pkMerchantByte = Base64.getDecoder().decode(publicKeyMerchant);
            X509EncodedKeySpec keySpec1 = new X509EncodedKeySpec(pkMerchantByte);
            KeyFactory keyFactory1 = KeyFactory.getInstance("RSA");
            PublicKey pbulicKeyMerchant = keyFactory1.generatePublic(keySpec1);

            Signature signature = Signature.getInstance("SHA256withRSA");
            signature.initVerify(pbulicKeyMerchant);

            signature.update(dataVerify.getBytes("UTF-8"));
            if (signature.verify(signatureBytes)) {
                Render render = new Render();
                render.setRender("Agree transaction");
                return new ResponseEntity<>(render, HttpStatus.OK);
            }

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return null;
    }

    private static X509Certificate getCertificateFromBytes(byte[] certificateBytes) throws Exception {
        CertificateFactory certificateFactory = CertificateFactory.getInstance("X.509");
        ByteArrayInputStream bais = new ByteArrayInputStream(certificateBytes);
        return (X509Certificate) certificateFactory.generateCertificate(bais);
    }



    public static String extractHOrder(byte[] decryptedBytes) {
        String utf8Base64 = new String(decryptedBytes, java.nio.charset.StandardCharsets.UTF_8);
        // Giải mã base64 để lấy giá trị H(ORDER)
        byte[] hOrderBytes = Base64.getDecoder().decode(utf8Base64);
        // Chuyển đổi giá trị byte thành chuỗi UTF-8
        String hOrder = new String(hOrderBytes, java.nio.charset.StandardCharsets.UTF_8);
        return hOrder;
    }

    //lưu CERT vào file.txt
    public static void saveCertificateToTxtFile(X509Certificate certificate, String filePath) throws Exception {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath))) {
            // Ghi chứng thực vào tệp văn bản
            writer.write("-----BEGIN CERTIFICATE-----");
            writer.newLine();
            writer.write(Base64.getEncoder().encodeToString(certificate.getEncoded()));
            writer.newLine();
            writer.write("-----END CERTIFICATE-----");
            writer.newLine();
        }
    }

    //tạo chứng thực
    public static X509Certificate generateSelfSignedCertificate(PublicKey publicKey, PrivateKey privateKey)
            throws Exception {
        // Tạo một bản chứng thực X.509
        X509V3CertificateGenerator certGen = new X509V3CertificateGenerator();
        X500Principal dnName = new X500Principal("CN=MyCert");

        // Cài đặt thông tin chứng thực
        certGen.setSerialNumber(new BigInteger(32, new SecureRandom()));
        certGen.setSubjectDN(dnName);
        certGen.setIssuerDN(dnName);
        certGen.setNotBefore(new Date(System.currentTimeMillis() - 1000L * 60 * 60 * 24 * 30)); // Ngày hiện tại trừ 30 ngày
        certGen.setNotAfter(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24 * 365)); // Ngày hiện tại cộng 1 năm
        certGen.setPublicKey(publicKey);
        certGen.setSignatureAlgorithm("SHA256WithRSAEncryption");

        // Tạo chứng thực tự ký bằng cách ký bằng khóa bí mật
        X509Certificate cert = certGen.generate(privateKey, "BC");

        return cert;
    }
    //tạo mã băm sha-256
    public static String calculateSHA256Hash(String input) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hashBytes = digest.digest(input.getBytes(StandardCharsets.UTF_8));

        // Chuyển đổi byte[] thành chuỗi hex
        StringBuilder hexString = new StringBuilder();
        for (byte hashByte : hashBytes) {
            String hex = Integer.toHexString(0xff & hashByte);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }

        return hexString.toString();
    }

    public static byte[] decryptShoppingCart(String EmOrder, PrivateKey privateKey) {
        try {
            Cipher cipherMer = Cipher.getInstance("RSA/ECB/PKCS1Padding");
            cipherMer.init(Cipher.DECRYPT_MODE, privateKey);

            byte[] encryptByte = Base64.getDecoder().decode(EmOrder);
            byte[] decryptByte = cipherMer.doFinal(encryptByte);


            return decryptByte;
        } catch (Exception e) {
            throw new RuntimeException("Error decrypt data", e);
        }
    }

    public static ShoppingCartDTO deserializeShoppingCartDTO(byte[] orderByte){
        try {
            ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(orderByte);
            ObjectInputStream objectInputStream = new ObjectInputStream(byteArrayInputStream);
            ShoppingCartDTO shoppingCartDTO = (ShoppingCartDTO) objectInputStream.readObject();
            objectInputStream.close();
            byteArrayInputStream.close();
            return shoppingCartDTO;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

        // đọc file private
    public static String readTextFile(String filePath) {
        StringBuilder content = new StringBuilder();

        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = br.readLine()) != null) {
                content.append(line).append("\n");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return content.toString();
    }

    public Integer random() {
        Random random = new Random();
        return random.nextInt(999999 - 100000) +100000;
    }

    public static void main(String[] args) throws Exception {
        // Tạo cặp khóa RSA

//        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA", "BC");
//        keyPairGenerator.initialize(4096); // Độ dài khóa, bạn có thể thay đổi nếu cần
//        KeyPair keyPair = keyPairGenerator.generateKeyPair();
//
//        PublicKey publicKey = keyPair.getPublic();
//        PrivateKey privateKey = keyPair.getPrivate();
//
//        // Chuyển đổi khóa thành chuỗi
//        String publicKeyString = Base64.getEncoder().encodeToString(publicKey.getEncoded());
//        String privateKeyString = Base64.getEncoder().encodeToString(privateKey.getEncoded());
//
//        // Lưu khóa vào tệp văn bản
//        saveKeyToFile("public_key.txt", publicKeyString);
//        saveKeyToFile("private_key.txt", privateKeyString);
        String filePath = "D:\\iKP\\2KP\\e-commerce-2kp\\backend\\private_key.txt"; // Đường dẫn đến tệp văn bản của bạn

        String str = readTextFile(filePath);
        System.out.println(str);

    }
//    private static void saveKeyToFile(String fileName, String key) throws Exception {
//        try (FileWriter fileWriter = new FileWriter(fileName)) {
//            fileWriter.write(key);
//        }
//    }
}
