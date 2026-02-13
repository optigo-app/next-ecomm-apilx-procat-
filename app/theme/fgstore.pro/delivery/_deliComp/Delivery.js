"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Stack,
  Divider
} from "@mui/material";
import AddressForm from "./AddressForm";
import AddressCard from "./AddressCard";
import SkeletonLoader from "./AddressSkelton";
import ConfirmationDialog from "@/app/(core)/utils/Glob_Functions/ConfirmationDialog/ConfirmationDialog";
import { useAddress } from "@/app/(core)/utils/Glob_Functions/OrderFlow/useAddress";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";

const AddressManagement = () => {
  const {
    addressData,
    open,
    openDelete,
    formData,
    errors,
    isEditMode,
    isLoading,
    handleOpen,
    handleClose,
    handleCancel,
    handleInputChange,
    handleSubmit,
    handleDelete,
    handleDeleteClick,
    handleDeleteClose,
    handleDefaultSelection,
    proceedToOrder
  } = useAddress();

  const location = useNextRouterLikeRR();
  const navigate = location.push;

  return (
    <Box sx={{ bgcolor: "#fff", pb: 8 ,px: { xs: 0, md: 8 } }}>
      <Container maxWidth={false} sx={{ pt: { xs: 4, md: 8 }  }}>
        
        {/* Header Section */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          <Box>
            <Typography variant="h4" fontWeight={600}>
              Delivery
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Order will be delivered to selected address
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            sx={{
                bgcolor:'black'
            }}
            onClick={() => proceedToOrder(navigate)}
          >
            Continue
          </Button>
        </Stack>

        <Divider sx={{ my: 4 }} />

        {/* Address Grid Section */}
        {!isLoading ? (
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={3}>
              {addressData?.map((data, index) => (
                <AddressCard
                  key={data.id}
                  address={data}
                  index={index}
                  handleOpen={handleOpen}
                  handleDeleteClick={handleDeleteClick}
                  handleDefaultSelection={handleDefaultSelection}
                />
              ))}
            </Grid>
          </Box>
        ) : (
          <SkeletonLoader />
        )}

        {/* Add New Address Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => handleOpen(null)}
             sx={{
                bgcolor:'black',
                color:"#fff"
            }}
          >
            Add New Address
          </Button>
        </Box>

        {/* Dialogs */}
        <AddressForm
          open={open}
          handleClose={handleClose}
          handleCancel={handleCancel}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          errors={errors}
          isEditMode={isEditMode}
        />

        <ConfirmationDialog
          open={openDelete}
          onClose={handleDeleteClose}
          onConfirm={handleDelete}
          title="Confirm"
          content="Are you sure you want to remove this address?"
        />
      </Container>
    </Box>
  );
};

export default AddressManagement;


// "use client";

// import React from 'react';
// import './Delivery.scss'
// import AddressForm from './AddressForm';
// import AddressCard from './AddressCard';
// import { useAddress } from '@/app/(core)/utils/Glob_Functions/OrderFlow/useAddress';
// import { Grid } from '@mui/material';
// import SkeletonLoader from './AddressSkelton';
// import ConfirmationDialog from '@/app/(core)/utils/Glob_Functions/ConfirmationDialog/ConfirmationDialog';
// import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';

// const AddressManagement = () => {
//     const {
//         addressData,
//         open,
//         openDelete,
//         formData,
//         errors,
//         isEditMode,
//         isLoading,
//         handleOpen,
//         handleClose,
//         handleCancel,
//         handleInputChange,
//         handleSubmit,
//         handleDelete,
//         handleDeleteClick,
//         handleDeleteClose,
//         handleDefaultSelection,
//         proceedToOrder
//     } = useAddress();

//     const location = useNextRouterLikeRR();
//     const navigate = location.push;

//     return (
//         <div className='smr_DeliverMainDiv'>
//             <div className='smr_secondMaindivAdd'>
//                 <div className='smr_addMainDiv'>
//                     <div className='smr_TitleDetailMainDiv'>
//                         <div>
//                             <h1 className='smr_deliveryTitle'>Delivery</h1>
//                             <p className='smr_deliverydesc'>Order Will be delivered to selected address</p>
//                         </div>
//                         <button className='smr_ContinueOrderbtn' onClick={() => proceedToOrder(navigate)}>Continue</button>
//                     </div>
//                     {!isLoading ? (
//                         <div className='smr_getAddrMainDiv'>
//                             <Grid container spacing={2}>
//                                 {addressData?.map((data, index) => (
//                                     <React.Fragment key={data.id} >
//                                         <AddressCard
//                                             key={data.id}
//                                             name={data.name}
//                                             address={data}
//                                             index={index}
//                                             handleOpen={handleOpen}
//                                             handleDeleteClick={handleDeleteClick}
//                                             handleDefaultSelection={handleDefaultSelection} />
//                                     </React.Fragment>
//                                 ))}
//                             </Grid>
//                         </div>
//                     ) :
//                         <SkeletonLoader />
//                     }
//                     <AddressForm
//                         open={open}
//                         handleClose={handleClose}
//                         handleCancel={handleCancel}
//                         formData={formData}
//                         handleInputChange={handleInputChange}
//                         handleSubmit={handleSubmit}
//                         errors={errors}
//                         isEditMode={isEditMode}
//                     />
//                     <ConfirmationDialog
//                         open={openDelete}
//                         onClose={handleDeleteClose}
//                         onConfirm={handleDelete}
//                         title="Confirm"
//                         content="Are you sure you want to remove this address?"
//                     />
//                     <div className='smr_AddressBtnGroup'>
//                         <button className='smr_AddNewAddrbtn' onClick={() => handleOpen(null)}>Add New Address</button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddressManagement;
