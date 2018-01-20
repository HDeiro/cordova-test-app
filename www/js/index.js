window.onload = () => {
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);
    const body = $('body');

    //####################################################
    // THEMING
    //####################################################
    const tablist = $$('.tab');

    tablist.forEach(tab => tab.addEventListener('click', event => {
        let tab = event.srcElement;

        //Add Theme to body
        body.classList.remove('theme-1', 'theme-2', 'theme-3');
        let themeToBeAdded = tab.attributes['data-theme'].value;
        body.classList.add(themeToBeAdded);

        //Add active to tab
        tablist.forEach(tab => tab.classList.remove('active'));
        tab.classList.add('active');
    }));

    //####################################################
    // CACHING
    //####################################################
    const cachable = $('#cachable');
    let controlCachableTimeout = null;

    cachable.value = localStorage.getItem('cachable');

    cachable.addEventListener('input', event => {
        clearTimeout(controlCachableTimeout);

        controlCachableTimeout = setTimeout(() => {
            localStorage.setItem('cachable', cachable.value);
        }, 300);
    });

    //####################################################
    // NETWORKING
    //####################################################
    const networkInfo = $('#networkInfo');

    function checkConnection() {
        try {
            var networkState = navigator.connection.type;
        
            var states = {};
            states[Connection.UNKNOWN]  = 'Unknown connection';
            states[Connection.ETHERNET] = 'Ethernet connection';
            states[Connection.WIFI]     = 'WiFi connection';
            states[Connection.CELL_2G]  = 'Cell 2G connection';
            states[Connection.CELL_3G]  = 'Cell 3G connection';
            states[Connection.CELL_4G]  = 'Cell 4G connection';
            states[Connection.CELL]     = 'Cell generic connection';
            states[Connection.NONE]     = 'No network connection';
            
            networkInfo.innerText = states[networkState];
        } catch(exception) {
            networkInfo.innerText = 'Undetected network state';
        }
    }

    setInterval(checkConnection, 3000);

    document.addEventListener("offline", () => {
        checkConnection();
        body.classList.add('theme-offline');
    }, false);

    document.addEventListener("online", () => {
        checkConnection();
        body.classList.remove('theme-offline');
    }, false);

    //####################################################
    // AJAX
    //####################################################
    const ajaxButton = $('#ajaxButton');
    ajaxButton.addEventListener('click', event => {
        var xhttp = new XMLHttpRequest();
        xhttp.overrideMimeType("application/json");
        xhttp.open("GET", "https://jsonplaceholder.typicode.com/posts/1", true);

        xhttp.onreadystatechange = function() {
            if(xhttp.readyState == 4 && xhttp.status == "200") {
                $('#jsonResponse').innerText = xhttp.responseText;
            } else {
                $('#jsonResponse').innerText = 'Something went wrong :(';
            }
        }
        xhttp.send();
    });

    //####################################################
    // SOCIAL INTEGRATION (FACEBOOK)
    //####################################################
    const facebookButton = $('#fb');
    facebookButton.addEventListener('click', event => {
        facebookConnectPlugin.login(
            ['email', 'public_profile'], 
            success => {
                facebookConnectPlugin.api(
                    `/me?fields=email,name&access_token=${success.authResponse.accessToken}`, 
                    null, 
                    success => {
                        $('#fbResponse').innerHTML = `${JSON.stringify(success)}<img src="http://graph.facebook.com/${success.id}/picture?type=large" style="width:100%;">`;
                        body.classList.add('facebook-logged');
                    },
                    error => console.log(error)
                );
            },
            error => console.log(error)
        );
    });

    const facebookLogoutButton = $('#fblogout');
    facebookLogoutButton.addEventListener('click', event => {
        facebookConnectPlugin.logout(success => {
            console.log(success);
            body.classList.remove('facebook-logged');
            $('#fbResponse').innerHTML = ``;
        }, error => {
            console.log(error);
        });
    });

    //####################################################
    // SENSORS
    //####################################################
    setInterval(() => {
        navigator.accelerometer.getCurrentAcceleration(
            success => {
                $('#xval').innerText = success.x;
                $('#yval').innerText = success.y;
                $('#zval').innerText = success.z;
            }, 
            error => console.log(error)
        );
    }, 300);
};