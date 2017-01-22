{% if not is_demo %}
window.onload = function() {
{% endif %}

    try {
        window.pushMonkeyConfig = {
            accountKey: "{{ account_key }}",
            debug: 0,
            dialogColor: "{{ dialog_color }}",
            dialogButtonColor: "{{ button_color }}",
            isNotWordpress: {{ is_not_wordpress }}
        }
        var container = document.body ? document.body : document.head;
        var script = document.createElement("script");
        script.id="PushMonkeySDK",
        script.src="//www.getpushmonkey.com/sdk/sdk-{{ account_key }}.js",
        container.appendChild(script)
    } catch(err) {
    }
{% if not is_demo %}    
};
{% endif %}