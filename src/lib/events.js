export const RunOnDomContentLoaded  = (fn) => {
    if (document.readyState == "complete" || document.readyState == "loaded" || document.readyState == "interactive") {
        fn()
    } else {
        document.addEventListener("DOMContentLoaded", (event) => {
            fn()
        });
    }
}