import React, { useEffect, useState } from "react";
import "./manageaddress.scss";
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, RadioGroup, TextField, Typography } from "@mui/material";
import StayPrimaryPortraitIcon from "@mui/icons-material/StayPrimaryPortrait";
import { toast } from "react-toastify";
import { getAddressData, handleAddAddress, handleDefaultSelectionAddress, handleDeleteAddress, handleEditAddress } from "@/app/(core)/utils/API/AccountTabs/manageAddress";
import ConfirmationDialog from "@/app/(core)/utils/Glob_Functions/ConfirmationDialog/ConfirmationDialog";
import { validateAddressFieldAccount, validateAddressFormAccount } from "@/app/(core)/utils/Glob_Functions/AccountPages/AccountPage";
import Link from "next/link";

const ManageAddress = () => {
  const [defaultAdd, setDefaultAdd] = useState("female");
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [addressData, setAddressData] = useState([]);
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editId, setEditId] = useState("");
  const [editAddressIndex, setEditAddressIndex] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    country: "",
    state: "",
    city: "",
    zipCode: "",
    mobileNo: "",
  });

  const [defaultAddress, setDefaultAddress] = useState(null);

  const handleDefault = (event) => {
    setDefaultAdd(event.target.value);
  };

  const handleDeleteAddressBtn = async () => {
    try {
      setOpenDelete(false);
      setIsLoading(true);
      const storedData = sessionStorage.getItem("loginUserDetail");
      const data = JSON.parse(storedData);
      const customerid = data?.id;
      const storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
      const { FrontEnd_RegNo } = storeInit;

      const response = await handleDeleteAddress(deleteId, data, FrontEnd_RegNo, customerid);
      if (response?.Data?.rd[0]?.stat === 1) {
        const updatedAddressData = addressData?.filter((item) => item?.id !== deleteId);
        setAddressData(updatedAddressData);
        fetchData();
        toast.success("Delete Success");
      } else {
        toast.error("error");
      }
      setOpenDelete(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = (item, addressIndex = null, args) => {
    // setIsEditMode(addressIndex !== null);
    console.log(item, addressIndex, args);

    if (args === "edit") {
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }

    if (addressIndex !== null && addressData.length > addressIndex) {
      setEditId(item.id);
      const address = addressData[addressIndex];
      if (address) {
        setFormData({
          firstName: address.shippingfirstname || "",
          lastName: address.shippinglastname || "",
          address: address.street || "",
          country: address.country || "",
          state: address.state || "",
          city: address.city || "",
          zipCode: address.zip || "",
          mobileNo: address.shippingmobile || "",
        });
        setEditAddressIndex(addressIndex);
      } else {
        console.error("Invalid address data:", address);
      }
    } else {
      // Reset form data when adding a new address
      setFormData({
        firstName: "",
        lastName: "",
        address: "",
        country: "",
        state: "",
        city: "",
        zipCode: "",
        mobileNo: "",
      });
      setEditAddressIndex(null);
    }
    setErrors({});
    setOpen(true);
  };

  const handleOpenDelete = (item) => {
    setDeleteId(item);
    setOpenDelete(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    const errorsCopy = validateAddressFormAccount(formData);

    // Update errors state and prevent submission if there are errors
    setErrors(errorsCopy);
    if (Object.keys(errorsCopy).length > 0) {
      return; // Exit if there are validation errors
    }

    try {
      setIsLoading(true); // Set loading state

      const storedData = sessionStorage.getItem("loginUserDetail");
      const data = JSON.parse(storedData);
      const customerid = data.id;
      const storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
      const { FrontEnd_RegNo } = storeInit;

      let response;

      if (isEditMode) {
        // Handle edit mode
        setOpen(false); // Close modal or dialog
        response = await handleEditAddress(editId, formData, FrontEnd_RegNo, customerid, storeInit, data);

        if (response?.Data?.rd[0]?.stat === 1) {
          // Handle successful edit
          toast.success("Edit success");

          const editedAddress = {
            ...addressData[editAddressIndex],
            shippingfirstname: formData.firstName,
            shippinglastname: formData.lastName,
            street: formData.address,
            country: formData.country,
            state: formData.state,
            city: formData.city,
            zip: formData.zipCode,
            shippingmobile: formData.mobileNo,
          };
          const updatedAddressData = [...addressData];
          updatedAddressData[editAddressIndex] = editedAddress;
          setAddressData(updatedAddressData);
          if (editedAddress?.isdefault === 1) {
            setDefaultAddress(editedAddress);
          }
        } else {
          toast.error("Error editing");
        }
      } else {
        // Handle add mode
        setOpen(false); // Close modal or dialog

        response = await handleAddAddress(formData, FrontEnd_RegNo, customerid, storeInit, data);

        if (response?.Data?.rd[0]?.stat === 1) {
          // Handle successful addition
          toast.success("Add success");

          const newAddress = {
            shippingfirstname: formData.firstName,
            shippinglastname: formData.lastName,
            street: formData.address,
            country: formData.country,
            state: formData.state,
            city: formData.city,
            zip: formData.zipCode,
            shippingmobile: formData.mobileNo,
          };

          const updatedAddressData = [...addressData, newAddress];
          setAddressData(updatedAddressData);
          fetchData(); // Assuming fetchData updates necessary data after addition
        } else {
          toast.error("Error adding");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false); // Ensure loading state is reset, regardless of success or failure
    }
  };

  const handleInputChange = (e, fieldName) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));

    const error = validateAddressFieldAccount(fieldName, value);

    // setErrors(errorsCopy);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: error,
    }));
  };

  const handleClose = () => {
    setFormData({
      firstName: "",
      lastName: "",
      address: "",
      country: "",
      state: "",
      city: "",
      zipCode: "",
      mobileNo: "",
    });
    setErrors({});
    setEditAddressIndex(null);
    setIsEditMode(false);
    setOpen(false);
  };

  const loginDetail = () => {
    const storedData = sessionStorage.getItem("loginUserDetail");
    const data = JSON.parse(storedData);
    return { id: data.id, email: data.userid };
  };

  const handleDefaultSelection = async (addressId) => {
    setIsLoading(true);
    try {
      let loginCred = loginDetail();
      const storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
      const { FrontEnd_RegNo } = storeInit;

      const response = await handleDefaultSelectionAddress(loginCred, addressId, FrontEnd_RegNo);

      if (response?.Status === "200" && response?.Data?.rd) {
        setIsLoading(false);
        fetchData();
      } else {
        toast.error("No Data Found");
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const storedData = sessionStorage.getItem("loginUserDetail");
      const data = JSON.parse(storedData);
      const customerid = data.id;

      const storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
      const { FrontEnd_RegNo } = storeInit;

      const response = await getAddressData(FrontEnd_RegNo, customerid, data);

      if (response?.Data?.rd) {
        if (response?.Data?.rd?.length > 0) {
          let res = response?.Data?.rd?.find((e) => e?.isdefault === 1);

          let arr = [];
          if (res === undefined) {
            response?.Data?.rd?.forEach((a, i) => {
              let obj = { ...a };
              if (i === 0) {
                obj.isdefault = 1;
              }
              arr.push(obj);
            });
            setAddressData(arr);
            setDefaultAddress(arr[0]);
          } else {
            setDefaultAddress(res);
            setAddressData(response?.Data?.rd);
          }
        }
      } else {
        setAddressData([]);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCloseDialog = () => {
    setOpenDelete(false);
  };

  return (
    <>
      <div className="address_Account_SMR">
        <p className="savedAddress btnColorProCat">Saved Addresses</p>
        <Box sx={{ paddingLeft: "15px" }}>
          <Button className="muiSmilingRocksBtnManage savedAddressManageBtn" variant="contained" sx={{ background: "#7d7f85", padding: "6px 15px", textAlign: "end", fontSize: "0.9rem", marginBottom: "10px", marginTop: "18px", borderRadius: "0" }} onClick={() => handleOpen("", null, "add")}>
            ADD NEW ADDRESS
          </Button>
        </Box>
        <RadioGroup aria-labelledby="demo-controlled-radio-buttons-group" name="controlled-radio-buttons-group" value={defaultAdd} onChange={handleDefault}>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", paddingTop: "10px" }}>
              <CircularProgress className="loadingBarManage" />
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexWrap: "wrap", paddingTop: "10px" }} className="addressMainSec">
              {addressData?.map((item, index) => {
                return (
                  <Box className="AddressSec" key={index}>
                    <Box className={`manageAddressBlock ${item.isdefault === 1 && `manageAddressDefault`}`}>
                      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                        <Box sx={{ paddingRight: "5px", fontweight: "600", paddingBottom: "10px" }}>
                          <h6>{item?.shippingfirstname && item?.shippingfirstname}</h6>
                        </Box>
                        <Box sx={{ fontweight: "600" }}>
                          <h6>{item?.shippinglastname !== undefined && item?.shippinglastname}</h6>
                        </Box>
                      </Box>
                      <Box>
                        <Typography sx={{ paddingBottom: "15px" }}>
                          {item?.street !== undefined && item?.street},{item?.city !== undefined && item?.city}-{item?.zip !== undefined && item?.zip},{item?.state !== undefined && item?.state},{item?.country !== undefined && item?.country}
                        </Typography>
                      </Box>
                      <Link href={`tel:+${parseInt(item?.shippingmobile)}`} style={{ textDecoration: "unset" }}>
                        <Box sx={{ display: "flex", paddingBottom: "15px", textDecoration: "unset", marginLeft: "-4px" }}>
                          <StayPrimaryPortraitIcon />
                          <a href={`tel:+${parseInt(item?.shippingmobile)}`} style={{ textDecoration: "none" }}>
                            {item?.shippingmobile}
                          </a>
                        </Box>
                      </Link>

                      <Box sx={{ display: "flex", paddingBottom: "7px", alignItems: "center" }}>
                        <input type="radio" checked={item.isdefault === 1} onChange={() => handleDefaultSelection(item.id)} className="manageAddressInputRadio" id={`default-${item.id}`} name="manageAddressInputRadio" />
                        <label htmlFor={`default-${item.id}`}>
                          <Typography>Default</Typography>
                        </label>
                      </Box>

                      <Box className="addresDetailsTg addresDetailsBtn" sx={{ borderTop: "1px solid rgba(0, 0, 0, 0.04) !important", display: "flex", flexWrap: "wrap", paddingTop: "20px", position: "absolute", bottom: 0, left: "15px", width: "calc( 100% - 30px)" }}>
                        <Button
                          className="muiSmilingRocksBtnManageEdit"
                          variant="contained"
                          sx={{
                            background: "#7d7f85",
                            maxHeight: "30px",
                            minWidth: "max-content",
                            maxWidth: "max-content",
                            padding: "6px 10px",
                            fontSize: "0.9rem",
                            marginBottom: "10px",
                            borderRadius: "0",
                          }}
                          onClick={() => handleOpen(item, index, "edit")}
                        >
                          Edit
                        </Button>
                        {item.isdefault !== 1 && (
                          <Button
                            className="muiSmilingRocksBtnManageEdit"
                            variant="contained"
                            sx={{
                              background: "#7d7f85",
                              maxHeight: "30px",
                              minWidth: "max-content",
                              maxWidth: "max-content",
                              marginLeft: "15px",
                              padding: "6px 10px",
                              fontSize: "0.9rem",
                              marginBottom: "10px",
                              borderRadius: "0",
                            }}
                            onClick={() => handleOpenDelete(item.id)}
                          >
                            Delete
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
        </RadioGroup>

        <ConfirmationDialog open={openDelete} onClose={handleCloseDialog} onConfirm={handleDeleteAddressBtn} title="Delete Address" content="Are you sure you want to delete address?" />

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle sx={{ textAlign: "center", textDecoration: "underline" }}>{isEditMode ? "Edit" : "Add"} Shipping Info</DialogTitle>

          <Divider />

          <form onSubmit={(event) => handleSubmit(event)}>
            <DialogContent sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField id="firstName" label="First Name" fullWidth value={formData.firstName} onChange={(e) => handleInputChange(e, "firstName")} error={!!errors.firstName} helperText={errors.firstName || ""} />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField id="lastName" label="Last Name" fullWidth value={formData.lastName} onChange={(e) => handleInputChange(e, "lastName")} error={!!errors.lastName} helperText={errors.lastName || ""} />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField id="address" label="Address" fullWidth multiline rows={3} value={formData.address} onChange={(e) => handleInputChange(e, "address")} error={!!errors.address} helperText={errors.address || ""} />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField id="country" label="Country" fullWidth value={formData.country} onChange={(e) => handleInputChange(e, "country")} error={!!errors.country} helperText={errors.country || ""} />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField id="state" label="State" fullWidth value={formData.state} onChange={(e) => handleInputChange(e, "state")} error={!!errors.state} helperText={errors.state || ""} />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField id="city" label="City" fullWidth value={formData.city} onChange={(e) => handleInputChange(e, "city")} error={!!errors.city} helperText={errors.city || ""} />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField id="zipCode" label="ZIP Code" fullWidth value={formData.zipCode} onChange={(e) => handleInputChange(e, "zipCode")} error={!!errors.zipCode} helperText={errors.zipCode || ""} />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField id="mobileNo" label="Mobile No." fullWidth type="tel" value={formData.mobileNo} onChange={(e) => handleInputChange(e, "mobileNo")} error={!!errors.mobileNo} helperText={errors.mobileNo || ""} />
                </Grid>
              </Grid>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ p: 3 }}>
              <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    bgcolor: "black",
                  }}
                >
                  {isEditMode ? "Edit" : "Add"}
                </Button>

                <Button variant="outlined" fullWidth onClick={handleClose}>
                  Cancel
                </Button>
              </Box>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    </>
  );
};

export default ManageAddress;

{
  /* <Dialog open={open} onClose={handleClose} >
                    <div className='smilingAddressPopupMain'>
                        <DialogTitle style={{ textAlign: 'center', textDecoration: 'underline' }}>{ isEditMode ? 'Edit' : 'Add' } Shipping Info</DialogTitle>
                        <form onSubmit={(event) => handleSubmit(event)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <TextField
                                id="firstName"
                                label="First Name"
                                variant="outlined"
                                className="labgrowRegister"
                                style={{ margin: '15px' }}
                                value={formData.firstName}
                                onChange={(e) => handleInputChange(e, 'firstName')}
                                error={!!errors.firstName}
                                helperText={errors.firstName || ''}
                            />
                            <TextField
                                id="lastName"
                                label="Last Name"
                                variant="outlined"
                                className="labgrowRegister"
                                style={{ margin: '15px' }}
                                value={formData.lastName}
                                onChange={(e) => handleInputChange(e, 'lastName')}
                                error={!!errors.lastName}
                                helperText={errors.lastName || ''}
                            />
                            <TextField
                                id="address"
                                label="Address"
                                variant="outlined"
                                className="labgrowRegister"
                                style={{ margin: '15px' }}
                                value={formData.address}
                                onChange={(e) => handleInputChange(e, 'address')}
                                error={!!errors.address}
                                helperText={errors.address || ''}
                            />
                            <TextField
                                id="country"
                                label="Country"
                                variant="outlined"
                                className="labgrowRegister"
                                style={{ margin: '15px' }}
                                value={formData.country}
                                onChange={(e) => handleInputChange(e, 'country')}
                                error={!!errors.country}
                                helperText={errors.country || ''}
                            />
                            <TextField
                                id="state"
                                label="State"
                                variant="outlined"
                                className="labgrowRegister"
                                style={{ margin: '15px' }}
                                value={formData.state}
                                onChange={(e) => handleInputChange(e, 'state')}
                                error={!!errors.state}
                                helperText={errors.state || ''}
                            />
                            <TextField
                                id="city"
                                label="City"
                                variant="outlined"
                                className="labgrowRegister"
                                style={{ margin: '15px' }}
                                value={formData.city}
                                onChange={(e) => handleInputChange(e, 'city')}
                                error={!!errors.city}
                                helperText={errors.city || ''}
                            />
                            <TextField
                                id="zipCode"
                                label="ZIP Code"
                                variant="outlined"
                                className="labgrowRegister"
                                style={{ margin: '15px' }}
                                value={formData.zipCode}
                                onChange={(e) => handleInputChange(e, 'zipCode')}
                                error={!!errors.zipCode}
                                helperText={errors.zipCode || ''}
                            />
                            <TextField
                                id="mobileNo"
                                label="Mobile No."
                                variant="outlined"
                                className="labgrowRegister"
                                style={{ margin: '15px' }}
                                value={formData.mobileNo}
                                onChange={(e) => handleInputChange(e, 'mobileNo')}
                                error={!!errors.mobileNo}
                                helperText={errors.mobileNo || ''}
                            />
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px', marginBottom: '30px' }}>
                                    <button type="submit" className='smilingDeleveryformSaveBtn'>{isEditMode ? 'Edit' : 'Add'}</button>
                                    <button onClick={handleClose} className='smilingDeleveryformCansleBtn_SMR'> Cancel </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </Dialog> */
}
