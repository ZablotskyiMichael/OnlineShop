'use strict';

angular.module('crudApp').factory('ProductService',
    ['$localStorage', '$http', '$q', 'urls',
        function ($localStorage, $http, $q, urls) {

            var factory = {
                loadAllProducts:loadAllProducts,
                loadAllPurchase:loadAllPurchase,
                loadAllStorage:loadAllStorage,
                loadAllCategories:loadAllCategories,
                getAllProducts:getAllProducts,
                getAllStorage:getAllStorage,
                getAllPurchase:getAllPurchase,
                getAllCategories:getAllCategories,
                createPurchase: createPurchase,
                createProduct: createProduct,
                createStorage: createStorage,
                createCategory: createCategory,
                getCurrentUser : getCurrentUser,
                loadCurrentUser : loadCurrentUser,
                getProduct:getProduct,
                getPurchase:getPurchase,
                getStorage:getStorage,
                getCategory:getCategory,
                updateStorage:updateStorage,
                updateCategory:updateCategory,
                deletePurchase:deletePurchase,
                removeCategory:removeCategory,
                filterByCategory:filterByCategory,
                getDiscount : getDiscount,
                loadDiscount : loadDiscount,


            };

            return factory;
            function loadAllProducts() {
                console.log('Fetching all products');
                var deferred = $q.defer();
                $http.get(urls.PRODUCT_SERVICE_API)
                    .then(
                        function (response) {
                            console.log('Fetched successfully all products');
                            $localStorage.products = response.data;
                            deferred.resolve(response);
                        },
                        function (errResponse) {
                            console.error('Error while loading products');
                            deferred.reject(errResponse);
                        }
                    );
                return deferred.promise;
            }
            function removeCategory(id) {
                console.log('Removing Category with id '+id);
                var deferred = $q.defer();
                $http.delete(urls.CATEGORY_SERVICE_API + id)
                    .then(
                        function (response) {
                            loadAllCategories();
                            deferred.resolve(response.data);
                        },
                        function (errResponse) {
                            console.error('Error while removing Category with id :'+id);
                            deferred.reject(errResponse);
                        }
                    );
                return deferred.promise;
            }
            function loadAllCategories() {
                console.log('Fetching all categories');
                var deferred = $q.defer();
                $http.get(urls.CATEGORY_SERVICE_API)
                    .then(
                        function (response) {
                            console.log('Fetched successfully all products');
                            $localStorage.categories = response.data;
                            deferred.resolve(response);
                        },
                        function (errResponse) {
                            console.error('Error while loading categories');
                            deferred.reject(errResponse);
                        }
                    );
                return deferred.promise;
            }
            function updateStorage(storage, id) {
                console.log('Updating Storage with id '+id);
                var deferred = $q.defer();
                $http.put(urls.STORAGE_SERVICE_API + id, storage)
                    .then(
                        function (response) {
                            loadAllStorage();
                            loadAllProducts();
                            deferred.resolve(response.data);
                        },
                        function (errResponse) {
                            console.error('Error while updating Storage with id :'+id);
                            deferred.reject(errResponse);
                        }
                    );
                return deferred.promise;
            }
            function updateCategory(category, id) {
                console.log('Updating Category with id '+id);
                var deferred = $q.defer();
                $http.put(urls.CATEGORY_SERVICE_API + id, category)
                    .then(
                        function (response) {
                            loadAllCategories();
                            deferred.resolve(response.data);
                        },
                        function (errResponse) {
                            console.error('Error while updating Category with id :'+id);
                            deferred.reject(errResponse);
                        }
                    );
                return deferred.promise;
            }
            function deletePurchase(id) {
                console.log('Removing Purchase with id '+id);
                var deferred = $q.defer();
                $http.delete(urls.PURCHASE_SERVICE_API + id)
                    .then(
                        function (response) {
                            loadAllPurchase();
                            loadAllStorage();
                            deferred.resolve(response.data);
                        },
                        function (errResponse) {
                            console.error('Error while removing User with id :'+id);
                            deferred.reject(errResponse);
                        }
                    );
                return deferred.promise;
            }
            function loadAllStorage() {
                console.log('Fetching all products');
                var deferred = $q.defer();
                $http.get(urls.STORAGE_SERVICE_API)
                    .then(
                        function (response) {
                            console.log('Fetched successfully all products');
                            $localStorage.storages = response.data;
                            deferred.resolve(response);
                        },
                        function (errResponse) {
                            console.error('Error while loading products');
                            deferred.reject(errResponse);
                        }
                    );
                return deferred.promise;
            }
            function loadAllPurchase() {
                console.log('Fetching all purchase');
                var deferred = $q.defer();
                $http.get(urls.PURCHASE_SERVICE_API)
                    .then(
                        function (response) {
                            console.log('Fetched successfully all purchase');
                            $localStorage.purchases = response.data;
                            deferred.resolve(response);
                        },
                        function (errResponse) {
                            console.error('Error while loading purchase');
                            deferred.reject(errResponse);
                        }
                    );
                return deferred.promise;
            }
            function createPurchase(purchase) {
                console.log('Creating Purchase');
                var deferred = $q.defer();
                $http.post(urls.PURCHASE_SERVICE_API, purchase)
                    .then(
                        function (response) {
                            loadAllPurchase();
                            deferred.resolve(response.data);
                        },
                        function (errResponse) {
                            console.error('Error while creating Purchase : '+errResponse.data.errorMessage);
                            deferred.reject(errResponse);
                        }
                    );
                return deferred.promise;
            }
            function filterByCategory(category) {
                var deferred = $q.defer();
                $http.get(urls.FILTER_SERVICE_API + category.id)
                    .then(
                         function (response) {
                     console.log('Fetched successfully all categories');
                     $localStorage.products = response.data;
                     deferred.resolve(response);
                     },
                        function (errResponse) {
                    console.error('Error while loading categories');
                    deferred.reject(errResponse);
                }
            );
                return deferred.promise;
            }
            function createProduct(product) {
                console.log('Creating Purchase');
                var deferred = $q.defer();
                $http.post(urls.PRODUCT_SERVICE_API, product)
                    .then(
                        function (response) {
                            loadAllProducts();
                            loadAllStorage();
                            deferred.resolve(response.data);
                        },
                        function (errResponse) {
                            console.error('Error while creating Product : '+errResponse.data.errorMessage);
                            deferred.reject(errResponse);
                        }
                    );
                return deferred.promise;
            }
            function createStorage(storage) {
                console.log('Creating Storage');
                var deferred = $q.defer();
                $http.post(urls.STORAGE_SERVICE_API, storage)
                    .then(
                        function (response) {
                            loadAllStorage();
                            deferred.resolve(response.data);
                        },
                        function (errResponse) {
                            console.error('Error while creating Storage : '+errResponse.data.errorMessage);
                            deferred.reject(errResponse);
                        }
                    );
                return deferred.promise;
            }
            function createCategory(category) {
                console.log('Creating Category');
                var deferred = $q.defer();
                $http.post(urls.CATEGORY_SERVICE_API, category)
                    .then(
                        function (response) {
                            loadAllCategories();
                            deferred.resolve(response.data);
                        },
                        function (errResponse) {
                            console.error('Error while creating Category : '+errResponse.data.errorMessage);
                            deferred.reject(errResponse);
                        }
                    );
                return deferred.promise;
            }

            function loadCurrentUser() {
                console.log('Fetching current User :');
                var deferred = $q.defer();
                $http.get(urls.CURRENT_USER)
                    .then(
                        function (response) {
                            console.log('Fetched successfully current user');
                            $localStorage.currentUser= response.data;
                            deferred.resolve(response);
                        },
                        function (errResponse) {
                            console.error('Error while loading current user');
                            deferred.reject(errResponse);
                        }
                    );
                return deferred.promise;
            }
            function getProduct(id) {
                console.log('Fetching Product with id :'+id);
                var deferred = $q.defer();
                $http.get(urls.PRODUCT_SERVICE_API + id)
                    .then(
                        function (response) {
                            console.log('Fetched successfully Product with id :'+id);
                            deferred.resolve(response.data);
                        },
                        function (errResponse) {
                            console.error('Error while loading product with id :'+id);
                            deferred.reject(errResponse);
                        }
                    );
                return deferred.promise;
            }
            function getPurchase(id) {
                console.log('Fetching Purchase with id :'+id);
                var deferred = $q.defer();
                $http.get(urls.PURCHASE_SERVICE_API + id)
                    .then(
                        function (response) {
                            console.log('Fetched successfully Purchase with id :'+id);
                            deferred.resolve(response.data);
                        },
                        function (errResponse) {
                            console.error('Error while loading Purchase with id :'+id);
                            deferred.reject(errResponse);
                        }
                    );
                return deferred.promise;
            }
            function getStorage(id) {
                console.log('Fetching Storage with id :'+id);
                var deferred = $q.defer();
                $http.get(urls.STORAGE_SERVICE_API + id)
                    .then(
                        function (response) {
                            console.log('Fetched successfully Storage with id :'+id);
                            deferred.resolve(response.data);
                        },
                        function (errResponse) {
                            console.error('Error while loading Storage with id :'+id);
                            deferred.reject(errResponse);
                        }
                    );
                return deferred.promise;
            }
            function loadDiscount() {
                console.log('Fetching Discount ');
                var deferred = $q.defer();
                $http.get(urls.DISCOUNT_SERVICE_API)
                    .then(
                        function (response) {
                            console.log('Fetched successfully Discount');
                            $localStorage.discount = response.data;
                            deferred.resolve(response.data);
                        },
                        function (errResponse) {
                            console.error('Error while loading Discount');
                            deferred.reject(errResponse);
                        }
                    );
                return deferred.promise;
            }
            function getDiscount() {
               return $localStorage.discount;
            }
            function getCategory(id) {
                console.log('Fetching Category with id :'+id);
                var deferred = $q.defer();
                $http.get(urls.CATEGORY_SERVICE_API + id)
                    .then(
                        function (response) {
                            console.log('Fetched successfully Category with id :'+id);
                            deferred.resolve(response.data);
                        },
                        function (errResponse) {
                            console.error('Error while loading Category with id :'+id);
                            deferred.reject(errResponse);
                        }
                    );
                return deferred.promise;
            }
            function getCurrentUser(){
                return $localStorage.currentUser;
            }
            /*function getCurrentUser() {
                console.log('Fetching current User :');
                var deferred = $q.defer();
                $http.get(urls.CURRENT_USER)
                    .then(
                        function (response) {
                            console.log('Fetched successfully current user');
                            $localStorage.user = response.data;
                            deferred.resolve(response);
                        },
                        function (errResponse) {
                            console.error('Error while loading current user');
                            deferred.reject(errResponse);
                        }
                    );
                return deferred.promise;
            }*/
            function getAllProducts(){
                return $localStorage.products;
            }
            function getAllStorage(){
                return $localStorage.storages;
            }
            function getAllPurchase() {
                return $localStorage.purchases;
            }
            function getAllCategories() {
                return $localStorage.categories;
            }
}]);