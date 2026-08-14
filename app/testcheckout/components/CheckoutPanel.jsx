"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Paper,
  Divider,
  Stack,
  Skeleton,
  CircularProgress,
  Grid,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRouter } from "next/navigation";
import AddressDrawer from "./AddressDrawer";
import OrderRemarkModal from "./OrderRemarkModal";

export default function CheckoutPanel({
  storeinit,
  currencyCode,
  formatter,
  subtotal,
  estimatedTax,
  totalAmount,
  isLoadingCart = false,
  isLoadingTax = false,
  addressList,
  selectedAddress,
  isLoadingAddress = false,
  onSelectAddress,
  onAddNewAddress,
  orderRemark,
  onSaveOrderRemark,
  paymentMethods,
  selectedPaymentMethod,
  onSelectPaymentMethod,
  isPlacingOrder,
  onCheckout,
}) {
  const router = useRouter();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isOrderRemarkModalOpen, setIsOrderRemarkModalOpen] = useState(false);

  const isSummaryLoading = isLoadingCart || isLoadingTax;
  const isAddrLoading = isLoadingCart || isLoadingAddress;
  const isPayLoading = isLoadingCart || !paymentMethods || paymentMethods.length === 0;

  const hasAddress = Boolean(
    selectedAddress &&
      (selectedAddress?.shippingfirstname || selectedAddress?.street),
  );

  return (
    <Box
      className="testCheckout_panel"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* 1. Order Summary Card */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3 },
          borderRadius: "8px",
          border: "1px solid #eee",
          bgcolor: "#fff",
        }}
      >
        <Typography variant="h6" fontWeight={500} sx={{ color: "#222", mb: 0.5, fontSize: "1.05rem", letterSpacing: "0.2px" }}>
          Order Summary
        </Typography>
        <Typography variant="body2" sx={{ color: "#888", fontSize: "0.85rem", mb: 2 }}>
          Review your order details
        </Typography>

        <Stack spacing={1.3}>
          <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
            <Typography sx={{ color: "#666", fontSize: "0.9rem" }}>Subtotal</Typography>
            {isSummaryLoading ? (
              <Skeleton width={90} height={22} />
            ) : (
              <Typography fontWeight={500} color="#222">
                {currencyCode} {formatter(subtotal)}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
            <Typography sx={{ color: "#666", fontSize: "0.9rem" }}>Estimated Tax</Typography>
            {isSummaryLoading ? (
              <Skeleton width={80} height={22} />
            ) : (
              <Typography fontWeight={500} color="#222">
                {currencyCode} {formatter(estimatedTax)}
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 0.8, borderColor: "#f0f0f0" }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="subtitle1" fontWeight={600} color="#222" sx={{ fontSize: "0.98rem" }}>
              Total Amount
            </Typography>
            {isSummaryLoading ? (
              <Skeleton width={110} height={30} />
            ) : (
              <Typography variant="h6" fontWeight={600} color="#004d40" sx={{ fontSize: "1.15rem" }}>
                {currencyCode} {formatter(totalAmount)}
              </Typography>
            )}
          </Box>
        </Stack>
      </Paper>

      {/* 2. Shipping Address Card */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3 },
          borderRadius: "8px",
          border: "1px solid #eee",
          bgcolor: "#fff",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
          <Box>
            <Typography variant="h6" fontWeight={500} sx={{ color: "#222", fontSize: "1.05rem", letterSpacing: "0.2px" }}>
              Shipping Address
            </Typography>
            <Typography variant="body2" sx={{ color: "#888", fontSize: "0.85rem" }}>
              Where should we deliver?
            </Typography>
          </Box>

          {!isAddrLoading && hasAddress && (
            <Button
              variant="contained"
              size="small"
              onClick={() => setIsAddressModalOpen(true)}
                 className="btnColorProCatProduct"
              sx={{
              
                fontSize: "0.78rem",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "2px",
                px: 2,
                "&:hover": { bgcolor: "#00332c" },
              }}
            >
              Change Address
            </Button>
          )}
        </Box>

        {isAddrLoading ? (
          <Skeleton variant="rectangular" height={85} sx={{ borderRadius: "8px" }} />
        ) : hasAddress ? (
          /* Address display */
          <Box
            sx={{
              p: 2,
              bgcolor: "#f9f9f9",
              borderRadius: "8px",
              border: "1px solid #eee",
              mb: 1.5,
            }}
          >
            <Typography variant="subtitle2" fontWeight={700} sx={{ textTransform: "capitalize", color: "#111" }}>
              {selectedAddress?.shippingfirstname} {selectedAddress?.shippinglastname}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.5 }}>
              {selectedAddress?.street}
              <br />
              {selectedAddress?.city} - {selectedAddress?.zip}
              <br />
              {selectedAddress?.state}, {selectedAddress?.country}
              <br />
              Mobile: {selectedAddress?.shippingmobile}
            </Typography>
          </Box>
        ) : (
          /* B2C / No address state: Prompt to Set Delivery Address */
          <Box sx={{ my: 2, textAlign: "center" }}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setIsAddressModalOpen(true)}
              sx={{
                bgcolor: "#004d40",
                color: "#fff",
                py: 1.5,
                fontWeight: 600,
                fontSize: "0.95rem",
                textTransform: "none",
                borderRadius: "8px",
                "&:hover": { bgcolor: "#00332c" },
              }}
            >
              Set Your Delivery Address
            </Button>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
              Add your delivery address to proceed with checkout
            </Typography>
          </Box>
        )}

        {/* Order Remarks Link & Display */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
          <Typography
            component="button"
            onClick={() => setIsOrderRemarkModalOpen(true)}
            sx={{
              border: "none",
              background: "none",
              padding: 0,
              color: "#004d40",
              fontSize: "0.82rem",
              fontWeight: 600,
              textDecoration: "underline",
              cursor: "pointer",
              "&:hover": { color: "#002d26" },
            }}
          >
            {orderRemark ? "Update Order Remark" : "Add Order Remark"}
          </Typography>
        </Box>

        {orderRemark && (
          <Box sx={{ mt: 1.5, p: 1.5, bgcolor: "#f5f5f5", borderRadius: "6px" }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: "block" }}>
              Order Note:
            </Typography>
            <Typography variant="body2" color="#333">
              {orderRemark}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* 3. Payment Method Card - Clean 2-Column Grid */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3 },
          borderRadius: "8px",
          border: "1px solid #eee",
          bgcolor: "#fff",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 0.5 }}>
          <Typography variant="h6" fontWeight={500} sx={{ color: "#222", fontSize: "1.05rem", letterSpacing: "0.2px" }}>
            Payment Method
          </Typography>
          <Typography variant="caption" sx={{ color: "#888", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Secure Checkout
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: "#888", fontSize: "0.85rem", mb: 2 }}>
          Select your preferred payment gateway
        </Typography>

        {isPayLoading ? (
          <Grid container spacing={1.5}>
            {[1, 2, 3, 4].map((i) => (
              <Grid key={i} size={{ xs: 12, sm: 6 }}>
                <Skeleton variant="rounded" height={56} sx={{ borderRadius: "6px" }} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={1.5}>
            {paymentMethods?.map((method) => {
              const isChecked = String(selectedPaymentMethod) === String(method.id);
              return (
                <Grid key={method.id} size={{ xs: 12, sm: 6 }}>
                  <Paper
                    elevation={0}
                    onClick={() => onSelectPaymentMethod(String(method.id))}
                    sx={{
                      p: 1.5,
                      borderRadius: "6px",
                      border: isChecked ? "1.5px solid #004d40" : "1px solid #e8e8e8",
                      bgcolor: isChecked ? "#f4f9f7" : "#fff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1.2,
                      minHeight: 56,
                      position: "relative",
                      transition: "all 0.18s ease",
                      boxShadow: isChecked ? "0 2px 8px rgba(0, 77, 64, 0.08)" : "none",
                      "&:hover": {
                        borderColor: isChecked ? "#004d40" : "#bbb",
                        bgcolor: isChecked ? "#f4f9f7" : "#fafafa",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, minWidth: 0 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "6px",
                          bgcolor: isChecked ? "#e0f2f1" : "#f5f5f5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: isChecked ? "#004d40" : "#555",
                          fontSize: "1.15rem",
                          flexShrink: 0,
                          transition: "all 0.18s ease",
                        }}
                      >
                        {method.icon}
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: isChecked ? 600 : 500,
                            color: isChecked ? "#004d40" : "#222",
                            fontSize: "0.85rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {method.GatewayName}
                        </Typography>
                        {method.id === 3 ? (
                          <Typography variant="caption" sx={{ color: "#777", fontSize: "0.72rem", display: "block", lineHeight: 1.2 }}>
                            Pay on delivery
                          </Typography>
                        ) : (
                          <Typography variant="caption" sx={{ color: "#888", fontSize: "0.72rem", display: "block", lineHeight: 1.2 }}>
                            Online Payment
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ flexShrink: 0 }}>
                      {isChecked ? (
                        <CheckCircleIcon sx={{ color: "#004d40", fontSize: 18 }} />
                      ) : (
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            border: "1.5px solid #ccc",
                          }}
                        />
                      )}
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Paper>

      {/* 4. Checkout / Place Order Button */}
      <Button
        variant="contained"
        fullWidth
        disabled={isPlacingOrder}
        onClick={onCheckout}
        className="btnColorProCatProduct"
        sx={{
          py: 1.8,
          fontSize: "1.05rem",
          fontWeight: 700,
          letterSpacing: "1px",
          borderRadius: "1px",
          textTransform: "uppercase",
        }}
      >
        {isPlacingOrder ? (
          <CircularProgress size={24} sx={{ color: "#fff" }} />
        ) : (
          "CHECKOUT"
        )}
      </Button>

      {/* 5. Need Help Support Strip */}
      <Box
        sx={{
          p: 2.5,
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <Typography variant="subtitle2" fontWeight={700} color="#111" gutterBottom>
          Need Help?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.82rem" }}>
          Contact us: {storeinit?.companysupportemail}
        </Typography>
      </Box>

      {/* Address Selection & Add Drawer */}
      <AddressDrawer
        open={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        addressList={addressList}
        selectedAddress={selectedAddress}
        onSelectAddress={onSelectAddress}
        onAddNewAddress={onAddNewAddress}
      />

      {/* Order Remark Modal */}
      <OrderRemarkModal
        open={isOrderRemarkModalOpen}
        onClose={() => setIsOrderRemarkModalOpen(false)}
        initialRemark={orderRemark}
        onSave={onSaveOrderRemark}
      />
    </Box>
  );
}
