import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const MaterialTable = ({ tableName, data, showType, selectType, selector }) => {
    return (
        <TableContainer
            style={{
                overflow: 'scroll',
                height: '500px',
                display: 'inline-block',
                width: '250px',
                color: 'white',
            }}
            component={Paper}
        >
            <Table sx={{ minWidth: 200 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">{tableName}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((value, idx) => (
                        <TableRow
                            onClick={(e) => {
                                selector(e, value[selectType]);
                            }}
                            hover={true}
                            key={idx}
                            sx={{
                                '&:last-child td, &:last-child th': {
                                    border: 0,
                                },
                            }}
                        >
                            <TableCell component="th" scope="row">
                                {value[showType]}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default MaterialTable;
