// See LICENSE.MD for license information.

var app = angular.module('MEANapp', ['ngRoute', 'ngStorage']);

/*********************************
 Controllers
 *********************************/

app.controller('HeaderController', function($scope, $localStorage, $sessionStorage, $location, $http){

    // Set local scope to persisted user data
    $scope.user = $localStorage;
    $scope.loc = $location;

    // Logout function
    $scope.logout = function(){
        $http({
            method: 'GET',
            url: '/account/logout'
        })
            .success(function(response){
                alert(response);
                $localStorage.$reset();
                $location.path('/');
            })
            .error(function(response){
                alert(response);
                $location.path('/account/login');
            }
        );
    };
});

app.controller('HomeController', function($scope, $localStorage, $location, $sessionStorage){

  // Set local scope to persisted user data
  $scope.user = $localStorage;
  $scope.loc = $location;


});


app.controller('ExploreJobsController', function($scope, $localStorage, $sessionStorage, $location, anchorSmoothScroll){

  // Set local scope to persisted user data
  $scope.user = $localStorage;


  $('#tab_selector').on('change', function (e) {
	    $('.nav-tabs li a').eq($(this).val()).tab('show');
	});

  $scope.personaToIndustry = function() {
    $scope.user.persona = $("#personas a.active").attr("id")
    console.log($scope.user.persona)
  }

});

app.controller('ExploreTalentController', function($scope, $localStorage, $sessionStorage, $location, anchorSmoothScroll){

  // Set local scope to persisted user data
  $scope.user = $localStorage;
  $scope.loc = $location;

});

app.controller('LoginController', function($scope, $localStorage, $sessionStorage, $location, $http, anchorSmoothScroll){

    // Set local scope to persisted user data
    $scope.user = $localStorage;
    $scope.loc = $location;

    // Login submission
    $scope.submitLogin = function(){

        // Login request
        $http({
            method: 'POST',
            url: '/account/login',
            data: {
                    'username': $scope.loginForm.username,
                    'password': $scope.loginForm.password
                }
            })
            .success(function(response){
                // $localStorage persists data in browser's local storage (prevents data loss on page refresh)
                $localStorage.status = true;
                $localStorage.user = response;
                $location.path('/');
            })
            .error(function(){
                alert('Login failed. Check username/password and try again.');
            }
        );
    };

    // Redirect to account creation page
    $scope.createAccount = function(){
        $location.path('/account/create');
    }
});

app.controller('CreateAccountController', function($scope, $localStorage, $sessionStorage, $http, $location){

    // Create account
    $scope.submitForm = function(){
        $http({
            method: 'POST',
            url: '/account/create',
            data: {
                    'username': $scope.newUser.username,
                    'password': $scope.newUser.password,
                    'firstname' : $scope.newUser.firstname,
                    'lastname' : $scope.newUser.lastname,
                    'email' : $scope.newUser.email,
                    'role' : $scope.newUser.role
                }
            })
            .success(function(response){
                alert(response);
                $location.path('/account/login');
            })
            .error(function(response){
                // When a string is returned
                if(typeof response === 'string'){
                    alert(response);
                }
                // When array is returned
                else if (Array.isArray(response)){
                    // More than one message returned in the array
                    if(response.length > 1){
                        var messages = [],
                            allMessages;
                        for (var i = response.length - 1; i >= 0; i--) {
                            messages.push(response[i]['msg']);
                            if(response.length == 0){
                                allMessages = messages.join(", ");
                                alert(allMessages);
                                console.error(response);
                            }
                        }
                    }
                    // Single message returned in the array
                    else{
                        alert(response[0]['msg']);
                        console.error(response);
                    }
                }
                // When something else is returned
                else{
                    console.error(response);
                    alert("See console for error.");
                }
            }
        );

    };
});

app.controller('AccountController', function($scope, $localStorage, $sessionStorage, $http, $location){

    // Create static copy of user data for form usage (otherwise any temporary changes will bind permanently to $localStorage)
    $scope.formData = $.extend(true,{},$localStorage.user);

    // Update user's account with new data
    $scope.updateAccount = function(){
        $http({
            method: 'POST',
            url: '/account/update',
            data: {
                'username': $scope.formData.username,
                'password': $scope.password,
                'firstname' : $scope.formData.firstname,
                'lastname' : $scope.formData.lastname,
                'email' : $scope.formData.email
            }
        })
            .success(function(response){
                $localStorage.user = $scope.formData;
                alert(response);
            })
            .error(function(response){
                // When a string is returned
                if(typeof response === 'string'){
                    alert(response);
                }
                // When an array is returned
                else if (Array.isArray(response)){
                    // More than one message returned in the array
                    if(response.length > 1){
                        var messages = [],
                            allMessages;
                        for (var i = response.length - 1; i >= 0; i--) {
                            messages.push(response[i]['msg']);
                            if(response.length == 0){
                                allMessages = messages.join(", ");
                                alert(allMessages);
                                console.error(response);
                            }
                        }
                    }
                    // Single message returned in the array
                    else{
                        alert(response[0]['msg']);
                        console.error(response);
                    }
                }
                // When something else is returned
                else{
                    console.error(response);
                    alert("See console for error.");
                }
            }
        );
    };

    // Delete user's account
    $scope.deleteAccount = function(){
        var response = confirm("Are you sure you want to delete your account? This cannot be undone!");
        if(response == true){
            $http({
                method: 'POST',
                url: '/account/delete',
                data: {
                    'username': $scope.formData.username
                }
            })
                .success(function(response){
                    $localStorage.$reset();
                    alert(response);
                    $location.path('/');
                })
                .error(function(response){
                    alert(response);
                }
            );
        }
    };

});

app.controller('ProtectedController', function($scope, $location, $http){

    $http({
        method: 'GET',
        url: '/protected'
    })
        .success(function(response){
            $scope.message = response;
        })
        .error(function(response){
            alert(response);
            $location.path('/account/login');
        }
    );

});

/*********************************
 Routing
 *********************************/
app.config(function($routeProvider) {
    'use strict';

    $routeProvider.

        //Root
        when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeController'
        }).

        //Explore Jobs
        when('/explore/jobs', {
            templateUrl: 'views/explore_jobs.html',
            controller: 'ExploreJobsController'
        }).

        //Explore Talent
        when('/explore/talent', {
            templateUrl: 'views/explore_talent.html',
            controller: 'ExploreTalentController'
        }).

        //Login page
        when('/account/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        }).

        //Account page
        when('/account', {
            templateUrl: 'views/account.html',
            controller: 'AccountController'
        }).

        //Create Account page
        when('/account/create', {
            templateUrl: 'views/create_account.html',
            controller: 'CreateAccountController'
        }).

        //Protected page
        when('/protected', {
            templateUrl: 'views/protected.html',
            controller: 'ProtectedController'
        });

});

/*********************************
 Helper Functions
 *********************************/

app.service('anchorSmoothScroll', function(){

     this.scrollTo = function(eID) {

         // This scrolling function
         // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript

         var startY = currentYPosition();
         var stopY = elmYPosition(eID);
         var distance = stopY > startY ? stopY - startY : startY - stopY;
         if (distance < 100) {
             scrollTo(0, stopY); return;
         }
         var speed = Math.round(distance / 100);
         if (speed >= 20) speed = 20;
         var step = Math.round(distance / 25);
         var leapY = stopY > startY ? startY + step : startY - step;
         var timer = 0;
         if (stopY > startY) {
             for ( var i=startY; i<stopY; i+=step ) {
                 setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                 leapY += step; if (leapY > stopY) leapY = stopY; timer++;
             } return;
         }
         for ( var i=startY; i>stopY; i-=step ) {
             setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
             leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
         }

         function currentYPosition() {
             // Firefox, Chrome, Opera, Safari
             if (self.pageYOffset) return self.pageYOffset;
             // Internet Explorer 6 - standards mode
             if (document.documentElement && document.documentElement.scrollTop)
                 return document.documentElement.scrollTop;
             // Internet Explorer 6, 7 and 8
             if (document.body.scrollTop) return document.body.scrollTop;
             return 0;
         }

         function elmYPosition(eID) {
             var elm = document.getElementById(eID);
             var y = elm.offsetTop;
             var node = elm;
             while (node.offsetParent && node.offsetParent != document.body) {
                 node = node.offsetParent;
                 y += node.offsetTop;
             } return y;
         }

     };

 });
