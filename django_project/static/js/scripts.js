$(function(){

  $("#try-now-button").click(function(ev) {

    window._accountKey = "CW598XLRMJ3YUBTZI";
    ev.preventDefault();
    ev.stopPropagation();
    $('#demo-modal').modal();
    getRegistration();
  })   
});

function loadSDK() {

  if ($("head link#manifest").size() == 0) {

    $("head").append('<link id="manifest" rel="manifest" href="/'+window._accountKey+'/manifest.json">');
  } 
  if ($("head script#pm-sdk").size() == 0) {

    $("head").append('<script id="pm-sdk" src="/sdk/config-'+window._accountKey+'.js"></script>');
  }
}

function getRegistration() {

  var supportsNotifications = ("undefined" != typeof ServiceWorkerRegistration && 'showNotification' in ServiceWorkerRegistration.prototype && 'PushManager' in window);
  if (!supportsNotifications)
    return;
  navigator.serviceWorker.getRegistration().then(getSubscription);
}

function getSubscription(registration) {

  if (!registration) {

    loadSDK();
    return;
  }
  registration.pushManager.getSubscription().then(function(subscription) {

    if (!subscription) {

      loadSDK();
    } else {

      resendTest(subscription);
    }
  });
}

function log(m) {

  // console.log(m);
}

function endpointWorkaround(subscription) {

  // Make sure we only mess with GCM
  if (subscription.endpoint.indexOf('https://android.googleapis.com/gcm/send') !== 0) {

    return subscription.endpoint;
  }

  var mergedEndpoint = subscription.endpoint;
  // Chrome 42 + 43 will not have the subscriptionId attached
  // to the endpoint.
  if (subscription.subscriptionId &&
    subscription.endpoint.indexOf(subscription.subscriptionId) === -1) {
    // Handle version 42 where you have separate subId and Endpoint
    mergedEndpoint = subscription.endpoint + '/' +
      subscription.subscriptionId;
  }
  return mergedEndpoint;
} 

function resendTest(subscription) {

    var mergedEndpoint = endpointWorkaround(subscription);
    var url = "./push/v1/resend_demo/" + window._accountKey;
    jQuery.ajax({
          type: "POST",
          url: url,
          crossDomain: true,
          data: jQuery.param({"endpoint": mergedEndpoint}),
          success: function (data) {

            log(data); 
          },
          error: function (err) {

            log(error);
          }
    });
}