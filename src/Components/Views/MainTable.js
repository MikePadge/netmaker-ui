import React from 'react'
import { Grid, Container, Tabs, Tab } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import NetworkDetails from './NetworkDetails'
import AccessKeys from './AccessKeys'
import AllNodes from './AllNodes'
import AllNetworks from './AllNetworks'

const styles = {
    vertTabs: {
        position: 'relative',
    },
    dataColumn: {
        marginTop: '1em'
    },
    customTab: {
        '&:hover': {
            backgroundColor: '#d3d3d3'
        }
    }
}

const useStyles = makeStyles(styles)

export default function MainTable ({ setNetworkData, setNodeData, setNetworkSelection, networkData, nodeData, dataSelection, networkSelection, setSuccess }) {

    const [value, setValue] = React.useState(0)
    const [currentNetworkTabs, setCurrentNetworkTabs] = React.useState([])
    const [shouldUpdate, setShouldUpdate] = React.useState(true)
    const classes = useStyles()

    const generateNetworks = () => {
        let tempNetworkTabs = []
        for(let i = 0; i < networkData.length; i++) {
            tempNetworkTabs.push(
                <Tab className={classes.customTab} disabled={(i+1 === value)} label={networkData[i].displayname} key={networkData[i].displayname} tabIndex={i+1}/>
            )
        }
        setCurrentNetworkTabs(tempNetworkTabs)
    }

    const handleTabChange = (event, newValue) => {
        // based on selection set the network to parse data for
        setNetworkSelection(newValue - 1)
        setValue(newValue)
    }

    React.useEffect(() => {
        if (currentNetworkTabs.length === 0 && shouldUpdate) {
            generateNetworks()
            setShouldUpdate(false)
        }
    }, [currentNetworkTabs.length, shouldUpdate, generateNetworks])

    return (
        <Container justify='center'>
            <Grid 
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
                >
                <Grid item xs={2}
                    justify='flex-start'
                    alignItems='center'
                    direction='column'
                    className={classes.vertTabs}
                > 
                    <Tabs
                        orientation="vertical"
                        value={value}
                        textColor='primary'
                        indicatorColor='primary'
                        onChange={handleTabChange}
                    >
                        <Tab className={classes.customTab} label='ALL NETWORKS' tabIndex={0}/>
                        {
                            currentNetworkTabs.map(networkTab => networkTab)
                        }   
                    </Tabs>
                </Grid>
                <Grid item xs={10} 
                    justify='flex-start'
                    alignItems='center'
                    direction='column'
                    className={classes.dataColumn} >
                    { 
                        networkSelection >= 0 && dataSelection === 0 ? <NetworkDetails networkData={networkData[networkSelection]} back={false} setShouldUpdate={setShouldUpdate} setSuccess={setSuccess} setNetworkData={setNetworkData}/> : 
                        networkSelection >= 0 && dataSelection === 1 ? <AllNodes networks={networkData} setNodeData={setNodeData} nodes={nodeData} networkName={networkData[networkSelection].netid} setSuccess={setSuccess}/> : 
                        networkSelection >= 0 && dataSelection === 2 ? <AccessKeys data={networkData[networkSelection]} /> :
                        networkSelection < 0 && dataSelection === 2 ? <AccessKeys data={null} /> :
                        dataSelection === 1 ? <AllNodes networks={networkData} setNodeData={setNodeData} nodes={nodeData} networkName={networkData[networkSelection] ? networkData[networkSelection].netid : ''} isAllNetworks setSuccess={setSuccess} /> :
                        <AllNetworks networks={networkData} setSuccess={setSuccess} setNetworkData={setNetworkData}/>
                    }
                </Grid>
            </Grid>
        </Container>
    )
}
