import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import { green } from '@material-ui/core/colors';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link, useHistory } from "react-router-dom";
import * as Auth from "../service/Api"

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    wrapper: {
        position: 'relative',
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function SignIn() {
    const classes = useStyles();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [open, setOpen] = useState(false);
    const [textAlert, setTextAlert] = useState('');
    const timer = React.useRef();

    const buttonClassname = clsx({
        [classes.buttonSuccess]: success,
    });

    useEffect(() => {
        return () => {
            clearTimeout(timer.current);
        };
    }, []);

    const [data, setData] = useState({
        email: '',
        password: ''
    });

    const handleButtonClick = () => {
        if (!loading) {
            setSuccess(false);
            setLoading(true);
            timer.current = window.setTimeout(() => {
                Auth.login(data, history).then(response => {
                    setLoading(false);
                    if (response) {
                        setTextAlert(response.errors.email[0]);
                        setOpen(true);
                    }
                });
            }, 2000);
        }
    };

    const handleInputChange = (event) => {
        setData({
            ...data,
            [event.target.name] : event.target.value
        })
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const authenticate = (event) => {
        event.preventDefault()
        handleButtonClick();
    }

    let style = [classes.submit];
    if (buttonClassname) {
        style.push(buttonClassname)
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <ValidatorForm
                    className={classes.form}
                    onSubmit={authenticate}
                    onError={errors => console.log(errors)}
                >
                    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{vertical: "top", horizontal: "center" }}>
                        <Alert onClose={handleClose} severity="error">
                            {textAlert}
                        </Alert>
                    </Snackbar>
                    <TextValidator
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        onChange={handleInputChange}
                        autoFocus
                        value={data.email}
                        validators={['required', 'isEmail']}
                        errorMessages={['this field is required', 'email is not valid']}
                    />
                    <TextValidator
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        onChange={handleInputChange}
                        value={data.password}
                        autoComplete="password"
                        validators={['required']}
                        errorMessages={['this field is required']}
                    />
                    {/*<FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />*/}
                    <div className={classes.wrapper}>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={style.join()}
                        disabled={loading}
                    >
                        Sign In
                    </Button>
                    {loading && <CircularProgress size={25} className={classes.buttonProgress} />}
                    </div>
                    <Grid container>
                        {/*<Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>*/}
                        <Grid item>
                            <Link to="/register">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </ValidatorForm>
            </div>
        </Container>
    );
}