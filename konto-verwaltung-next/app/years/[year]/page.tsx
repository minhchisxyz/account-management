import {getAllMonthTotals, MonthTotal } from "@/app/lib/transaction-actions";
import Graph from "../../components/graph";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { formatEuro, formatVND } from "@/app/lib/formatterService";
import { getRate } from "@/app/lib/currency-actions";
import { EuroIcon, VietnamIcon } from "@/app/components/icons";


export default async function YearDetailsPage({
    params
}: {
    params: Promise<{year: string}>,
}) {
    const { year } = await params;
    const rate = await getRate()
    const totals: MonthTotal[] = await getAllMonthTotals(year);
    return (
        <div className={`flex flex-col gap-4 w-full`}>
            <div className={`w-full h-full grid grid-cols-2 gap-10 flex-1`}>
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <Graph labels={totals.map(t => t.month)}
                           dataset={totals.map(t => t.total)}
                           currency={'EUR'}
                           title={`Monatliche Analyse ${year}`}/>
                </div>
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <Graph labels={totals.map(t => t.month)}
                           dataset={totals.map(t => t.total)}
                           currency={'VND'}
                           title={`Monatliche Analyse ${year}`}/>
                </div>
            </div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Monat</TableCell>
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {totals.map((t) => (
                            <TableRow
                                key={t.month}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="center">{t.month}</TableCell>
                                <TableCell align="right">{formatEuro(t.total)}</TableCell>
                                <TableCell align="right">{formatVND(t.total * rate)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}