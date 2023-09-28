package com.giangnam.vn.Ecommerce.Website.DTO;

import lombok.Data;

import java.util.Date;

@Data
public class ShopOrderDTO {
    private Date orderDate;
    private Integer orderTotal;
    private String description;
    private String currency;
    private String address;
}
