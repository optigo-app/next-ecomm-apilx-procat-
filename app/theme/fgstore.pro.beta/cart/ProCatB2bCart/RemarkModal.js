import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  Stack
} from "@mui/material";

const RemarkModal = ({ open, onClose, remark, onRemarkChange, onSave }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 4,
          backdropFilter: "blur(8px)"
        }
      }}
    >
      <DialogTitle sx={{ textAlign: "left", pb: 1 }}>
        <Typography variant="h6" fontWeight={600}>
          Add Item Remark
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add any special instructions for this item
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <TextField
          autoFocus
          multiline
          rows={5}
          fullWidth
          value={remark}
          onChange={onRemarkChange}
          placeholder="Write your remark here..."
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2
            }
          }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          width="100%"
        >
          <Button
            variant="contained"
            fullWidth
            onClick={onSave}
            sx={{
              py: 1.2,
              fontWeight: 500,
            }}
            className="btnColorProCatProduct"
          >
            Save Remark
          </Button>

          <Button
            variant="outlined"
            fullWidth
            onClick={onClose}
            sx={{
              borderColor: "black",
              color: "black",
              py: 1.2,
              "&:hover": {
                borderColor: "#222",
                backgroundColor: "rgba(0,0,0,0.04)"
              }
            }}
          >
            Cancel
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default RemarkModal;

// import React from 'react';
// import Modal from '@mui/material/Modal';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import './proCat_RemarkModal.scss';

// const RemarkModal = ({ open, onClose, remark, onRemarkChange, onSave }) => {

//   return (
//     <Modal
//       open={open}
//       onClose={onClose}
//       aria-labelledby="remark-modal-title"
//       aria-describedby="remark-modal-description"
//     >
//       <Box
//         sx={{
//           position: 'absolute',
//           top: '50%',
//           left: '50%',
//           transform: 'translate(-50%, -50%)',
//           maxWidth: 800,
//           width:500,
//           bgcolor: 'background.paper',
//           boxShadow: 24,
//           p: 4,
//           display: 'flex',
//           flexDirection: 'column',
//           borderRadius: '8px',
//         }}
//         className="proCat_remarkModalBox"
//       >
//         <Typography id="remark-modal-title" variant="h6" component="h2">
//           Add The Item Remark..
//         </Typography>
//         <TextField
//           id="remark-modal-description"
//           multiline
//           rows={4}
//           variant="outlined"
//           fullWidth
//           value={remark}
//           onChange={onRemarkChange}
//           sx={{ mt: 2 }}
//           className='proCat_RemarkMoalInput'
//         />
//         <div className="proCat_projectRemarkBtn-group">
//           <Button className="proCat_remarksave-btn" onClick={onSave}>
//             Save
//           </Button>
//           <Button className="proCat_remarkcancel-btn" onClick={onClose}>
//             Cancel
//           </Button>
//         </div>
//       </Box>
//     </Modal>
//   );
// };

// export default RemarkModal;
