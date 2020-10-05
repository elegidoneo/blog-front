import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import {useSelector} from "react-redux";
import * as Api from "../service/Api";
import {TablePagination} from "@material-ui/core";
import {Link, useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: "98%",
        marginTop: theme.spacing(5),
    },
    media: {
        height: 340,
    },
}));

export default function Post() {
    const classes = useStyles();
    const history = useHistory();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [itemsPost, setItemsPosts] = useState([]);
    const { posts } = useSelector(state => ({
        posts: state.posts,
    }));

    useEffect(() => {
        let mounted = true
        if (mounted) {
            Api.posts().then(response => {
                setItemsPosts(response);
            });
        }
        return () => {
            if (itemsPost !== null) {
                mounted = false;
            }
        }
    },[]);

    const truncate = (str) => {
        return str.length > 300 ? str.substring(0, 300) + "..." : str;
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const goTo = (id) => {
        history.push(`/post/${id}`)
    }

    return (
        <Container component="main" maxWidth="lg">
            <CssBaseline />
            {posts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {

                return (
                    <Card className={classes.root} key={row.id}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image={row.image_url}
                                title="Contemplative Reptile"
                            />
                        </CardActionArea>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                {row.title}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                {truncate(row.body)}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button type={"button"} size="small" color="primary" onClick={() => goTo(row.id)}>
                                Learn More
                            </Button>
                        </CardActions>
                    </Card>
                )})}
            <TablePagination
                component="div"
                rowsPerPageOptions={[10, 25, 100]}
                count={posts.length}
                page={page}
                onChangePage={handleChangePage}
                rowsPerPage={rowsPerPage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Container>
    );
}