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
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
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
import Chat from "../Chat/Chat";
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
      {/* <Row className="mb-2">
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
            <Link to="/add-task"  className="btn btn-primary">
              Add
            </Link>
          </div>
        </Col>
      </Row> */}

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

const TaskView = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOffcanvas = () => setIsOpen(!isOpen);
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
  const [categoryMap, setCategoryMap] = useState({});
  const [assigntoMap, setAssigntoMap] = useState({});

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
  const [todayTasks, settodayTasks] = useState([]);
  const [overduTasks, setoverduTasks] = useState([]);
  const [upcomingTasks, setupcomingTasks] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/task/projectOptions`
      );
      const data = await response.json();

      const categoryData = Array.isArray(data.msg)
        ? data.msg.reduce((acc, item) => {
            acc[item._id] = item.name; // Create a map of ID -> Name
            return acc;
          }, {})
        : {};

      setCategoryMap(categoryData);
    } catch (error) {
      console.error("Error fetching category names:", error);
    }
  };

  const fetchAssignto = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/task/assigntoOptions`
      );
      const data = await response.json();

      const categoryData = Array.isArray(data.msg)
        ? data.msg.reduce((acc, item) => {
            acc[item._id] = item.name; // Create a map of ID -> Name
            return acc;
          }, {})
        : {};

      setAssigntoMap(categoryData);
    } catch (error) {
      console.error("Error fetching category names:", error);
    }
  };
  //for datatable
  const fetchDataOverdue = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/task/overdueTask`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      setoverduTasks(result.msg); // ✅ set setEmployeelist, not setData
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load roles. Please try again later.");
    }
  };

  //for datatable
  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/task/todayTask`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      settodayTasks(result.msg); // ✅ set setEmployeelist, not setData
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load roles. Please try again later.");
    }
  };

  //my task

  //for datatable
  const fetchDataMytask = async () => {
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

  //upcoming task

  const fetchDataUpcomingtask = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/task/upcomingTasks`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      setupcomingTasks(result.msg); // ✅ set setEmployeelist, not setData
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load roles. Please try again later.");
    }
  };

  useEffect(() => {
    fetchData();
    fetchDataMytask();
    fetchDataUpcomingtask();
    fetchDataOverdue();
    fetchCategories();
    fetchAssignto();
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
        Header: "Assigned To",
        accessor: "assignto",
        Cell: ({ row }) => {
          try {
            const assigneeIds = JSON.parse(row.original.assignto); // safely parse string to array
            const names = assigneeIds.map((id) => assigntoMap[id] || "Unknown");
            return names.join(", ");
          } catch (err) {
            return "N/A";
          }
        },
      },

      {
        Header: "Poject",
        accessor: "project", // this is the role ID
        Cell: ({ row }) => categoryMap[row.original.project] || "N/A",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) => {
          const isActive = row.original.status === "1";
          return (
            //    <div className="form-check form-switch">
            <div className="">
              {/* <input
               type="checkbox"
               className="form-check-input"
               id={`switch-${row.original.id}`}
               checked={isActive}
               onChange={() => handleStatusToggle(row.original.id)}
             /> */}
              {/* <label className="form-check-label" htmlFor={`switch-${row.original.id}`}> */}
              {isActive ? "Active" : "Inactive"}
              {/* </label> */}
            </div>
          );
        },
      },
      {
        Header: "Comment",
        Cell: ({ row }) => (
          <div className="d-flex gap-2">
            {/* <Link to="/update-task" color="primary" size="sm" className="btn btn-primary">
             Edit
           </Link> */}
            <Button color="primary" size="sm" onClick={toggleOffcanvas}>
              Chat
            </Button>
          </div>
        ),
      },
    ],
    [todayTasks, overduTasks, tasks, upcomingTasks, assigntoMap, categoryMap]
  );

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Task View", link: "#" },
  ];
  const [modalOpen2, setModalOpen2] = useState(false);

  return (
    <Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="TASK VIEW" breadcrumbItems={breadcrumbItems} />

          <Card>
            <CardBody>
              <h5 className="mb-4 fs-5 fw-bold">My Tasks</h5>
              <TableContainer
                columns={columns}
                data={tasks}
                customPageSize={10}
                isGlobalFilter={true}
                setModalOpen={setModalOpen}
              />
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h5 className="mb-4 fs-5 fw-bold">Today’s Tasks</h5>
              <TableContainer
                columns={columns}
                data={todayTasks}
                customPageSize={10}
                isGlobalFilter={true}
                setModalOpen={setModalOpen}
              />
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h5 className="mb-4 fs-5 fw-bold">Upcoming Tasks</h5>
              <TableContainer
                columns={columns}
                data={upcomingTasks}
                customPageSize={10}
                isGlobalFilter={true}
                setModalOpen={setModalOpen}
              />
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h5 className="mb-4 fs-5 fw-bold">Overdue Tasks</h5>
              <TableContainer
                columns={columns}
                data={overduTasks}
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
            <Button color="danger" onClick={() => setModalOpen2(false)}>
              Delete
            </Button>
            <Button color="secondary" onClick={() => setModalOpen2(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        <Offcanvas direction="end" isOpen={isOpen} toggle={toggleOffcanvas}>
          <OffcanvasHeader toggle={toggleOffcanvas}>Chat</OffcanvasHeader>
          <OffcanvasBody>
            <Chat />
          </OffcanvasBody>
        </Offcanvas>
      </div>
    </Fragment>
  );
};

export default TaskView;
