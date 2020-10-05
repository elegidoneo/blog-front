import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Rating from '@material-ui/lab/Rating';
import * as Api from "../service/Api";
import {useSelector} from "react-redux";

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: "98%",
        marginTop: theme.spacing(5),
    },
    media: {
        height: 340,
    },
    rating: {
        flip: false,
        textAlign: 'right'
    }
}));

export default function ViewPost(props) {
    const classes = useStyles();
    const [itemsPost, setItemsPosts] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [user, setUser] = useState([]);
    const [comments, setComments] = useState([]);
    const { isLogin, auth } = useSelector(state => ({
        isLogin: state.isLogin,
        auth: state.user
    }));

    useEffect(() => {
        let mounted = true
        if (mounted) {
            Api.showPost(props.match.params.id).then(response => {
                setItemsPosts(response);
                setUser(response.user)
                setComments(JSON.stringify(response.comments))
                setRatings(JSON.stringify(response.rating))
            });
        }
        return () => {
            if (itemsPost !== null) {
                mounted = false;
            }
        }
    },[]);

    const viewRatings = () => {
        let value = 0;
        let readOnly = false;
        if (isLogin) {
            if (user.name === auth.name) {
                readOnly = true;
                value = Math.round(itemsPost.average);
            } else {
                if (ratings.length !== 0) {
                    JSON.parse(ratings).map(rating => {
                        if (rating.qualifier_id === auth.id) {
                            value = rating.score;
                            readOnly = true;
                        }
                    })
                }
            }
        }
        return (
            <Typography variant="body2" color="textSecondary" component="small">
                Calificacion: <Rating name="half-rating" value={value} precision={0.5} size="small" readOnly={readOnly} />
            </Typography>
        )
    }


    return (
        <Container component="main" maxWidth="lg">
            <CssBaseline />
                <Card className={classes.root}>
                    <CardActionArea>
                        <CardMedia
                            className={classes.media}
                            image={itemsPost.image_url ? itemsPost.image_url : "https://www.google.com/url?sa=i&url=https%3A%2F%2Frenonvstakeinfo.org%2Ftahoe-north-ward%2F&psig=AOvVaw32Zy5_KggTAQyja9EWJ41O&ust=1601910416288000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCMC1776bm-wCFQAAAAAdAAAAABAJ"}
                            title="Contemplative Reptile"
                        />
                    </CardActionArea>
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="small">
                            Author: {user.name} | creacion: {itemsPost.created_at}
                        </Typography>
                        <br/>
                        <Divider />
                        {viewRatings()}
                        <Typography gutterBottom variant="h5" component="h2">
                            {itemsPost.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {itemsPost.body}
                        </Typography>
                    </CardContent>
                </Card>
        </Container>
    );
}