import React, { useState, useEffect, useRef } from 'react'
import { Grid, Button, Typography } from '@material-ui/core'
import {
    STATUS_IDLE, STATUS_GATHERING_INFO, STATUS_ERROR, STATUS_READY, STATUS_FETCHING,
    fetchInitialData, makeBuyAttempt, BuyerLoop
} from '../lib/executor'

export default ({link}) => {
    let [state, setState] = useState(STATUS_IDLE)
    let [attempts, setAttempts] = useState(0)
    let [paused, setPaused] = useState(true)
    let [metadata, setMetadata] = useState(false)

    const handlePlayPause = () => {
        setPaused(!paused)
        
    }

    const triggerBuy = async () => {
        setState(STATUS_FETCHING)
        try{
            await makeBuyAttempt(link, metadata)
            setState(STATUS_READY)
        } catch(e){
            console.error(e)
            setState(STATUS_ERROR)
        }
        setAttempts(attempts + 1)
        
        
    }

    const fetchMetadata = async () => {
        setState(STATUS_GATHERING_INFO)
        try{
            let metadata = await fetchInitialData(link)
            setMetadata(metadata)
            setState(STATUS_READY)
        } catch (e){
            console.error(e)
            setState(STATUS_ERROR)
        }    
    }

    useEffect(() => {
        // Handle initial metadata load
        fetchMetadata()
    }, [])

    useEffect(async () => {
        // Trigger infinite mutation loop
        if(!paused){
            await triggerBuy()
        }
    }, [attempts, paused])

    return (
        <Grid container spacing={24}>
            <Grid item xs={3}>
               <Typography>{new URL(link).pathname}</Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography>{state}</Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography>{attempts}</Typography>
            </Grid>
            <Grid item xs={3}>
                <Button disabled={![STATUS_FETCHING, STATUS_READY, STATUS_ERROR].includes(state)}
                    variant="contained" 
                    color="primary"
                    onClick={handlePlayPause}>
                        {paused ? "Play" : "Pause"}
                </Button>
                <Button 
                    variant="contained" 
                    color="primary"
                    disabled={![STATUS_READY, STATUS_ERROR].includes(state)}
                    onClick={triggerBuy}>
                    Add to basket
                </Button>
            </Grid>
        </Grid>
    )
}