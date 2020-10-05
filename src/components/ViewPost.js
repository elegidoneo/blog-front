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
    const [user, setUser] = useState([]);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        let mounted = true
        if (mounted) {
            Api.showPost(props.match.params.id).then(response => {
                setItemsPosts(response);
                setUser(response.user)
                setComments(response.comments)
            });
        }
        return () => {
            if (itemsPost !== null) {
                mounted = false;
            }
        }
    },[]);

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
                        <Typography variant="body2" color="textSecondary" component="small">
                            Calificacion: <Rating name="half-rating" value={0} precision={0.5} size="small" />
                        </Typography>
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