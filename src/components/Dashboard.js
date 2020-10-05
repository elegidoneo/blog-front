import React, {useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import * as Api from "../service/Api"
import {Container} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import {useSelector} from "react-redux";

const columns = [
    { id: 'id', label: 'ID', minWidth: 30 },
    { id: 'title', label: 'Title', minWidth: 300 },
    {
        id: 'created',
        label: 'Created',
        minWidth: 150,
        align: 'left',
    },
    {
        id: 'comments',
        label: 'Comments',
        minWidth: 50,
        align: 'center',
    },
    {
        id: 'average',
        label: 'Average',
        minWidth: 50,
        align: 'center',
    },
    {
        id: 'user',
        label: 'Author',
        minWidth: 170,
        align: 'left',
        valueGetter: (params) =>
            `${params.getValue('user.name') || ''}`,
    },
    {
        id: null,
        label: 'Action',
        minWidth: 100,
        align: 'center',
    },
];

function createData(id, title, created, comments, average, user, action) {
    return { id, title, created, comments, average, user, action };
}

const useStyles = makeStyles((theme) => ({
    table: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(5),
    },
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    },
}));

export default function Dashboard() {
    const classes = useStyles();
    const [itemsPost, setItemsPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { items } = useSelector(state => ({
        items: state.posts,
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const getPosts = () => {
        let publications = [];
        for (let post in items) {
            publications.push(createData(
                items[post].id,
                items[post].title,
                items[post].created_at,
                items[post].comments_count,
                Math.round(items[post].average),
                items[post].user.name
            ))
        }
        return publications;
    }

    return (
        <Container component="main" maxWidth="lg">
            <CssBaseline />
            <h1>Listado de post</h1>
            <Paper className={classes.root}>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {getPosts().slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.format && typeof value === 'number' ? column.format(value) : value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={getPosts().length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
        </Container>
    );
}
