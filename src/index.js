import ControlWidget from './components/ControlWidget'
import { RunOnDomContentLoaded } from './lib/events'
import React from 'react'
import ReactDOM from 'react-dom'
import {inIframe} from './lib/detection'

(() => {
    if (!location.origin.includes("scan.co.uk")) {
        console.log("Non scan domain. Skipping registration...")
        return 
    }
    
    console.log("Detecting iframe")
    if (inIframe()) {
        console.log("We are in an iframe! (Skipping)")
        return
    }

    console.log("We are on scan... loading metadata and UI!")

    // Create mount point and inject
    RunOnDomContentLoaded(() => {
        console.log("Content loaded... (mounting component)")
        document.body.insertAdjacentHTML("afterbegin", "<div id='mount-point'></div>")
        ReactDOM.render(<ControlWidget />, document.getElementById('mount-point'))
    })
}) ()
