import React from 'react';
import {connect, useSelector} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {useHistory} from "react-router-dom";
import {logout} from "../service/Api"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        cursor: "pointer",
    },
}));


function IsLogin(props) {
    const signOut = async () => {
        await logout(props.history);
    }

    const { isLogin } = useSelector(state => ({
        isLogin: state.isLogin,
    }))

    if (!isLogin) {
        return (
            <div>
                <Button color="inherit" onClick={() => {
                    props.history.push('/register');
                }}>Register</Button>
                <Button color="inherit" onClick={() => {
                    props.history.push('/login');
                }}>Login</Button>
            </div>
        );
    }

    return (
        <div>
            <Button color="inherit" onClick={signOut}>Logout</Button>
        </div>
    );
}

function ButtonAppBar() {
    const classes = useStyles();
    const history = useHistory();

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title} onClick={() => {
                        history.push('/');
                    }}>
                        Blog
                    </Typography>
                    <IsLogin history={history}/>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default connect()(ButtonAppBar)
