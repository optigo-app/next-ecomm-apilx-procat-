export const handelOpenMenu = () => {
  if (typeof window === "undefined") return "/";
  try {
    let menudata = JSON.parse(sessionStorage.getItem('menuparams'));
    if (menudata && (menudata.menuname || menudata.FilterKey || menudata.FilterVal)) {
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

      let menuEncoded = `${queryParameters}/${otherparamUrl}`;
      const url = `/p/${menudata?.menuname || "collection"}/${queryParameters1}/?M=${btoa(
        menuEncoded
      )}`;
      return url;
    }

    const firstAlbumUrl = sessionStorage.getItem('firstAlbumUrl');
    if (firstAlbumUrl) {
      return firstAlbumUrl;
    }

    return "/";
  } catch (e) {
    console.error("Error in handelOpenMenu:", e);
    return "/";
  }
};