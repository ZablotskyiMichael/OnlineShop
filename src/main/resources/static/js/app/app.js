var app = angular.module('crudApp',['ui.router','ngStorage']);

app.constant('urls', {
    BASE: 'http://localhost:8080/',
    USER_SERVICE_API : 'http://localhost:8080/admin/user/',
    ROLE_SERVICE_API : 'http://localhost:8080/admin/role/',
    PROPERTIES_SERVICE_API : 'http://localhost:8080/user/properties/',
    DISCOUNT_SERVICE_API : 'http://localhost:8080/user/discount/',
    USER_SERVICE_API_EASY_ACCESS : 'http://localhost:8080/user/user/',
    PRODUCT_SERVICE_API : 'http://localhost:8080/user/product/',
    PURCHASE_SERVICE_API : 'http://localhost:8080/user/purchase/',
    PURCHASE_FILTER_SERVICE_API : 'http://localhost:8080/user/pfilter/',
    CURRENT_USER: 'http://localhost:8080/user/current/',
    STORAGE_SERVICE_API:'http://localhost:8080/user/storage/',
    CATEGORY_SERVICE_API:'http://localhost:8080/user/category/',
    FILTER_SERVICE_API:'http://localhost:8080/user/filter/',
    USER_SERVICE_API_MONEY : 'http://localhost:8080/user/money/',
});

app.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/admin',
                templateUrl: 'administrator/list',
                controller:'UserController',
                controllerAs:'ctrl',
                resolve: {
                    users: function ($q, UserService) {
                        console.log('Load all users');
                        var deferred = $q.defer();
                        UserService.loadAllUsers().then(deferred.resolve, deferred.resolve);
                        UserService.loadAllRoles().then(deferred.resolve, deferred.resolve);
                        return deferred.promise;
                    }

                }
            });
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('storage', {
                url: '/storage',
                templateUrl: 'partials/storage',
                controller:'ProductController',
                controllerAs:'ctrl',
                resolve: {
                    users: function ($q, ProductService) {
                        console.log('Load all information');
                        var deferred = $q.defer();
                        ProductService.loadAllProducts().then(deferred.resolve, deferred.resolve);
                        ProductService.loadCurrentUser().then(deferred.resolve, deferred.resolve);
                        ProductService.loadAllStorage().then(deferred.resolve, deferred.resolve);
                        ProductService.loadAllPurchase().then(deferred.resolve, deferred.resolve);
                        return deferred.promise;
                    }

                }
            });
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('user', {
                url: '/user',
                templateUrl: 'partials/user',
                controller:'UserController',
                controllerAs:'ctrl',
                resolve: {
                    users: function ($q, UserService) {
                        console.log('Load all users');
                        var deferred = $q.defer();
                        UserService.loadAllUsers().then(deferred.resolve, deferred.resolve);
                        UserService.loadCurrentUser().then(deferred.resolve, deferred.resolve);
                        UserService.loadPurchaseByUser().then(deferred.resolve, deferred.resolve);
                        return deferred.promise;
                    }

                }
            });
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('category', {
                url: '/category',
                templateUrl: 'partials/category',
                controller:'ProductController',
                controllerAs:'ctrl',
                resolve: {
                    users: function ($q, ProductService) {
                        console.log('Load all categories');
                        var deferred = $q.defer();
                        ProductService.loadAllCategories().then(deferred.resolve, deferred.resolve);
                        return deferred.promise;
                    }

                }
            });
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('properties', {
                url: '/properties',
                templateUrl: 'partials/properties',
                controller:'UserController',
                controllerAs:'ctrl',
                resolve: {
                    users: function ($q, UserService) {
                        console.log('Load all categories');
                        var deferred = $q.defer();
                        UserService.loadAllProperties().then(deferred.resolve, deferred.resolve);
                        return deferred.promise;
                    }

                }
            });
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('products', {
                url: '/products',
                templateUrl: 'partials/products',
                controller:'ProductController',
                controllerAs:'ctrl',
                resolve: {
                    users: function ($q, ProductService) {
                        console.log('Load all products');
                        var deferred = $q.defer();
                        ProductService.loadAllProducts().then(deferred.resolve, deferred.resolve);
                        ProductService.loadCurrentUser().then(deferred.resolve, deferred.resolve);
                        ProductService.loadAllCategories().then(deferred.resolve, deferred.resolve);
                        ProductService.loadDiscount().then(deferred.resolve, deferred.resolve);
                        return deferred.promise;
                    }

                }
            });
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'partials/login',

            });
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('welcome', {
                url: '/welcome',
                templateUrl: 'partials/welcome',


            });
        $urlRouterProvider.otherwise('/');
    }]);

