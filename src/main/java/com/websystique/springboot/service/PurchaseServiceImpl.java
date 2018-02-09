package com.websystique.springboot.service;

import com.websystique.springboot.model.Purchase;
import com.websystique.springboot.model.User;
import com.websystique.springboot.repositories.PurchaseRepository;
import com.websystique.springboot.util.CustomErrorType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
@Service("purchaseService")
@Transactional
public class PurchaseServiceImpl implements PurchaseService {
    @Autowired
    UserService userService;
    @Autowired
    PurchaseRepository purchaseRepository;
    @Override
    public Purchase findById(Long id) {
        return purchaseRepository.findOne(id);
    }

    @Override
    public void savePurchase(Purchase purchase) {
    purchaseRepository.save(purchase);
    }

    @Override
    public void updatePurchase(Purchase purchase) {
        savePurchase(purchase);
    }

    @Override
    public void deletePurchaseById(Long id) {
    purchaseRepository.delete(id);
    }

    @Override
    public void deleteAllPurchase() {
    purchaseRepository.deleteAll();
    }

    @Override
    public List<Purchase> findAllPurchase() {
        return purchaseRepository.findAll();
    }

    /*@Override
    public List<Purchase> findAllPurchase(Long id) {
        User currentUser = getCurrentUser();
        List<Purchase> allPurchases = findAllPurchase();
        List<Purchase> purchaseByUser = new ArrayList<>();
        for (int i = 0; i < allPurchases.size(); i++) {
            if (allPurchases.get(i).getUser().equals(currentUser)){
                purchaseByUser.add(allPurchases.get(i));
            }
        }
        return purchaseByUser;
    }*/

    @Override
    public boolean isPurchaseExist(Purchase purchase) {
        return false;
    }

    @Override
    public List<Purchase> findPurchaseByUser() {
     User  currentUser =  userService.getCurrentUser();
        List<Purchase> allPurchases = findAllPurchase();
        List<Purchase> purchaseByUser = new ArrayList<>();
        for (int i = 0; i < allPurchases.size(); i++) {
            if (allPurchases.get(i).getUser().equals(currentUser)){
                purchaseByUser.add(allPurchases.get(i));
            }
        }
        return purchaseByUser;
    }

    /*@Override
    public User getCurrentUser (){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String name = auth.getName();
        User user = userService.findByName(name);
        return user;
    }
*/
}
