import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { green } from '@mui/material/colors';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Grid, useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
// import RemarkModal from './RemarkModal';
import { GetCountAPI } from '../../../../../../utils/API/GetCount/GetCountAPI';
import { proCat_CartCount, proCat_loginState } from '../../../Recoil/atom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Cookies from "js-cookie";

const CartItem = ({
  item,
  CartCardImageFunc,
  onSelect,
  isSelected,
  selectedItem,
  isActive,
  multiSelect,
  onRemove,
  itemLength,
  showRemark,
  productRemark,
  handleAddRemark,
  handleRemarkChange,
  handleSave,
  handleCancel,
}) => {
  const [open, setOpen] = useState(false);
  const [remark, setRemark] = useState(item.Remarks || '');
  const [isSelectedItems, setIsSelectedItems] = useState();
  const [countstatus, setCountStatus] = useState();
  const setCartCountVal = useSetRecoilState(proCat_CartCount)

  const visiterId = Cookies.get('visiterId');
  const islogin = useRecoilValue(proCat_loginState)

  useEffect(() => {
    const isCartUpdateStatus = sessionStorage.getItem('cartUpdation');
    setCountStatus(isCartUpdateStatus)
  }, [onRemove])

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleRemarkChangeInternal = (e) => {
    setRemark(e.target.value);
    handleRemarkChange(e);
  };

  const handleSaveInternal = () => {
    handleSave(item, remark);
    handleClose();
  };

  useEffect(() => {
    handleIsSelected()
  }, [isSelected])

  const handleIsSelected = () => {
    let isselected = selectedItem?.id == item?.id
    
    setIsSelectedItems()
  }

  const handleRemoveItem = () => {
    onRemove(item)
    setTimeout(() => {
      if (countstatus) {
        GetCountAPI(visiterId, islogin).then((res) => {
          
          setCartCountVal(res?.cartcount);
        })
      }
    }, 500)
  }
  const isLargeScreen = useMediaQuery('(min-width:1px)');

  return (
    <Grid
      item
      xs={12}
      sm={itemLength <= 2 ? 6 : 6}
      md={itemLength <= 2 ? 6 : 6}
      lg={itemLength <= 2 ? 6 : 3}
      xxl={itemLength <= 2 ? 6 : 3}
      className='ProCat_B2CcartListCardGrid'>
      <Card className='ProCat_B2CcartListCard'
        sx={{
          boxShadow: selectedItem?.id == item?.id && 'none',
          border: selectedItem?.id == item?.id && '1px solid #af8238',
          maxWidth: 450,
          width: itemLength <= 2 ? '390px' : '100%'
        }}
        onClick={() => onSelect(item)}
      >
        <Box className="ProCat_mui_B2CCartBox" sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', position: 'relative' }}>
          <CardMedia
            component="img"
            image={CartCardImageFunc(item)}
            alt={item?.TitleLine}
            className='ProCat_B2CcartListImage'
          />
          <div>
            <CardContent className='ProCat_B2CcartcontentData'>
              <Typography variant="body2" className='ProCat_B2CDesignNoTExt'>
                {item?.designno}
              </Typography>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <div style={{ marginBottom: '10px' }}>
                  <Typography variant="body2" className='ProCat_B2Ccard-ContentData'>
                    NWT: {item?.MetalWeight}
                  </Typography>
                  <Typography variant="body2" className='ProCat_B2Ccard-ContentData'>
                    CWT: {item?.totalCSWt} / {item?.totalcolorstonepcs}
                  </Typography>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <Typography variant="body2" className='ProCat_B2Ccard-ContentData'>
                    GWT: {item?.totalGrossweight}
                  </Typography>
                  <Typography variant="body2" className='ProCat_B2Ccard-ContentData'>
                    DWT: {item?.totalDiaWt} / {item?.totaldiamondpcs}
                  </Typography>
                </div>
              </div>
              <Box className="ProCat_B2CcartbtngroupReRm" sx={{ position: 'absolute', bottom: '5px', right: '5px' }}>
                {item?.Remarks !== "" &&
                  <Typography variant="body2" className='ProCat_B2Ccard-ContentData'>
                    Remark: {item?.Remarks || productRemark}
                  </Typography>
                }
                <Link className='ProCat_B2CItemRemarkbtn' onClick={(e) => { e.stopPropagation(); handleOpen(); }} variant="body2">
                  {item?.Remarks ? "Update Remark" : "Add Remark"}
                </Link>
                <Link className='ProCat_B2CReomoveCartbtn' href="#" variant="body2" onClick={() => handleRemoveItem(item)} >
                  Remove
                </Link>
              </Box>
            </CardContent>
          </div>
        </Box>
      </Card>
    </Grid>
  );
};

export default CartItem;
