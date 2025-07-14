"use client";

import * as React from "react";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { PencilSimpleIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";
import { TrashSimpleIcon } from "@phosphor-icons/react/dist/ssr/TrashSimple";

export interface IEmployee {
	createdDate: string;
	name: string;
	email: string;
	role: string;
	status: "Active" | "Deactivated";
}

interface IProps {
	list: IEmployee[];
}

export function CustomersTable({ list }: IProps): React.JSX.Element {
	return (
		<Card>
			<Box sx={{ overflowX: "auto" }}>
				<Table sx={{ minWidth: "800px" }}>
					<TableHead>
						<TableRow>
							<TableCell >Sr. No</TableCell>
							<TableCell >Created Date</TableCell>
							<TableCell >Name</TableCell>
							<TableCell >Email</TableCell>
							<TableCell >Role</TableCell>
							<TableCell >Status</TableCell>
							<TableCell >Action</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{Array.isArray(list) &&
							list.map((empolyee, index) => {
								const { createdDate, name, email, role, status } = empolyee;

								return (
									<TableRow hover>
										<TableCell>{index + 1}</TableCell>
										<TableCell>{createdDate}</TableCell>
										<TableCell>{name}</TableCell>
										<TableCell>{email}</TableCell>
										<TableCell>{role}</TableCell>
										<TableCell>
											{" "}
											<Switch
												checked={ status === 'Active'  ? true : false}
												
												inputProps={{ "aria-label": "controlled" }}
												color="primary"
											/>
										</TableCell>
										<TableCell>
											<Button color="inherit">
												<PencilSimpleIcon fontSize="var(--icon-fontSize-md)" />
											</Button>
											<Button color="inherit">
												<TrashSimpleIcon fontSize="var(--icon-fontSize-md)" />
											</Button>
										</TableCell>
										{/* <TableCell padding="checkbox">
										<Checkbox
											
										/>
									</TableCell> */}
										{/* <TableCell>
										<Stack sx={{ alignItems: "center" }} direction="row" spacing={2}>
											
											<Typography variant="subtitle2">{row.name}</Typography>
										</Stack>
									</TableCell>
									<TableCell>{row.email}</TableCell>
									<TableCell>
										{row.address.city}, {row.address.state}, {row.address.country}
									</TableCell>
									<TableCell>{row.phone}</TableCell>
									<TableCell>{dayjs(row.createdAt).format("MMM D, YYYY")}</TableCell> */}
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</Box>
			<Divider />
			{/* <TablePagination
				component="div"
				count={count}
				onPageChange={noop}
				onRowsPerPageChange={noop}
				page={page}
				rowsPerPage={rowsPerPage}
				rowsPerPageOptions={[5, 10, 25]}
			/> */}
		</Card>
	);
}
