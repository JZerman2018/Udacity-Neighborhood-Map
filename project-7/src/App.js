import React, { Component } from 'react';
import './App.css';
import axios from 'axios'
import Navbar from './Navbar_backup'
import Menu from './Menu'

window.gm_authFailure=()=>{ 
 alert('OOPS! An Error occurred while fetching GoogleMaps API! Please try again later.');
};

//variable to handle api failure
const fourSquareFailMsg = 'OOPS! An Error occurred while fetching data from FourSquare API! Please try again later.';

class App extends Component {
  state = {
    venues: [],
    markers: []
  }

  //do this right after the component is added to the DOM
  componentDidMount(){
    this.getVenues();//invoking getVenues function
  }

  updateMarkers(){
    const listItems = document.getElementsByTagName('li');
    const listItemsArray = Array.from(listItems);

    const visibleListItems = listItemsArray.filter(li=>li.offsetParent!=null);
    const listIds = visibleListItems.map(item=>item.getAttribute('id'));
  }

  loadMap=()=>{
    loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyBqKIezQ6vPrfhO0UgjsPZcD4EbpkRiSNg&callback=initMap');
    window.initMap = this.initMap;
  }
  
  getVenues=()=>{
    //getting information from foursquare Api
    const endPoint = 'https://api.foursquare.com/v2/venues/explore?';
    const parameters = {
      client_id: '0HWDBVRB2JSKVNZHY1PCJE0P2GQLV2U2ZD0BYKGS2RR125FW',
      client_secret: '2HIXLJWVN0BUHFCSUSJZCWJF0AHQNX3TMHFO0VW5C4DF35U2',
      query: 'wings',
      near: 'Jacksonville',
      v: '20181003' 
    }

    //installed axios- npm install axios //axios is similar to fetch
    axios.get(endPoint + new URLSearchParams(parameters))
    .then(response => {
      this.setState({//setting the state with the data we got from the ajax call
        venues: response.data.response.groups[0].items,
      }, this.loadMap()) //calling this.loadMap() as a callback - which gets invoked after our ajax call is successful
    })
    .catch(err=>{
      alert(`${fourSquareFailMsg} ${err}`)
    })
  }

  initMap=()=>{

      //creating a map
       let myMap = new window.google.maps.Map(document.getElementById('map'), {
          center: {lat: 30.332184, lng: -81.655},
          zoom: 10
       
        });
      
       const infoWindow = new window.google.maps.InfoWindow();

       //looping through the venues array which is inside this.state to generate markers
       this.state.venues.map(eachVenue => {
        console.log(eachVenue);
        //const name = `${eachVenue.venue.name}`;
        //const address = `${eachVenue.venue.location.formattedAddress}`;

        /*const imgURL = getImgURL=(id)=>{
          const prefix = ;
          const suffix = ;
          const size = ;
          const url = prefix+size+suffix
        }*/
      
        var contentString = `<div id="info" tabIndex="0">   
        <h3>${eachVenue.venue.name}</h3>
        <p>${eachVenue.venue.location.formattedAddress[0]}<br>
        ${eachVenue.venue.location.formattedAddress[1]}</p>
        </div>`;
      
        //animate marker
        function toggleBounce(marker) {
          marker.setAnimation(window.google.maps.Animation.BOUNCE);
          setTimeout(function(){
            marker.setAnimation(null);
          }, 2000);
        }
        
        //creating a marker for each venue
        const myMarker = new window.google.maps.Marker({
          position: {lat: eachVenue.venue.location.lat, lng: eachVenue.venue.location.lng},
          map: myMap,
          title: eachVenue.venue.name,
        });

        //adding event listener to each marker
        myMarker.addListener('click', function(e) {

          toggleBounce(this);

          //change the content
           infoWindow.setContent(contentString)

          //open an infoWindow
          infoWindow.open(myMap, myMarker);

        });
      
        this.setState({
          markers: [...this.state.markers, myMarker]
       });

      });
    }

  render() {
    return (
      <main>
      <Navbar
      venues = {this.state.venues}
      map = {this.state.myMap}
      markers = {this.state.markers}
      changeState = {this.updateMarkers}
      />
      <Menu/>
      <div id="map" role="application" aria-label="Map" tabIndex="-1"></div>
      </main>
    );
  }
}

function loadScript(url){
  const index = window.document.getElementsByTagName('script')[0];
  const script = window.document.createElement('script');
  script.defer = true;
  script.async = true;
  script.src = url;
  script.onerror = window.gm_authFailure;
  index.parentNode.insertBefore(script, index);//parent.parentNode.insertBefore(child, parent);
}

export default App;










/*import React, { Component } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import Menu from './Menu';
import './App.css';




window.gm_authFailure=()=>{ 
  alert('OOPS! An Error occurred while fetching GoogleMaps API! Please try again later.');
 };
 
 //variable to handle api failure
 const fourSquareFailMsg = 'OOPS! An Error occurred while fetching data from FourSquare API! Please try again later.';


class App extends Component {
  state = {
    venues: [],
    markers: []
  }

  //do this right after the component is added to the DOM
  componentDidMount() {
    this.getVenues()//invoking getVenues function
  }

  updateMarkers(){
    const listItems = document.getElementsByTagName('li');
    const listItemsArray = Array.from(listItems);

    const visibleListItems = listItemsArray.filter(li=>li.offsetParent!=null);
    const listIds = visibleListItems.map(item=>item.getAttribute('id'));
    
  }

  renderMap=()=>{
    loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyBqKIezQ6vPrfhO0UgjsPZcD4EbpkRiSNg&callback=initMap');
    window.initMap = this.initMap;
  }

  getVenues=()=>{
    //getting information from foursquare Api
    const endPoint = 'https://api.foursquare.com/v2/venues/explore?';
    const parameters = {
      client_id: '0HWDBVRB2JSKVNZHY1PCJE0P2GQLV2U2ZD0BYKGS2RR125FW',
      client_secret: '2HIXLJWVN0BUHFCSUSJZCWJF0AHQNX3TMHFO0VW5C4DF35U2',
      query: 'wings',
      near: 'Jacksonville',
      v: '20181003' 
  }

//installed axios- npm install axios //axios is similar to fetch
axios.get(endPoint + new URLSearchParams(parameters))
.then(response => {
  this.setState({//setting the state with the data we got from the ajax call
    venues: response.data.response.groups[0].items,
  }, this.renderMap()) //calling this.initMap() as a callback - which gets invoked after our ajax call is successful
})
.catch(error=>{
  alert(`${fourSquareFailMsg} ${error}`)
})
  }

initMap = () =>{

  //creating a map
   let myMap = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 30.332184, lng: -81.655},
      zoom: 10
    });

   let infoWindow = new window.google.maps.InfoWindow({ maxWidth: 280 })

   //looping through the venues array which is inside this.state to generate markers
   this.state.venues.map(eachVenue => {
    console.log(eachVenue);
    //const name = `${eachVenue.venue.name}`;
    //const address = `${eachVenue.venue.location.formattedAddress}`;
   })
  };
}
    const contentString = `<div id="info" tabIndex="0">   
    <h3>${eachVenue.venue.name}</h3>
    <p>${eachVenue.venue.location.formattedAddress[0]}<br>
    ${eachVenue.venue.location.formattedAddress[1]}</p>
    </div>`;
   
    //animate marker
function toggleDrop(marker) {
  marker.setAnimation(window.google.maps.Animation.DROP);
  setTimeout(function(){
    marker.setAnimation(null);
  }, 1500);
}
    
//creating a marker for each venue
    
const theMarker = new window.google.maps.Marker({
      position: {lat: eachVenue.venue.location.lat, lng: eachVenue.venue.location.lng},
      title: eachVenue.venue.name,
      map: myMap
    })

//adding event listener to each marker
theMarker.addListener('click', function(e) {

  toggleDrop(this);

  //change the content
   infoWindow.setContent(contentString);

  //open an infoWindow
  infoWindow.open(myMap, theMarker);
})

// adds markers to the markers array
this.setState({
  markers: [...this.state.markers, theMarker]
    });
  });


     
render() {
    return (
    <main>
      <Navbar
      venues = {this.state.venues}
      map = {this.state.myMap}
      markers = {this.state.markers}
      changeState = {this.updateMarkers}
      />
      <Menu/>
      <div id="map" role="application" aria-label="Map" tabIndex="-1"></div>
      </main>  
    );
  }
}

function loadScript(url){
  const index = window.document.getElementsByTagName('script')[0];
  const script = window.document.createElement('script');
  script.defer = true;
  script.async = true;
  script.src = url;
  script.onerror = window.gm_authFailure;
  index.parentNode.insertBefore(script, index);//parent.parentNode.insertBefore(child, parent);
}

export default App;*/