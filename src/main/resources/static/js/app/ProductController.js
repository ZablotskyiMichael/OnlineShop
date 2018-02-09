'use strict'

angular.module('crudApp').controller('ProductController',
    ['ProductService', '$scope' , function( ProductService, $scope) {

        var self = this;
        self.user={};
        self.product = {};
        self.products=[];
        self.purchase = {};
        self.purchases = [];
        self.storage = {};
        self.storages=[];
        self.welcProduct={};
        self.category={};
        self.categories = [];
        self.newProduct={};
        self.property={};
        self.loadAllProducts = loadAllProducts;
        self.filterByCategory = filterByCategory;
        self.welcomeProduct = welcomeProduct;
        self.deletePurchase = deletePurchase;
        self.getAllProducts = getAllProducts;
        self.getAllPurchase = getAllPurchase;
        self.getAllStorage = getAllStorage;
        self.getAllCategories = getAllCategories;
        self.issuePurchase = issuePurchase;
        self.buyProduct = buyProduct;
        self.editStorage = editStorage;
        self.submitChange = submitChange;

        self.submitCategory = submitCategory;
        self.getAllCategories = getAllCategories;
        self.createCategory = createCategory;
        self.createProduct = createProduct;
        self.updateCategory = updateCategory;
        self.removeCategory = removeCategory;
        self.editCategory = editCategory;
        self.reset = reset

        self.successProductMessage = '';
        self.errorProductMessage = '';
        self.doneProduct = false;
        self.successMessage = '';
        self.errorMessage = '';
        self.done = false;
        self.successRoleMessage = '';
        self.errorRoleMessage = '';
        self.RoleDone = false;
        self.successCategoryMessage = '';
        self.errorCategoryMessage = '';
        self.doneCategory = false;
        self.successAddMessage = '';
        self.errorAddMessage = '';
        self.doneAdd = false;
        self.onlyIntegers = /^\d+$/;
        self.onlyNumbers = /^\d+([,.]\d+)?$/;

        function filterByCategory(category) {
            if (category===undefined || category===null){
                ProductService.loadAllCategories();
            }else{
                ProductService.filterByCategory(category);
            }
        }
        function loadAllProducts() {
            ProductService.loadAllProducts();
        }
        function editCategory(id) {
            self.successCategoryMessage='';
            self.errorCategoryMessage='';
            ProductService.getCategory(id).then(
                function (category) {
                    self.category = category;
                },
                function (errResponse) {
                    console.error('Error while removing category ' + id + ', Error :' + errResponse.data);
                }
            );
        }
        function getAllCategories() {
            return ProductService.getAllCategories();
        }
        function submitCategory() {
            console.log('Submitting');
            if (self.category.id === undefined || self.category.id === null) {
                console.log('Saving New category', self.category);
                createCategory(self.category);
            } else {
                updateCategory(self.category, self.category.id);
                console.log('Category updated with id ', self.category.id);
            }
        }
        function removeCategory(id){
            console.log('About to remove Category with id '+id);
            ProductService.removeCategory(id)
                .then(
                    function(){
                        console.log('Category '+id + ' removed successfully');

                    },
                    function(errResponse){
                        console.error('Error while removing Category '+id +', Error :'+errResponse.data);
                    }
                );
        }
        function createCategory(category) {
            console.log('About to create category');
            ProductService.createCategory(category)
                .then(
                    function (response) {
                        console.log('category created successfully');
                        self.successCategoryMessage = 'category created successfully';
                        self.errorCategoryMessage='';
                        self.done = true;
                        self.category={};
                        $scope.myCategoryForm.$setPristine();
                    },
                    function (errResponse) {
                        console.error('Error while creating category');
                        self.errorCategoryMessage = 'Error while creating category: ' + errResponse.data.errorMessage;
                        self.successCategoryMessage='';
                    }
                );
        }
        function createProduct() {
            console.log('About to create Product');
            ProductService.createProduct(self.newProduct)
                .then(
                    function (response) {
                        console.log('Product created successfully');
                        self.successNewProductMessage = 'Product created successfully';
                        self.errorNewProductMessage='';
                        self.doneNewProduct = true;
                        self.newProduct={};
                        $scope.myNewProductForm.$setPristine();
                    },
                    function (errResponse) {
                        console.error('Error while creating Product');
                        self.errorProductMessage = 'Error while creating Product: ' + errResponse.data.errorMessage;
                        self.successProductMessage='';
                    }
                );
        }
        function updateCategory(category, id){
            console.log('About to update Category');
            ProductService.updateCategory(category, id)
                .then(
                    function (response){
                        console.log('Category updated successfully');
                        self.successCategoryMessage='Category updated successfully';
                        self.errorCategoryMessage='';
                        self.doneCategory = true;
                        $scope.myCategoryForm.$setPristine();
                    },
                    function(errResponse){
                        console.error('Error while updating Category');
                        self.errorCategoryMessage='Error while updating Category '+errResponse.data;
                        self.successCategoryMessage='';
                    }
                );
        }
        function getAllProducts(){
            return ProductService.getAllProducts();
        }
        function getAllPurchase(){
            return ProductService.getAllPurchase();
        }
        function getAllStorage(){
            return ProductService.getAllStorage();
        }
        function getAllCategories() {
            return ProductService.getAllCategories();
        }
        function editStorage(id) {
            self.successMessage='';
            self.errorMessage='';
            ProductService.getStorage(id).then(
                function (storage) {
                    self.storage = storage;
                },
                function (errResponse) {
                    console.error('Error while edit storage ' + id + ', Error :' + errResponse.data);
                }
            );
        }
        function welcomeProduct (name){
            self.welcProduct.name=name;
            return name;
        }

        function submitChange() {
            console.log('Submitting');
                ProductService.updateStorage(self.storage, self.storage.id)
                .then(
                    function (response){
                        console.log('Storage updated successfully');
                        self.successAddMessage='Storage updated successfully';
                        self.errorAddMessage='';
                        self.doneAdd = true;
                        $scope.myAddForm.$setPristine();
                        self.storage={};
                    },
                    function(errResponse){
                        console.error('Error while updating Storage');
                        self.errorAddMessage='Error while updating Storage '+errResponse.data;
                        self.successAddMessage='';
                    }
                );

        }
        function deletePurchase(id) {
            ProductService.deletePurchase(id).then(
                function(){
                    console.log('Purchase '+id + ' removed successfully');
                    self.storages=ProductService.loadAllStorage;
                },
                function(errResponse){
                    console.error('Error while removing Purchase '+id +', Error :'+errResponse.data);
                }
            );
        }
        function issuePurchase(id) {
            self.successMessage='';
            self.errorMessage='';
           /* ProductService.getStorage(self.purchase.product.id).then(
                function (storage) {
                    self.storage = storage;
                },
                function (errResponse) {
                    console.error('Error while removing user ' + id + ', Error :' + errResponse.data);
                }
            )*/
           self.user = ProductService.getCurrentUser();
           self.purchase.user = self.user;
           self.property=ProductService.getDiscount();
            ProductService.getProduct(id).then(
                function (product) {
                    self.product = product;
                    self.purchase.product=self.product;
                },
                function (errResponse) {
                    console.error('Error while removing user ' + id + ', Error :' + errResponse.data);
                }
            )

            ;
        }
        function reset(){
            self.successCategoryMessage='';
            self.errorCategoryMessage='';
            self.successRoleMessage='';
            self.errorRoleMessage='';
            self.category={};
            $scope.myForm.$setPristine();
            $scope.myCategoryForm.$setPristine();//reset Form
        }
        function buyProduct() {
            console.log('About to create purchase');
            self.purchase.total_price = self.purchase.count * self.purchase.product.price ;



            ProductService.createPurchase(self.purchase)
                .then(
                    function (response) {
                        console.log('Purchase created successfully');
                        self.successMessage = 'Purchase created successfully';
                        self.errorMessage='';
                        self.done = true;
                        self.purchase={};
                        $scope.myForm.$setPristine();
                    },
                    function (errResponse) {
                        console.error('Error while creating Purchase');
                        self.errorMessage = 'Error while creating Purchase: ' + errResponse.data.errorMessage;
                        self.successMessage='';
                    }
                );
        }

}


        ]);