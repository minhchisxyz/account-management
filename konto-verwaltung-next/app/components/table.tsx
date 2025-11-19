'use client'

import {deleteTransaction } from "../lib/transaction/actions";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { EuroIcon, VietnamIcon } from "@/app/components/icons";
import {PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import Tooltip from "@mui/material/Tooltip";
import { formatDate, formatEuro, formatVND } from "../lib/formatterService";
import Link from "next/link";
import {Transaction} from "@/app/lib/definitions";

export function TransactionsTable({
    transactions,
    rate,
    month,
    year
}: {
    transactions: Transaction[],
    rate: number,
    month: string,
    year: number
}) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Date</TableCell>
                        <TableCell align="left">Description</TableCell>
                        <TableCell align="right">
                                <span className="inline-flex items-center justify-center gap-1">
                                    <EuroIcon />
                                </span>
                        </TableCell>
                        <TableCell align="right">
                                <span className="inline-flex items-center justify-center gap-1">
                                    <VietnamIcon />
                                </span>
                        </TableCell>
                        <TableCell/>
                        <TableCell/>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions.map((t) => (
                        <TableRow
                            key={t.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell align="center">{formatDate(t.date)}</TableCell>
                            <TableCell align="left">{t.description}</TableCell>
                            <TableCell align="right">{formatEuro(t.value)}</TableCell>
                            <TableCell align="right">{formatVND(t.value * rate)}</TableCell>
                            <TableCell align="center" className={`h-16 w-16 flex items-center justify-center cursor-pointer`}>
                                <Tooltip title={`Edit`} placement="top">
                                    <Link href={`/transactions?id=${t.id}&value=${t.value}&description=${t.description}&date=${t.date.toISOString().split('T')[0]}`}>
                                        <PencilSquareIcon/>
                                    </Link>
                                </Tooltip>
                            </TableCell>
                            <TableCell align="center" className={`h-16 w-16 flex items-center justify-center cursor-pointer`}>
                                <Tooltip title={`Delete`} placement="top">
                                    <TrashIcon onClick={() => deleteTransaction(t.id, month, year)}/>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}