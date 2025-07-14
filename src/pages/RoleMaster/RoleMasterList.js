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
import prvi from "../../assets/images/privileges.png";
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
            <Button color="primary" onClick={() => setModalOpen(true)}>
              Add
            </Button>
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

const RoleMasterList = () => {
  const [role, setrole] = useState({
    name: "",
  });

  const [rolelist, setRolelist] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpen1, setModalOpen1] = useState(false);

  const [modalOpen2, setModalOpen2] = useState(false);
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
  //for datatable
  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/role/getdatarole`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      setRolelist(result.msg); // ✅ set rolelist, not setData
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load roles. Please try again later.");
    }
  };
  const handleChange = async (currentStatus, id) => {
    const newStatus = currentStatus == 1 ? 0 : 1;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/role/update-statusrole`,
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
        toast.success("Category Status updated Successfully");
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
  const [itemIdToDelete, setItemIdToDelete] = useState(null);

  //for edit
  const handleedit = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/role/getroleByid/${id}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();

      setrole({
        name: data.msg[0].name,
      });
      setItemIdToDelete(data.msg[0]._id);

      setModalOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  // 👇 Confirm delete function
  const handleyesno = async () => {
    if (!deleteId) {
      toast.error("No ID to delete.");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/role/deleterole/${deleteId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.ok) {
        fetchData(); // Reload data
        setModalOpen2(false);
        toast.success("Selected data Deleted Successfully");
        setRolelist((prevItems) =>
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

  const handleStatusToggle = (id) => {
    setRolelist((prevList) =>
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

  const columns = useMemo(
    () => [
      {
        Header: "No.",
        accessor: (_row, i) => i + 1,
      },

      { Header: "Role", accessor: "name" },
      {
        Header: "Privileges",
        accessor: "privileges", // optional if you have data
        Cell: ({ row }) => {
          return (
            <div className="">
              <img src={prvi} alt="Privilege Icon" height="30" className="" />
            </div>
          );
        },
      },
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
            <Button
              color="primary"
              onClick={() => handleedit(row.original._id)}
              size="sm"
            >
              Edit
            </Button>
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
    [rolelist]
  );

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Role Master", link: "#" },
  ];
  const handleinput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setrole({
      ...role,
      [name]: value,
    });
  };
  const handleClose1 = () => {
    setModalOpen(false);
    setItemIdToDelete(null);
    setrole({
      name: "",
    });
  };

  // const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const [data, setData] = useState([]);

  const [errors, setErrors] = useState({});

  const handleaddsubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!role.name) {
      newErrors.name = "Role Name is required";
      setErrors(newErrors);
      return;
    }
    const id = itemIdToDelete;
    if (!id) {
      try {
        const adminid = localStorage.getItem("adminid");
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/role/addrole`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...role, createdBy: adminid }), // ✅ Correct
          }
        );

        const res_data = await response.json();
        console.log("API response:", res_data);

        if (!response.ok) {
          if (res_data.msg === "Role already exist") {
            setErrors({ name: res_data.msg });
          } else {
            toast.error(res_data.msg || "Something went wrong.");
          }
          return;
        }

        // ✅ WORKING TOAST
        toast.success("Role added successfully!");
        handleClose1();
        setrole({ name: "" });
        setErrors({});
        fetchData();
      } catch (error) {
        console.error("Add Role Error", error);
        toast.error("Network or server error.");
      }
    } else {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/role/updateRole/${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(role),
          }
        );
        const res_data = await response.json();

        if (response.ok == true) {
          handleClose1();
          toast.success(`Update succesfully`);
          setErrors("");
          setrole({
            name: "",
          });
          fetchData();
        } else {
          toast.error(res_data.msg);
        }
      } catch (error) {
        console.log("edit Category", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="ROLE MASTER" breadcrumbItems={breadcrumbItems} />
          <Card>
            <CardBody>
              <TableContainer
                columns={columns}
                data={rolelist}
                customPageSize={10}
                isGlobalFilter={true}
                setModalOpen={setModalOpen}
              />
            </CardBody>
          </Card>
        </Container>

        <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
          <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
            {!itemIdToDelete ? "Add" : "Edit"} Master Role
          </ModalHeader>
          <form onSubmit={handleaddsubmit}>
            <ModalBody>
              <Input
                type="text"
                value={role.name || ""}
                onChange={handleinput}
                name="name"
                placeholder="Role Name"
                className="mb-2"
              />
              {errors.name && (
                <span className="text-danger">{errors.name}</span>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit">
                {!itemIdToDelete ? "Add" : "Update"}
              </Button>
              <Button color="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </Modal>

        <Modal isOpen={modalOpen1} toggle={() => setModalOpen1(!modalOpen1)}>
          <ModalHeader toggle={() => setModalOpen1(!modalOpen1)}>
            Update Master Role
          </ModalHeader>
          <ModalBody>
            <Input type="text" placeholder="Role Name" className="mb-2" />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => setModalOpen1(false)}>
              Update
            </Button>
            <Button color="secondary" onClick={() => setModalOpen1(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        {/*  Modal for Delete Confirmation */}
        <Modal isOpen={modalOpen2} toggle={() => setModalOpen2(false)}>
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

export default RoleMasterList;
