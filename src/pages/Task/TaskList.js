import React, { useMemo, Fragment, useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Container,
  Table,
  Row,
  Col,
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
} from "react-table";
import PropTypes from "prop-types";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link } from "react-router-dom";
import deleteimg from "../../assets/images/delete.png";
import { toast } from "react-toastify";

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);

  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <Col md={4}>
      <Input
        type="text"
        className="form-control"
        placeholder={`Search ${count} records...`}
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
      />
    </Col>
  );
}

function Filter() {
  return null;
}

const TableContainer = ({
  columns,
  data,
  customPageSize,
  className,
  isGlobalFilter,
  setModalOpen,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter },
      initialState: {
        pageIndex: 0,
        pageSize: customPageSize,
      },
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination
  );

  const { pageIndex, pageSize } = state;

  return (
    <Fragment>
      <Row className="mb-2">
        <Col md={2}>
          <select
            className="form-select"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </Col>
        {isGlobalFilter && (
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        )}
        <Col md={6}>
          <div className="d-flex justify-content-end">
            <Link to="/add-task" className="btn btn-primary">
              Add
            </Link>
          </div>
        </Col>
      </Row>

      <div className="table-responsive react-table">
        <Table bordered hover {...getTableProps()} className={className}>
          <thead className="table-light table-nowrap">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <th key={column.id}>
                    <div {...column.getSortByToggleProps()}>
                      {column.render("Header")}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={row.id}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} key={cell.column.id}>
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      <Row className="justify-content-md-end justify-content-center align-items-center mt-3">
        <Col className="col-md-auto">
          <div className="d-flex gap-1">
            <Button
              color="primary"
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            >
              {"<<"}
            </Button>
            <Button
              color="primary"
              onClick={previousPage}
              disabled={!canPreviousPage}
            >
              {"<"}
            </Button>
          </div>
        </Col>
        <Col className="col-md-auto d-none d-md-block">
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </Col>
        <Col className="col-md-auto">
          <Input
            type="number"
            min={1}
            max={pageOptions.length}
            style={{ width: 70 }}
            value={pageIndex + 1}
            onChange={(e) => gotoPage(Number(e.target.value) - 1)}
          />
        </Col>
        <Col className="col-md-auto">
          <div className="d-flex gap-1">
            <Button color="primary" onClick={nextPage} disabled={!canNextPage}>
              {">"}
            </Button>
            <Button
              color="primary"
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              {">>"}
            </Button>
          </div>
        </Col>
      </Row>
    </Fragment>
  );
};

TableContainer.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  customPageSize: PropTypes.number,
  className: PropTypes.string,
  isGlobalFilter: PropTypes.bool,
  setModalOpen: PropTypes.func.isRequired,
};

const TaskList = () => {
  const [modalOpen2, setModalOpen2] = useState(false);
  const [tasks, settasks] = useState([
    {
      id: 1,
      createdDate: "2024-06-01",
      taskTitle: "Design Homepage",
      startDate: "2024-06-02",
      endDate: "2024-06-05",
      prostatus: "In Progress",
      priority: "High",
      assignedBy: "Manager A",
      assignedTo: "Designer X",
      status: "Active",
    },
    {
      id: 2,
      createdDate: "2024-06-03",
      taskTitle: "Fix Login Bug",
      startDate: "2024-06-04",
      endDate: "2024-06-07",
      prostatus: "Completed",
      priority: "Medium",
      assignedBy: "Manager B",
      assignedTo: "Developer Y",
      status: "Inactive",
    },
    {
      id: 3,
      createdDate: "2024-06-05",
      taskTitle: "API Integration",
      startDate: "2024-06-06",
      endDate: "2024-06-10",
      prostatus: "Pending",
      priority: "High",
      assignedBy: "Team Lead",
      assignedTo: "Developer Z",
      status: "Active",
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpen1, setModalOpen1] = useState(false);

  const handleStatusToggle = (id) => {
    settasks((prevList) =>
      prevList.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "Active" ? "Inactive" : "Active",
            }
          : item
      )
    );
  };

  //for datatable
  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/task/getdatatask`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      settasks(result.msg); // ✅ set setEmployeelist, not setData
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load roles. Please try again later.");
    }
  };

  //status

  const handleChange = async (currentStatus, id) => {
    const newStatus = currentStatus == 1 ? 0 : 1;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/task/update-statustask`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus, id }),
        }
      );

      const res_data = await response.json();

      if (response.ok) {
        toast.success("Task Status updated Successfully");
        fetchData(); // Refresh the list
      } else {
        toast.error(
          res_data.extraDetails || res_data.message || "Something went wrong."
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status. Please try again!");
    }
  };

  const [deleteId, setDeleteId] = useState(null);

  // 👇 Open modal and set ID
  const handleDelete = (id) => {
    setDeleteId(id);
    setModalOpen2(true);
  };

  // 👇 Close modal and reset ID
  const handleClose = () => {
    setModalOpen2(false);
    setDeleteId(null);
  };
  // 👇 Confirm delete function
  const handleyesno = async () => {
    if (!deleteId) {
      toast.error("No ID to delete.");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/task/deletetask/${deleteId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.ok) {
        fetchData(); // Reload data
        setModalOpen2(false);
        toast.success("Selected data Deleted Successfully");
        settasks((prevItems) =>
          prevItems.filter((row) => row._id !== deleteId)
        );
        setDeleteId(null);
      } else {
        toast.error(data.extraDetails || data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  };

  useEffect(() => {
    fetchData();
    // fetchCategories();
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "No.",
        accessor: (_row, i) => i + 1,
      },
      { Header: "Created Date", accessor: "createdAt" },
      { Header: "Task Title", accessor: "title" },
      {
        Header: "Start Date",
        accessor: "start_date",
        Cell: ({ value }) => {
          if (!value) return "N/A";
          return new Date(value).toISOString().split("T")[0]; // Formats to "YYYY-MM-DD"
        },
      },

      {
        Header: "End Date",
        accessor: "end_date",
        Cell: ({ value }) => {
          if (!value) return "N/A";
          return new Date(value).toISOString().split("T")[0]; // Formats to "YYYY-MM-DD"
        },
      },
      { Header: "Task Status", accessor: "task_status" },
      { Header: "Priority", accessor: "priority" },

      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) => {
          const isActive = row.original.status == 1;

          return (
            <div className="form-check form-switch">
              <input
                type="checkbox"
                className="form-check-input"
                id={`switch-${row.original._id}`}
                checked={isActive}
                onChange={() =>
                  handleChange(row.original.status, row.original._id)
                }
              />
              <label
                className="form-check-label"
                htmlFor={`switch-${row.original._id}`}
              >
                {isActive ? "Active" : "Inactive"}
              </label>
            </div>
          );
        },
      },
      {
        Header: "Option",
        Cell: ({ row }) => (
          <div className="d-flex gap-2">
            <Link
              to={`/update-task/${row.original._id}`}
              color="primary"
              size="sm"
              className="btn btn-primary"
            >
              Edit
            </Link>
            <Button
              color="danger"
              size="sm"
              onClick={() => handleDelete(row.original._id)}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [tasks]
  );

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Task", link: "#" },
  ];

  return (
    <Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="TASK" breadcrumbItems={breadcrumbItems} />
          <Card>
            <CardBody>
              <TableContainer
                columns={columns}
                data={tasks}
                customPageSize={10}
                isGlobalFilter={true}
                setModalOpen={setModalOpen}
              />
            </CardBody>
          </Card>
        </Container>
        {/*  Modal for Delete Confirmation */}
        <Modal isOpen={modalOpen2} toggle={() => setModalOpen1(!modalOpen2)}>
          {/* <ModalHeader className="position-absolute right-0 top-0 w-100 z-1" toggle={() => setModalOpen2(!modalOpen2)}></ModalHeader> */}
          <ModalBody className="mt-3">
            <h4 className="p-3 text-center">
              Do you really want to <br /> delete the file?
            </h4>
            <div className="d-flex justify-content-center">
              <img
                src={deleteimg}
                alt="Privilege Icon"
                width={"70%"}
                className="mb-3 m-auto"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={handleyesno}>
              Delete
            </Button>
            <Button color="secondary" onClick={() => handleClose()}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </Fragment>
  );
};

export default TaskList;
