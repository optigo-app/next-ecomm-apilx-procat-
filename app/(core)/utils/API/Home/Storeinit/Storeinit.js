import axios from 'axios';
import { REACT_APP_WEB } from '../../../../env';

export const Storeinit = async (param) => {
  // const APIURL = 'https://api.optigoapps.com/storev26/store.aspx';
  const APIURL = (window.location.hostname === 'localhost'
    || window.location.hostname === 'zen'
    || window.location.hostname === 'fgstore.web'
    || window.location.hostname === 'fgstore.mapp'
    || window.location.hostname === 'fgstorepro.mapp'
    || window.location.hostname === 'fgstore.pro'
    || window.location.hostname === 'fgstore.plw'
    || window.location.hostname === 'malakan.web'
    || window.location.hostname === 'rpjewel.web'

    || window.location.hostname === 'hdstore.web'
    || window.location.hostname === 'hdstore.mapp'
    || window.location.hostname === 'hdstore.pro'
    || window.location.hostname === 'hdstore.plw'
    || window.location.hostname === 'mddesignworld.web'

    || window.location.hostname === 'elvee.web'
    || window.location.hostname === 'diamondtine.web'
    || window.location.hostname === 'stamford.web'
    || window.location.hostname === 'forevery.web'
    || window.location.hostname === 'hoq.web') ? 'http://zen/api/ReactStore.aspx' : 'https://api.optigoapps.com/ReactStore/ReactStore.aspx';
  // || window.location.hostname === 'hoq.web') ? 'http://zen/api/ReactStore.aspx' : 'https://api.optigoapps.com/test/ReactStore.aspx';
  // const APIURL = (window.location.hostname === 'localhost' || window.location.hostname === 'zen') ? 'http://zen/api/ReactStore.aspx' : 'https://api.optigoapps.com/storev26/ReactStore.aspx';
  // const APIURL = 'http://zen/api/ReactStore.aspx'

  const header = {
    Authorization: 'Bearer optigo_json_api',
    // domain: (window.location.hostname === 'localhost' || window.location.hostname === 'zen') ? 'forevery.web' : window.location.hostname,
    // domain: (window.location.hostname === 'localhost' || window.location.hostname === 'zen') ? 'elvee.web' : window.location.hostname,
    // domain: (window.location.hostname === 'localhost' || window.location.hostname === 'zen') ? 'fgstore.web' : window.location.hostname,
    // domain: (window.location.hostname === 'localhost' || window.location.hostname === 'zen') ? 'fgstore.pro' : window.location.hostname,
    // domain: (window.location.hostname === 'localhost' || window.location.hostname === 'zen') ? 'fgstore.plw' : window.location.hostname,
    // domain: (window.location.hostname === 'localhost' || window.location.hostname === 'zen') ? 'fgstore.mapp' : window.location.hostname,
    // domain: (window.location.hostname === 'localhost' || window.location.hostname === 'zen') ? 'fgstorepro.mapp' : window.location.hostname,
    // domain: (window.location.hostname === 'localhost' || window.location.hostname === 'zen') ? 'fgstore.mapp' : window.location.hostname,
    // domain: (window.location.hostname === 'localhost' || window.location.hostname === 'zen') ? 'diamondtine.web' : window.location.hostname,
    // domain: (window.location.hostname === 'localhost' || window.location.hostname === 'zen') ? 'hoq.web' : window.location.hostname,
    // domain: (window.location.hostname === 'localhost' || window.location.hostname === 'zen') ? 'malakan.web' : window.location.hostname,
    domain: (window.location.hostname === 'localhost' || window.location.hostname === 'zen') ? 'rpjewel.web' : window.location.hostname,
    // domain: (window.location.hostname === 'localhost' || window.location.hostname === 'zen') ? 'stamford.web' : window.location.hostname,
    // domain: (window.location.hostname === 'localhost' || window.location.hostname === 'zen') ? 'demostore' : window.location.hostname,
    // domain: (window.location.hostname === 'localhost' || window.location.hostname === 'zen') ? 'forevery.web' : window.location.hostname,
    version: 'Live',
    sp: "1",
    sv: 0
  };

  let response

  try {
    const body = {
      "con": "{\"id\":\"\",\"mode\":\"store_init\"}",
      "p": "",
      "f": "formname (init)",
    };
    response = await axios.post(APIURL, body, { headers: header });
    console.log(response);
  } catch (error) {
    console.error('Error:', error);
  }

  return response;
};
