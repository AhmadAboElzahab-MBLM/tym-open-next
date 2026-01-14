function distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    } else {
      var radlat1 = Math.PI * lat1 / 180;
      var radlat2 = Math.PI * lat2 / 180;
      var theta = lon1 - lon2;
      var radtheta = Math.PI * theta / 180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
          dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "K") { dist = dist * 1.609344 }
      if (unit == "N") { dist = dist * 0.8684 }
      return dist;
    }
  }
  
  function getDealers(state, country) {
    var dealersInState = dealersObject.filter(function(dealer) {
      return (country == '' || dealer.properties.country == country) && (state == '' || dealer.properties.state == state);
    })
  
    dealersInState.sort(function(a, b) {
      let x = a.properties.company.toUpperCase(),
      y = b.properties.company.toUpperCase();
  
      return x == y ? 0 : x > y ? 1 : -1;
    });
  
    dealersInState.sort(function(a, b) {
      var distA = 0,
      distB = 0;
  
      if (a.latitude != null && a.longitude != null)
        distA = distance(lat, long, a.latitude, a.longitude, "K");
  
      if (b.latitude != null && b.longitude != null)
        distB = distance(lat, long, b.latitude, b.longitude, "K");
  
      if (distA > distB && (distA < 300 || distB < 300)) {
        return 1;
      } else if (distA < distB && (distA < 300 || distB < 300)) {
        return -1;
      } else {
        return 0;
      }
    });
  
    let dealerList = dealersInState.map(function(d) {
      var market = d.properties.market_2;
      if (market == 'Domestic') {
          market = 'South Korea';
      }
      
      return d;
    });
  
    return dealerList;
  }
  
  async function fixDealersData(dealers) {
    const dealersArr = [];
  
    for (let d of dealers) {
      let prop = d.properties;
      prop.id = d.id;
  
      dealersArr.push(prop);
    }
  
    return dealersArr;
  }
  
  // let dealersObject = [];
  // let lat = null;
  // let long = null;
  // let country = null;
  // let state = null;
  
  async function fetchDealers() {
    try {
      const r = await fetch('https://api.ipstack.com/check?access_key=80d497acc7e09006788e01dd926b22aa&format=1');
      const response = await r.json();
  
      // const rr = await fetch('/umbraco/api/Dealers/GetDealers');
      const rr = await fetch(
        '/dealers',
        {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          },
          redirect: 'follow',
          referrerPolicy: 'no-referrer'
        }
      );
      const res = await rr.json();
      // const fixedDealersData = await fixDealersData(res.data);
  
      window.dealersObject = res.data // fixedDealersData;
      window.state = response.continent_code == "NA" ? response.region_name : "";
      window.country = response.country_name
      window.lat = response.latitude;
      window.long = response.longitude;
    } catch (err) {
      window.dealersObject = [];
      window.lat = null;
      window.long = null;
      window.country = null;
      window.state = null;
      console.log('Error fetching dealers', err);
    }
  };
  
  fetchDealers();