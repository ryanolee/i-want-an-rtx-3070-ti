import md5 from 'md5'
import randomHex from 'crypto-random-hex'

window.Lockout = false

const LOCAL_STORAGE_PREFIX = 'scan-'
const PRODUCT_ID_REGEX = /{\s*'items':\s*\[{\s+'id':\s*'(?<product_id>\d+)',/gm
export const STATUS_IDLE = 'idle'
export const STATUS_FETCHING = 'fetching'
export const STATUS_GATHERING_INFO = 'gathering_info'
export const HALT_CAPTCHA = 'waiting_on_captcha'
export const STATUS_READY = 'ready'
export const STATUS_ERROR = 'error'

const requestId = randomHex(16)

function getLocalStorageKey(targetURL){
    return `${LOCAL_STORAGE_PREFIX}${targetURL}`
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const fetchInitialData = async (targetUrl) => {
    if(localStorage.getItem(getLocalStorageKey(targetUrl)) !== null){
        console.log(`Cached metadata detected. Using that`)
        return JSON.parse(localStorage.getItem(getLocalStorageKey(targetUrl)))
    }
    
    console.log(`Fetching initial data from ${targetUrl}`)

    let loadPromise = new Promise((res, rej) => {
        let ifrm = document.createElement("iframe")
        ifrm.setAttribute("src", targetUrl)
        ifrm.id = md5(targetUrl)
        ifrm.style.display = "none";
        ifrm.style.height = "480px";
        ifrm.onload = () => {
            res(ifrm)
        }
        ifrm.onerror = rej
        document.body.appendChild(ifrm)
    })
   
    let resIfrm = await loadPromise

    let resBody = resIfrm.contentDocument || resIfrm.contentWindow.document
    let { groups: { product_id } } = PRODUCT_ID_REGEX.exec(resBody.head.innerHTML)

    let metadata = {product_id}
    console.log(`Detected id ${product_id}... saving`)
    localStorage.setItem(getLocalStorageKey(targetUrl), JSON.stringify(metadata))

    return metadata
}

export const makeBuyAttempt = async (targetURL, metadata) => {
    if (window.Lockout){
        console.log("Lockout hit... bypassing")
        await timeout(1000)
        return
    }

    let res = await fetch("https://www.scan.co.uk/ajax/basket/increaseproductquantity", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "request-context": "appId=cid-v1:d44e6080-6ac8-40a7-bc38-83ff50abdf7c",
            "request-id": `|${requestId}.${randomHex(8)}`,
            "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
            "sec-ch-ua-mobile": "?0",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
        },
        "referrer": targetURL,
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `actionSource=2&webProductId=${metadata.product_id}`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });

    let jsonRes = await res.json()

    if(jsonRes.basket.productsGross !== 0){
        console.log("WE GOT ONE LETS GO BUY IT!!!")
        window.open("https://secure.scan.co.uk/web/basket", "_blank");
        window.Lockout = true
    }

    // Add 5 second timeout so we do not spam the web server
    await timeout(5000)
}
