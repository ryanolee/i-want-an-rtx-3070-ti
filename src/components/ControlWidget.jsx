import React from 'react'
import { Box, Typography, Grid } from '@material-ui/core'
import ControlWidget from './ControlRow'

import { PAGES } from '../lib/constants'
import ControlRow from './ControlRow'
import { fontSize } from '@material-ui/system'

export default () => {
    return (<Box style={{backgroundColor: 'white', padding: "30px", zIndex:"99999999"}}>
        <Typography variant="h2">Rtx 3070 ti grabber</Typography>
        <Grid container spacing={24}>
            <Grid item xs={3}>
                <Typography variant="h3" style={{fontSize: '20px'}}>Page URL</Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography variant="h3" style={{fontSize: '20px'}}>Status</Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography variant="h3" style={{fontSize: '20px'}}>Add attempts</Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography variant="h3" style={{fontSize: '20px'}}>Actions</Typography>
            </Grid>
        </Grid>
        {PAGES.map((link) => {
            return <ControlRow link={link} />
        })}
    </Box>);
}