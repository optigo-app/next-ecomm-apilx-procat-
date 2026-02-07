export const handelOpenMenu = () => {
  let menudata = JSON.parse(sessionStorage.getItem('menuparams'));
  if (menudata) {
    console.log('otherparamsUrl--', menudata);
    const queryParameters1 = [
      menudata?.FilterKey && `${menudata?.FilterVal}`,
      menudata?.FilterKey1 && `${menudata?.FilterVal1}`,
      menudata?.FilterKey2 && `${menudata?.FilterVal2}`,
    ].filter(Boolean).join('/');

    const queryParameters = [
      menudata?.FilterKey && `${menudata?.FilterVal}`,
      menudata?.FilterKey1 && `${menudata?.FilterVal1}`,
      menudata?.FilterKey2 && `${menudata?.FilterVal2}`,
    ].filter(Boolean).join(',');

    const otherparamUrl = Object.entries({
      b: menudata?.FilterKey,
      g: menudata?.FilterKey1,
      c: menudata?.FilterKey2,
    })
      .filter(([key, value]) => value !== undefined)
      .map(([key, value]) => value)
      .filter(Boolean)
      .join(',');

    // const paginationParam = [
    //   `page=${menudata.page ?? 1}`,
    //   `size=${menudata.size ?? 50}`
    // ].join('&');

    let menuEncoded = `${queryParameters}/${otherparamUrl}`;
    const url = `/p/${menudata?.menuname}/${queryParameters1}/?M=${btoa(
      menuEncoded
    )}`;
    return url;
  }
}