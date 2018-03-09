'use strict';

window.onload = function () {
    var $ = document.querySelector.bind(document);
    var $$ = document.querySelectorAll.bind(document);
    var body = $('body');

    //####################################################
    // THEMING
    //####################################################
    var tablist = $$('.tab');

    tablist.forEach(function (tab) {
        return tab.addEventListener('click', function (event) {
            var tab = event.srcElement;

            //Add Theme to body
            body.classList.remove('theme-1', 'theme-2', 'theme-3');
            var themeToBeAdded = tab.attributes['data-theme'].value;
            body.classList.add(themeToBeAdded);

            //Add active to tab
            tablist.forEach(function (tab) {
                return tab.classList.remove('active');
            });
            tab.classList.add('active');
        });
    });

    //####################################################
    // CACHING
    //####################################################
    var cachable = $('#cachable');
    var controlCachableTimeout = null;

    cachable.value = localStorage.getItem('cachable');

    cachable.addEventListener('input', function (event) {
        clearTimeout(controlCachableTimeout);

        controlCachableTimeout = setTimeout(function () {
            localStorage.setItem('cachable', cachable.value);
        }, 300);
    });

    //####################################################
    // NETWORKING
    //####################################################
    var networkInfo = $('#networkInfo');

    function checkConnection() {
        try {
            var networkState = navigator.connection.type;

            var states = {};
            states[Connection.UNKNOWN] = 'Unknown connection';
            states[Connection.ETHERNET] = 'Ethernet connection';
            states[Connection.WIFI] = 'WiFi connection';
            states[Connection.CELL_2G] = 'Cell 2G connection';
            states[Connection.CELL_3G] = 'Cell 3G connection';
            states[Connection.CELL_4G] = 'Cell 4G connection';
            states[Connection.CELL] = 'Cell generic connection';
            states[Connection.NONE] = 'No network connection';

            networkInfo.innerText = states[networkState];
        } catch (exception) {
            networkInfo.innerText = 'Undetected network state';
        }
    }

    setInterval(checkConnection, 3000);

    document.addEventListener("offline", function () {
        checkConnection();
        body.classList.add('theme-offline');
    }, false);

    document.addEventListener("online", function () {
        checkConnection();
        body.classList.remove('theme-offline');
    }, false);

    //####################################################
    // AJAX
    //####################################################
    var ajaxButton = $('#ajaxButton');
    ajaxButton.addEventListener('click', function (event) {
        var xhttp = new XMLHttpRequest();
        xhttp.overrideMimeType("application/json");
        xhttp.open("GET", "https://jsonplaceholder.typicode.com/posts/1", true);

        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == "200") {
                $('#jsonResponse').innerText = xhttp.responseText;
            } else {
                $('#jsonResponse').innerText = 'Something went wrong :(';
            }
        };
        xhttp.send();
    });

    //####################################################
    // SOCIAL INTEGRATION (FACEBOOK)
    //####################################################
    var facebookButton = $('#fb');
    facebookButton.addEventListener('click', function (event) {
        facebookConnectPlugin.login(['email', 'public_profile'], function (success) {
            facebookConnectPlugin.api('/me?fields=email,name&access_token=' + success.authResponse.accessToken, null, function (success) {
                $('#fbResponse').innerHTML = JSON.stringify(success) + '<img src="http://graph.facebook.com/' + success.id + '/picture?type=large" style="width:100%;">';
                body.classList.add('facebook-logged');
            }, function (error) {
                return console.log(error);
            });
        }, function (error) {
            return console.log(error);
        });
    });

    var facebookShareButton = $('#fbshare');
    facebookShareButton.addEventListener('click', function (event) {
        facebookConnectPlugin.showDialog({
            method: "share",
            href: 'https://sdtimes.com/wp-content/uploads/2015/10/1001.sdt-apache-cordova.png',
            name: 'Testing post on facebook from Cordova App (name)',
            message: 'Testing post on facebook from Cordova App (message)',
            caption: 'Testing post on facebook from Cordova App (caption)',
            description: 'Testing post on facebook from Cordova App (description)'
        }, function (response) {
            console.log(response);
        }, function (response) {
            console.log(response);
        });
    });

    var facebookLogoutButton = $('#fblogout');
    facebookLogoutButton.addEventListener('click', function (event) {
        facebookConnectPlugin.logout(function (success) {
            console.log(success);
            body.classList.remove('facebook-logged');
            $('#fbResponse').innerHTML = '';
        }, function (error) {
            console.log(error);
        });
    });

    //####################################################
    // SENSORS
    //####################################################
    setInterval(function () {
        if (!navigator.accelerometer) return;

        navigator.accelerometer.getCurrentAcceleration(function (success) {
            $('#xval').innerText = success.x;
            $('#yval').innerText = success.y;
            $('#zval').innerText = success.z;
        }, function (error) {
            return console.log(error);
        });
    }, 300);
};