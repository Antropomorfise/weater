import React, { Component } from "react"; 
import axios from 'axios'; 
import Button from '@material-ui/core/Button' 
import Container from '@material-ui/core/Container'; 
import Radio from '@material-ui/core/Radio' 
import { styled } from '@material-ui/styles'; 

class App extends Component { 

  constructor(props){ 
  super(props) 
    this.state = { 
      id: "1", 
      hours: new Date().getHours(), 
      data: { 
        city: undefined, 
        temp_c: null, 
     }}; 
    } 

  componentWillMount() { 

  const city = localStorage.getItem('city'); 
  const temp_c = localStorage.getItem('temp_c'); 

  if(city === undefined){ 
    this.setState({ city, temp_c }); 
  } else { 
    this.getCity(); 
    this.setState({ city, temp_c }); 
  } 
    this.checkTimeFromStorage(); 
  } 

  //Получаем город 
  getCity() { 
    axios 
    .get('https://ipinfo.io') 
    .then(response => { 
      this.setState({ data: response.data }); 
    }); 
  } 

  //получаем погоду для города с помощью state.id 
  getWeather = async (event) => { 
  event.preventDefault(); 

  const {hours} = this.state 

  var url = `https://api.weatherbit.io/v2.0/current?city=${this.state.data.city}&key=1f17cabc0951462bae7a851e31772cd4` 
  var api_url = await fetch(url); 
  var data = await api_url.json(); 

  if(this.state.id === "1") { 
    this.setState({ 
      city: data.data[0].city_name, 
      temp_c: data.data[0].app_temp, 
      hours: hours }) 
  } else { 

    url = `https://api.apixu.com/v1/current.json?key=e9b0b0d0b5074b3388f195304190606&q=${this.state.data.city}` 
    api_url = await fetch(url); 
    data = await api_url.json(); 

  this.setState({ 
    city: data.location.name, 
    temp_c: data.current.temp_c, 
    hours: hours, 
  }) 
} 
    this.setItemsToLocalStorage(); 
  } 

  setItemsToLocalStorage() { 
    const { hours, city, temp_c } = this.state 
    localStorage.setItem('city', city); 
    localStorage.setItem('temp_c', temp_c); 
    localStorage.setItem('hours', hours); 
  }; 

  checkTimeFromStorage() { 
    const { hours } = this.state 
  if( this.state.hours > hours + 2 ) { 
    const city = localStorage.removeItem('city'); 
    const temp_c = localStorage.removeItem('temp_c'); 
    const hours = localStorage.removeItem('hours'); 
    this.setState({ city, hours, temp_c }); 
  } 
} 

  renderTemp(){ 
    if(this.state.temp_c !== null){ 
      return <p>Температура: {this.state.temp_c}</p> 
    } else { return; } 
  } 

  onChangeRadio = (event) => { 
    this.setState({ 
      [event.target.name]: event.target.value 
    }) 
  } 

  render() { 
    return ( 
      <Container> 
        <h1>Город:{this.state.data.city}</h1> 

        <MyButton onClick={this.getWeather}> 
        Узнать погоду от: 
        </MyButton><br/> 

        <Radio 
        name="id" 
        value="1" 
        checked={this.state.id === "1"} 
        onChange={this.onChangeRadio} 
        /> Weatherbit <br/> 

        <Radio 
        name="id" 
        value="2" 
        checked={this.state.id === "2"} 
        onChange={this.onChangeRadio} 
        /> Apixy <br/> 
        
        {this.renderTemp()} 
      </Container>
    ); 
  } 
} 

export default App;

const MyButton = styled(Button)({ 
background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)', 
border: 0, 
borderRadius: 19, 
boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)', 
color: 'white', 
height: 48, 
padding: '0 30px', 
}); 
