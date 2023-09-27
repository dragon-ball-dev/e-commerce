package com.giangnam.vn.Ecommerce.Website.Controller;

import com.giangnam.vn.Ecommerce.Website.DTO.ShopOrderDTO;
import com.giangnam.vn.Ecommerce.Website.Service.ShopOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/order")
public class ShopOrderController {
    @Autowired
    ShopOrderService shopOrderService;

    @GetMapping("/getOrder")
    public ResponseEntity<ShopOrderDTO> getShop(@RequestParam Integer id) {
        return shopOrderService.getOrder(id);
    }
}
