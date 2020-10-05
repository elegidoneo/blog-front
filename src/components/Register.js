import React, {useEffect, useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {Link, useHistory} from "react-router-dom";
import clsx from "clsx";
import {green} from "@material-ui/core/colors";
import * as Auth from "../service/Api";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import {TextValidator, ValidatorForm} from "react-material-ui-form-validator";
import CircularProgress from "@material-ui/core/CircularProgress";

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
        marginTop: theme.spacing(3),
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

export default function Register() {
    const classes = useStyles();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [open, setOpen] = useState(false);
    const [textAlert, setTextAlert] = useState('');
    const [status, setStatus] = useState('success');
    const timer = React.useRef();
    const buttonClassname = clsx({
        [classes.buttonSuccess]: success,
    });

    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        'password_confirmation': ''
    });

    useEffect(() => {
        return () => {
            clearTimeout(timer.current);
        };
    }, []);

    useEffect(() => {
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            if (value !== data.password) {
                return false;
            }
            return true;
        });

        ValidatorForm.addValidationRule('minPassword', (value) => {
            if (value.length <= 8) {
                return false;
            }
            return true;
        });

        return () => {
            ValidatorForm.removeValidationRule('minPassword');
            ValidatorForm.removeValidationRule('isPasswordMatch');
        }
    },[data])

    const handleButtonClick = () => {
        if (!loading) {
            setSuccess(false);
            setLoading(true);
            timer.current = window.setTimeout(() => {
                Auth.register(data, history).then(response => {
                    setLoading(false);
                    if (!response) {
                        setTextAlert("Su registro fue creado de forma exitosa!");
                        setStatus("success");
                        clearValue();
                    } else {
                        setTextAlert("El usuario que estas ingresando ya existe!");
                        setStatus("error");
                    }
                    setOpen(true);
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

    const clearValue = () => {
        setData({
            email: '',
            name: '',
            password: '',
            password_confirmation: ''
        })
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />

            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <ValidatorForm
                    className={classes.form}
                    onSubmit={authenticate}
                    onError={errors => console.log(errors)}
                >
                    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{vertical: "top", horizontal: "center" }}>
                        <Alert onClose={handleClose} severity={status}>
                            {textAlert}
                        </Alert>
                    </Snackbar>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <TextValidator
                                variant="outlined"
                                fullWidth
                                id="name"
                                label="Name"
                                name="name"
                                autoComplete="name"
                                onChange={handleInputChange}
                                value={data.name}
                                validators={['required']}
                                errorMessages={['this field is required']}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextValidator
                                variant="outlined"
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                onChange={handleInputChange}
                                value={data.email}
                                validators={['required', 'isEmail']}
                                errorMessages={['this field is required', 'email is not valid']}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextValidator
                                variant="outlined"
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="password"
                                onChange={handleInputChange}
                                value={data.password}
                                validators={['required', 'minPassword']}
                                errorMessages={['this field is required', 'The password must be at least 8.']}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextValidator
                                variant="outlined"
                                fullWidth
                                name="password_confirmation"
                                label="Password confirmation"
                                type="password"
                                id="password_confirmation"
                                autoComplete="password_confirmation"
                                onChange={handleInputChange}
                                value={data.password_confirmation}
                                validators={['isPasswordMatch', 'required']}
                                errorMessages={['password mismatch', 'this field is required']}
                            />
                        </Grid>
                        {/*<Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox value="allowExtraEmails" color="primary" />}
                                label="I want to receive inspiration, marketing promotions and updates via email."
                            />
                        </Grid>*/}
                    </Grid>
                    <div className={classes.wrapper}>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={style.join()}
                        disabled={loading}
                    >
                        Sign Up
                    </Button>
                    {loading && <CircularProgress size={25} className={classes.buttonProgress} />}
                    </div>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link to="/login" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </ValidatorForm>
            </div>
        </Container>
    );
}