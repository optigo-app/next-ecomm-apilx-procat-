// Central registry for theme page resolution (procatalog workspace).
// Themes: fgstore.pro | fgstore.pro.beta
// Default fallback: fgstore.pro

export async function resolveHome(themePage) {
  switch (themePage) {
    case "fgstore.pro.beta":
      return (await import("@/app/theme/fgstore.pro.beta/home/page.jsx")).default;
    case "fgstore.pro":
    default:
      return (await import("@/app/theme/fgstore.pro/home/page.jsx")).default;
  }
}

export async function resolveProductList(themePage) {
  switch (themePage) {
    case "fgstore.pro.beta":
      return (await import("@/app/theme/fgstore.pro.beta/product/page.jsx")).default;
    case "fgstore.pro":
    default:
      return (await import("@/app/theme/fgstore.pro/product/page.jsx")).default;
  }
}

export async function resolveProductDetail(themePage) {
  switch (themePage) {
    case "fgstore.pro.beta":
      return (await import("@/app/theme/fgstore.pro.beta/detail/page.jsx")).default;
    case "fgstore.pro":
    default:
      return (await import("@/app/theme/fgstore.pro/detail/page.jsx")).default;
  }
}

export async function resolveCart(themePage) {
  switch (themePage) {
    case "fgstore.pro.beta":
      return (await import("@/app/theme/fgstore.pro.beta/cart/page.jsx")).default;
    case "fgstore.pro":
    default:
      return (await import("@/app/theme/fgstore.pro/cart/page.jsx")).default;
  }
}

export async function resolveConfirmation(themePage) {
  switch (themePage) {
    case "fgstore.pro.beta":
      return (await import("@/app/theme/fgstore.pro.beta/confirmation/page.jsx")).default;
    case "fgstore.pro":
    default:
      return (await import("@/app/theme/fgstore.pro/confirmation/page.jsx")).default;
  }
}

export async function resolveDelivery(themePage) {
  switch (themePage) {
    case "fgstore.pro.beta":
      return (await import("@/app/theme/fgstore.pro.beta/delivery/page.jsx")).default;
    case "fgstore.pro":
    default:
      return (await import("@/app/theme/fgstore.pro/delivery/page.jsx")).default;
  }
}

export async function resolvePayment(themePage) {
  switch (themePage) {
    case "fgstore.pro.beta":
      return (await import("@/app/theme/fgstore.pro.beta/payment/page.jsx")).default;
    case "fgstore.pro":
    default:
      return (await import("@/app/theme/fgstore.pro/payment/page.jsx")).default;
  }
}

export async function resolveCustomOrders(themePage) {
  switch (themePage) {
    case "fgstore.pro.beta":
      return (await import("@/app/theme/fgstore.pro.beta/CustomOrder")).default;
    case "fgstore.pro":
    default:
      return (await import("@/app/theme/fgstore.pro/CustomOrder")).default;
  }
}

// --- Auth Pages ---

export async function resolveLoginWithEmail(themePage) {
  switch (themePage) {
    case "fgstore.pro.beta":
      return (await import("@/app/theme/fgstore.pro.beta/Auth/LoginWithEmail/page.js")).default;
    case "fgstore.pro":
    default:
      return (await import("@/app/theme/fgstore.pro/Auth/LoginWithEmail/page.js")).default;
  }
}

export async function resolveRegister(themePage) {
  switch (themePage) {
    case "fgstore.pro.beta":
      return (await import("@/app/theme/fgstore.pro.beta/Auth/Register/page.js")).default;
    case "fgstore.pro":
    default:
      return (await import("@/app/theme/fgstore.pro/Auth/Register/page.js")).default;
  }
}

export async function resolveLoginOption(themePage) {
  switch (themePage) {
    case "fgstore.pro.beta":
      return (await import("@/app/theme/fgstore.pro.beta/Auth/LoginOption/page.js")).default;
    case "fgstore.pro":
    default:
      return (await import("@/app/theme/fgstore.pro/Auth/LoginOption/page.js")).default;
  }
}

export async function resolveLoginWithMobileCode(themePage) {
  switch (themePage) {
    case "fgstore.pro.beta":
      return (await import("@/app/theme/fgstore.pro.beta/Auth/LoginWithMobileCode/page.js")).default;
    case "fgstore.pro":
    default:
      return (await import("@/app/theme/fgstore.pro/Auth/LoginWithMobileCode/page.js")).default;
  }
}

export async function resolveLoginWithEmailCode(themePage) {
  switch (themePage) {
    case "fgstore.pro.beta":
      return (await import("@/app/theme/fgstore.pro.beta/Auth/LoginWithEmailCode/page.js")).default;
    case "fgstore.pro":
    default:
      return (await import("@/app/theme/fgstore.pro/Auth/LoginWithEmailCode/page.js")).default;
  }
}

export async function resolveForgotPassword(themePage) {
  switch (themePage) {
    case "fgstore.pro.beta":
      return (await import("@/app/theme/fgstore.pro.beta/Auth/ForgotPassword/page.js")).default;
    case "fgstore.pro":
    default:
      return (await import("@/app/theme/fgstore.pro/Auth/ForgotPassword/page.js")).default;
  }
}

export async function resolveContinueWithEmail(themePage) {
  switch (themePage) {
    case "fgstore.pro.beta":
      return (await import("@/app/theme/fgstore.pro.beta/Auth/ContinueWithEmail/page.js")).default;
    case "fgstore.pro":
    default:
      return (await import("@/app/theme/fgstore.pro/Auth/ContinueWithEmail/page.js")).default;
  }
}

export async function resolveContinueWithMobile(themePage) {
  switch (themePage) {
    case "fgstore.pro.beta":
      return (await import("@/app/theme/fgstore.pro.beta/Auth/ContinueWithMobile/page.js")).default;
    case "fgstore.pro":
    default:
      return (await import("@/app/theme/fgstore.pro/Auth/ContinueWithMobile/page.js")).default;
  }
}
