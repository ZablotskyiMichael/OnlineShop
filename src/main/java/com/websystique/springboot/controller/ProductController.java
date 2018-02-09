package com.websystique.springboot.controller;

import com.websystique.springboot.model.*;
import com.websystique.springboot.repositories.CategoryRepository;
import com.websystique.springboot.repositories.ProductRepository;
import com.websystique.springboot.repositories.PurchaseRepository;
import com.websystique.springboot.service.*;
import com.websystique.springboot.util.CustomErrorType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/user")
public class ProductController {

    public static final Logger logger = LoggerFactory.getLogger(RestApiController.class);

    @Autowired
    UserService userService;
    @Autowired
    CategoryRepository categoryRepository;
    @Autowired
    PurchaseService purchaseService;
    @Autowired
    ProductService productService;
    @Autowired
    StorageService storageService;
    @Autowired
    PropertiesService propertiesService;

    @RequestMapping(value = "/product/", method = RequestMethod.GET)
    public ResponseEntity<List<Product>> listAllProducts() {
        List<Product> products = productService.findAllProducts();
        if (products.isEmpty()) {
            return new ResponseEntity(HttpStatus.NO_CONTENT);
            // You many decide to return HttpStatus.NOT_FOUND
        }
        return new ResponseEntity<List<Product>>(products, HttpStatus.OK);
    }
    @RequestMapping(value = "/purchase/", method = RequestMethod.GET)
    public ResponseEntity<List<Purchase>> listAllPurchases() {
        List<Purchase> purchases = purchaseService.findAllPurchase();
        if (purchases.isEmpty()) {
            return new ResponseEntity(HttpStatus.NO_CONTENT);
            // You many decide to return HttpStatus.NOT_FOUND
        }
        return new ResponseEntity<List<Purchase>>(purchases, HttpStatus.OK);
    }
    @RequestMapping(value = "/pfilter/", method = RequestMethod.GET)
    public ResponseEntity<List<Purchase>> listPurchasesByUser() {
        List<Purchase> purchases = purchaseService.findPurchaseByUser();
        if (purchases.isEmpty()) {
            return new ResponseEntity(HttpStatus.NO_CONTENT);
            // You many decide to return HttpStatus.NOT_FOUND
        }
        return new ResponseEntity<List<Purchase>>(purchases, HttpStatus.OK);
    }

    @RequestMapping(value = "/product/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getProduct(@PathVariable("id") long id) {
        logger.info("Fetching product with id {}", id);
        Product product = productService.findById(id);
        if (product == null) {
            logger.error("product with id {} not found.", id);
            return new ResponseEntity(new CustomErrorType("Product with id " + id
                    + " not found"), HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<Product>(product, HttpStatus.OK);
    }
    /*@RequestMapping(value = "/purchase/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getPurchase(@PathVariable("id") long id) {
        logger.info("Fetching purchase with id {}", id);
        List<Purchase> purchases = purchaseService.findAllPurchase(id);
        if (purchases == null) {
            logger.error("Purchase with id {} not found.", id);
            return new ResponseEntity(new CustomErrorType("purchase with id " + id
                    + " not found"), HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<List<Purchase>>(purchases, HttpStatus.OK);
    }*/

    @RequestMapping(value = "/product/", method = RequestMethod.POST)
    public ResponseEntity<?> createProduct(@RequestBody Product product, UriComponentsBuilder ucBuilder) {
        logger.info("Creating product : {}", product);
        long productId = product.getId();
        if (productService.isProductExist(product)) {
            logger.error("Unable to create. A product with name {} already exist", product.getName());
            return new ResponseEntity(new CustomErrorType("Unable to create. A product with name " +
                    product.getName() + " already exist."),HttpStatus.CONFLICT);
        }
        productService.saveProduct(product);
        Storage storage = new Storage();
        storage.setId(productId);
        storage.setProduct(product);
        storage.setCount(0);
        storageService.saveStorage(storage);
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(ucBuilder.path("/api/product/{id}").buildAndExpand(product.getId()).toUri());
        return new ResponseEntity<String>(headers, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/purchase/", method = RequestMethod.POST)
    public ResponseEntity<?> createPurchase(@RequestBody Purchase purchase, UriComponentsBuilder ucBuilder) {
        logger.info("Creating Purchase : {}", purchase);
        int countOfProduct = storageService.findByProduct(purchase.getProduct()).getCount();
        if (purchaseService.isPurchaseExist(purchase)) {
            logger.error("Unable to create. A Purchase with name {} already exist", purchase.getId());
            return new ResponseEntity(new CustomErrorType("Unable to create. A purchase with id " +
                    purchase.getId() + " already exist."),HttpStatus.CONFLICT);
        }
        if (countOfProduct==0){
            return new ResponseEntity(new CustomErrorType("Sorry, the item is out of stock"),HttpStatus.CONFLICT);
        }
        if (purchase.getCount()<=0){
            return new ResponseEntity(new CustomErrorType("please enter the quantity of the item"),HttpStatus.CONFLICT);
        }
        double  userAccount = userService.findById(purchase.getUser().getId()).getAccount();
        if (userAccount<purchase.getTotal_price()){
            return new ResponseEntity(new CustomErrorType("There is not enough money on your account"),HttpStatus.CONFLICT);
        }
        if (countOfProduct>=purchase.getCount()){
            int discount = propertiesService.getCurrentDiscount(purchase.getUser());
            storageService.changeCount (storageService.findByProduct(purchase.getProduct()),purchase.getCount());
            userService.takeMoneyFromAccount (userService.findById(purchase.getUser().getId()),purchase.getTotal_price(),discount);
            purchase.setTotal_price(purchase.getTotal_price()-purchase.getTotal_price()*((Double.valueOf(discount))/100));
        purchaseService.savePurchase(purchase);

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(ucBuilder.path("/api/purchase/{id}").buildAndExpand(purchase.getId()).toUri());
        return new ResponseEntity<String>(headers, HttpStatus.CREATED);
        }else {
            return new ResponseEntity(new CustomErrorType("Unable to create. No such quantity in the warehouse. Max:"+storageService.findByProduct(purchase.getProduct()).getCount()),HttpStatus.CONFLICT);
        }
    }

    @RequestMapping(value = "/filter/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> filterProducts(@PathVariable("id") long id) {
        Category category = categoryRepository.findOne(id);
        List<Product> filterProducts =new ArrayList<>();
        List<Product> products= productService.findAllProducts();
        for (int i = 0; i < products.size(); i++) {
            if(products.get(i).getCategory().equals(category)){
                filterProducts.add(products.get(i));
            }
        }

        return new ResponseEntity<List<Product>>(filterProducts, HttpStatus.OK);
    }
    @RequestMapping(value = "/product/{id}", method = RequestMethod.PUT)
    public ResponseEntity<?> updateProducts(@PathVariable("id") long id, @RequestBody Product product) {
        logger.info("Updating Product with id {}", id);

        Product currentProduct = productService.findById(id);

        if (currentProduct == null) {
            logger.error("Unable to update. Product with id {} not found.", id);
            return new ResponseEntity(new CustomErrorType("Unable to upate. Product with id " + id + " not found."),
                    HttpStatus.NOT_FOUND);
        }

        currentProduct.setName(product.getName());
        currentProduct.setCategory(product.getCategory());
        currentProduct.setPrice(product.getPrice());
      //  currentProduct.setStorage(product.getStorage());

        productService.saveProduct(currentProduct);
        return new ResponseEntity<Product>(currentProduct, HttpStatus.OK);
    }
    @RequestMapping(value = "/purchase/{id}", method = RequestMethod.PUT)
    public ResponseEntity<?> updatePurchase(@PathVariable("id") long id, @RequestBody Purchase purchase) {
        logger.info("Updating Role with id {}", id);

        Purchase currentPurchese = purchaseService.findById(id);

        if (currentPurchese == null) {
            logger.error("Unable to update. Purchase with id {} not found.", id);
            return new ResponseEntity(new CustomErrorType("Unable to update. Purchase with id " + id + " not found."),
                    HttpStatus.NOT_FOUND);
        }

        currentPurchese.setProduct(currentPurchese.getProduct());
        currentPurchese.setCount(currentPurchese.getCount());
        currentPurchese.setTotal_price(currentPurchese.getTotal_price());
        currentPurchese.setUser(currentPurchese.getUser());

        purchaseService.updatePurchase(currentPurchese);
        return new ResponseEntity<Purchase>(currentPurchese, HttpStatus.OK);
    }


    @RequestMapping(value = "/product/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteProducts(@PathVariable("id") long id) {
        logger.info("Fetching & Deleting User with id {}", id);

        Product product = productService.findById(id);
        if (product == null) {
            logger.error("Unable to delete. Product with id {} not found.", id);
            return new ResponseEntity(new CustomErrorType("Unable to delete. Product with id " + id + " not found."),
                    HttpStatus.NOT_FOUND);
        }
        productService.deleteProductById(id);
        return new ResponseEntity<Product>(HttpStatus.NO_CONTENT);
    }
    @RequestMapping(value = "/purchase/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deletePurchase(@PathVariable("id") long id) {
        logger.info("Fetching & Deleting Purchase with id {}", id);

        Purchase purchase =purchaseService.findById(id);
        if (purchase == null) {
            logger.error("Unable to delete. Purchase with id {} not found.", id);
            return new ResponseEntity(new CustomErrorType("Unable to delete. Purchase with id " + id + " not found."),
                    HttpStatus.NOT_FOUND);
        }
        purchaseService.deletePurchaseById(id);
        return new ResponseEntity<Purchase>(HttpStatus.NO_CONTENT);
    }


    @RequestMapping(value = "/product/", method = RequestMethod.DELETE)
    public ResponseEntity<Product> deleteAllProducts() {
        logger.info("Deleting All Products");

        productService.deleteAllProducts();
        return new ResponseEntity<Product>(HttpStatus.NO_CONTENT);
    }
    @RequestMapping(value = "/purchase/", method = RequestMethod.DELETE)
    public ResponseEntity<Purchase> deleteAllPurchases() {
        logger.info("Deleting All Purchases");

        purchaseService.deleteAllPurchase();
        return new ResponseEntity<Purchase>(HttpStatus.NO_CONTENT);
    }

}