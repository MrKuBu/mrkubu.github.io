// Copyright 2022 Awesomium team LLC (MrKuBu). All Rights Reserved.

window.addEventListener('load', () => {

    if ('serviceWorker' in navigator){

        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
            })
            .catch(error => {
            });
    }
});
